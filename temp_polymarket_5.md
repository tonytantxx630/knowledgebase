# How Prediction Market Arbitrage Works (Polymarket, Kalshi)

## What is Prediction Market Arbitrage?

In a perfectly efficient market, YES + NO always equals $1.00. But markets aren't always efficient - this creates arbitrage opportunities.

## The Basic Mechanism

Example: "Will Bitcoin hit $100k by March?"
- YES: $0.42
- NO: $0.55
- Total: $0.97

**Trade**: Buy both YES ($0.42) and NO ($0.55) for $0.97 total

**Outcome**:
- Bitcoin hits $100k → YES pays $1.00, NO pays $0 → You get $1.00
- Bitcoin doesn't hit → YES pays $0, NO pays $1.00 → You get $1.00

**Profit**: $0.03 per pair, guaranteed, regardless of outcome.

## Why the Gap Exists

### 1. After News Breaks
When new information hits, traders rush to buy one side. That price jumps, but the other side hasn't adjusted yet. Gap opens.

### 2. Low Liquidity
If barely anyone is trading a market, prices get stale. One side updates while the other lags.

### 3. Different Platforms
Polymarket might price YES at $0.45 while Kalshi prices NO on the same event at $0.52 - same event, different markets.

## Scaling Arbitrage

| Pairs | Cost | Payout | Profit |
|-------|------|--------|--------|
| 1 | $0.97 | $1.00 | $0.03 |
| 100 | $97 | $100 | $3 |
| 1,000 | $970 | $1,000 | $30 |
| 10,000 | $9,700 | $10,000 | $300 |

Return is small per unit but risk-free. The question is how many pairs you can buy before price moves.

## The Catches

### 1. Fees
- Polymarket charges taker fees only - maker orders (limit orders on book) pay zero fees
- Kalshi charges transaction fees on expected earnings
- Gap must be large enough to survive fees

### 2. Slippage
Price you see isn't always price you get. If you try to buy 1,000 YES at $0.42, there might only be 200 available. Rest fills at $0.43, $0.44 - gap shrinks or disappears.

### 3. Speed
Windows last seconds, not minutes. By time you spot gap and click buy, someone else took it. This is why arbitrage is done by bots - programs watching prices and executing in milliseconds.

### 4. Liquidity
Thin markets have bigger gaps but can't absorb large orders. Liquid markets have smaller gaps but can handle bigger positions.

## Key Takeaways

- Gap must survive fees, slippage, and execution time
- Most opportunities aren't worth it for humans clicking buttons
- Automated systems watching hundreds of markets simultaneously make small edges add up
- Prediction markets are becoming real-time layer on everything - politics, crypto, macro

## Source

- URL: https://www.trevorlasn.com/blog/how-prediction-market-polymarket-kalshi-arbitrage-works
- Author: Trevor Lasn
