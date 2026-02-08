#!/usr/bin/env node
/**
 * knowledgebase/scripts/ingest.mjs
 *
 * Ingest arbitrary text and store trading/investment knowledge as LLM-friendly Markdown.
 *
 * Requires:
 *   - Node.js 18+
 *   - ANTHROPIC_API_KEY in env (for auto topic + summary)
 */

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

// Topics are intentionally extensible. Don't remove topics; add new ones if needed.
const TOPICS = [
  "cryptocurrency",
  "prediction_market",
  "technical_analysis",
  "technical_trading",
  "macro",
  "risk_management",
  "equities",
  "fx",
  "options",
  "portfolio",
  "trading_psychology",
  "market_microstructure",
  "fundamentals",
  "other",
];

function usage(exitCode = 1) {
  console.error(`Usage:
  cat note.txt | node scripts/ingest.mjs --source "book:Foo"
  node scripts/ingest.mjs --file note.txt --topic technical_analysis --source "my-notes"

Options:
  --file <path>            Read input text from file (otherwise stdin)
  --topic <topic>          Force topic folder (one of: ${TOPICS.join(", ")})
  --source <string>        Optional source label stored in frontmatter
  --source-title <string>  Article title (for ## Source section)
  --source-author <string> Author (for ## Source section)
  --source-url <string>    URL (for ## Source section)
  --source-published <str> Publish time (for ## Source section; ISO recommended)
  --outdir <dir>           Base output dir (default: ./knowledge)
  --help                   Show this help
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const out = {
    file: null,
    topic: null,
    source: null,
    sourceTitle: null,
    sourceAuthor: null,
    sourceUrl: null,
    sourcePublished: null,
    outdir: "knowledge",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") usage(0);
    if (a === "--file") out.file = argv[++i];
    else if (a === "--topic") out.topic = argv[++i];
    else if (a === "--source") out.source = argv[++i];
    else if (a === "--source-title") out.sourceTitle = argv[++i];
    else if (a === "--source-author") out.sourceAuthor = argv[++i];
    else if (a === "--source-url") out.sourceUrl = argv[++i];
    else if (a === "--source-published") out.sourcePublished = argv[++i];
    else if (a === "--outdir") out.outdir = argv[++i];
    else {
      console.error(`Unknown arg: ${a}`);
      usage(1);
    }
  }
  return out;
}

async function readStdin() {
  return await new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "note";
}

function stripCodeFences(s) {
  const trimmed = s.trim();
  // Remove ```json ... ``` fences
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z0-9_-]*\n?/m, "").replace(/```\s*$/m, "").trim();
  }
  return trimmed;
}

function clampTopic(topic) {
  if (!topic) return null;
  const t = topic.trim();
  return TOPICS.includes(t) ? t : "other";
}

function ensureClaudeAvailable() {
  // Hard-fail early if Claude Code is not available.
  const r = spawnSync("claude", ["--version"], { encoding: "utf8", timeout: 8000 });
  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(
      `Claude Code CLI is not available (claude --version exited ${r.status}). stderr: ${String(r.stderr || "").trim()}`
    );
  }
}

