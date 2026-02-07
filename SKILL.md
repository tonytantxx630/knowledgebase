# Knowledgebase Skill

A tiny, file-based knowledgebase for trading & investing notes.

This repo contains a CLI ingestor that:

1) extracts durable trading/investment knowledge from raw text
2) classifies it into a topic (e.g. `technical_analysis`, `cryptocurrency`, `prediction_market`)
3) creates the topic folder if missing
4) stores the result as **LLM-friendly Markdown** (chunkable sections + YAML frontmatter)

## Quick start

### Ingest from stdin

```bash
cd knowledgebase
cat note.txt | node scripts/ingest.mjs --source "book:Foo"
```

### Ingest from file

```bash
cd knowledgebase
node scripts/ingest.mjs --file note.txt --source "my-notes"
```

### Force a topic

```bash
node scripts/ingest.mjs --file note.txt --topic technical_analysis --source "newsletter:Bar"
```

## Requirements

- Node.js 18+
- `ANTHROPIC_API_KEY` in the environment (used for summarization + topic classification)

## Output layout

```
knowledge/
  <topic>/
    _index.json
    <timestamp>-<slug>.md
```

### Markdown format

Each note is stored as Markdown with YAML frontmatter:

- `id` (uuid)
- `title`
- `topic`
- `tags` (array)
- `created_at` (ISO timestamp)
- `source` (URL)
- `source_timestamp` (ISO timestamp) ## This is the timestamp when the article was published if available. "N/A" if it cannot be found.

## Repo rules (apply to all future commits)

1) **Do not commit raw scraped sources** (no `sources/` directory in git). Sources should be kept as links in `source:` metadata, not as full copied articles.
2) **Do not write long prose “Details” sections** inside `knowledge/**/*.md`. Keep notes as concise, self-contained bullet points.

### Storage format

Notes are designed to be embeddings-ready without adding heavy dependencies:

- YAML frontmatter (metadata)
- Key points (bullet list)

### Topic index

Each topic has a lightweight `knowledge/<topic>/_index.json` listing entries.
This makes it easy for a future embedding/indexing pipeline to discover and chunk files.

## Repo structure

- `scripts/` - automation scripts (ingest lives here)
- `references/` - reference docs/templates
- `assets/` - static assets