async function claudeExtract({ text, forcedTopic }) {
  ensureClaudeAvailable();

  // Claude Code CLI uses ANTHROPIC_API_KEY for API-key auth.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required for extraction/classification");
  }

  const prompt = `You extract durable trading/investment knowledge from raw text.

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "topic": one of ${JSON.stringify(TOPICS)},
  "tags": string[],
  "key_points": string[]
}

Guidelines:
- Focus on durable principles, definitions, heuristics, and actionable takeaways.
- **LASER FOCUS on durable TRADING STRATEGIES** (mechanics, entry/exit, logic, edge) rather than general descriptions.
- Ignore fluff and story.
- tags: 3-8 short snake_case tags.
- key_points: 5-15 bullets, each self-contained.
- Do NOT include a long prose section; condense into key points only.
- If FORCED_TOPIC is provided, use it exactly.

FORCED_TOPIC: ${forcedTopic ?? ""}

TEXT:
${text}`;

  // Claude Code CLI can hang when not attached to a TTY. We force a pseudo-TTY
  // using `script` and capture stdout.
  const { spawn } = await import("node:child_process");
  const { mkdtemp, writeFile } = await import("node:fs/promises");
  const os = await import("node:os");

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "kb-"));
  const promptPath = path.join(tmpDir, "prompt.txt");
  await writeFile(promptPath, prompt, "utf8");

  const budget = process.env.CLAUDE_MAX_BUDGET_USD || "0.15";

  const bashCmd = `
set -euo pipefail
# script allocates a pseudo-tty; output goes to stdout.
# We avoid complex shell-escaping by piping the prompt via stdin.
script -q -c "cat ${JSON.stringify(promptPath)} | claude -p --output-format text --permission-mode dontAsk --max-budget-usd ${budget} --no-session-persistence" /dev/null
`;

  const child = spawn("bash", ["-lc", bashCmd], {
    env: { ...process.env, ANTHROPIC_API_KEY: apiKey },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let out = "";
  let err = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (d) => (out += d));
  child.stderr.on("data", (d) => (err += d));

  const code = await new Promise((resolve) => child.on("close", resolve));
  if (code !== 0) {
    throw new Error(`claude exited with code ${code}: ${err.trim()}`);
  }

  // `script` can add terminal noise; strip common escape sequences.
  out = out.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "");

  const cleaned = stripCodeFences(out);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not locate JSON object in claude output. Raw output:\n${cleaned.slice(0, 2000)}`);
  }
  const jsonText = cleaned.slice(start, end + 1);
  const parsed = JSON.parse(jsonText);

  // Basic normalization
  parsed.topic = clampTopic(forcedTopic ?? parsed.topic) ?? "other";
  parsed.tags = Array.isArray(parsed.tags) ? parsed.tags.map(String) : [];
  parsed.key_points = Array.isArray(parsed.key_points) ? parsed.key_points.map(String) : [];
  parsed.title = String(parsed.title ?? "Untitled").trim() || "Untitled";

  return parsed;
}

function toMarkdown({ id, title, topic, tags, createdAt, source, sourceMeta, keyPoints }) {
  const ts = sourceMeta?.publish_time ?? "NA";

  const fm = [
    "---",
    `id: ${id}`,
    `title: ${JSON.stringify(title)}`,
    `topic: ${topic}`,
    `tags: ${JSON.stringify(tags)}`,
    `created_at: ${createdAt}`,
    `source: ${source ? JSON.stringify(source) : "null"}`,
    `source_timestamp: ${JSON.stringify(ts)}`,
    "---",
    "",
  ].join("\n");

  const sm = {
    title: sourceMeta?.title ?? null,
    author: sourceMeta?.author ?? null,
    url: sourceMeta?.url ?? null,
    publish_time: ts,
  };

  const md = [
    fm,
    "## Key points",
    ...(keyPoints.length ? keyPoints.map((p) => `- ${p}`) : ["- (none)"]),
    "",
    "## Source",
    `- Title: ${sm.title ?? "(unknown)"}`,
    `- Author: ${sm.author ?? "(unknown)"}`,
    `- URL: ${sm.url ?? "(unknown)"}`,
    `- Publish time: ${sm.publish_time ?? "(unknown)"}`,
  ].join("\n");

  return md.trimEnd() + "\n";
}

async function readJsonFile(p, fallback) {
  try {
    const s = await fs.readFile(p, "utf8");
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const text = args.file ? await fs.readFile(args.file, "utf8") : await readStdin();
  const cleaned = String(text ?? "").trim();
  if (!cleaned) {
    console.error("No input text provided (file empty or stdin empty).\n");
    usage(1);
  }

  const forcedTopic = args.topic ? clampTopic(args.topic) : null;
  if (args.topic && !forcedTopic) {
    console.error(`Unknown topic '${args.topic}'. Allowed: ${TOPICS.join(", ")}`);
    process.exit(1);
  }

  const extracted = await claudeExtract({ text: cleaned, forcedTopic });

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const topic = extracted.topic || forcedTopic || "other";
  const title = extracted.title;
  const slug = slugify(title);

  const baseDir = path.resolve(process.cwd(), args.outdir);
  const topicDir = path.join(baseDir, topic);
  await fs.mkdir(topicDir, { recursive: true });

  const stamp = createdAt.replace(/[:.]/g, "-").replace("Z", "Z");
  const filename = `${stamp}-${slug}.md`;
  const outPath = path.join(topicDir, filename);

  const md = toMarkdown({
    id,
    title,
    topic,
    tags: extracted.tags || [],
    createdAt,
    source: args.source || null,
    sourceMeta: {
      title: args.sourceTitle,
      author: args.sourceAuthor,
      url: args.sourceUrl,
      publish_time: args.sourcePublished,
    },
    keyPoints: extracted.key_points || [],
  });

  await fs.writeFile(outPath, md, "utf8");

  // Maintain a lightweight, embeddings-ready index.
  const indexPath = path.join(topicDir, "_index.json");
  const index = await readJsonFile(indexPath, { topic, entries: [] });
  index.topic = topic;
  index.entries = Array.isArray(index.entries) ? index.entries : [];

  const entry = {
    id,
    title,
    topic,
    tags: extracted.tags || [],
    created_at: createdAt,
    source: args.source || null,
    source_timestamp: args.sourcePublished || "NA",
    path: path.relative(process.cwd(), outPath),
  };

  // de-dupe by id
  const existing = new Set(index.entries.map((e) => e?.id).filter(Boolean));
  if (!existing.has(id)) index.entries.unshift(entry);

  await fs.writeFile(indexPath, JSON.stringify(index, null, 2) + "\n", "utf8");

  // Print the path of the written file.
  process.stdout.write(path.relative(process.cwd(), outPath) + "\n");
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
