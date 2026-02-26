---
id: fa760a23-bc58-4e3b-b01f-a634b3106784
title: "Polymarket Trading Mechanics and Strategy Implications"
topic: prediction_market
tags: ["polymarket","binary_options","order_book","arbitrage","market_making","conditional_tokens","on_chain_trading"]
created_at: 2026-02-26T11:46:30.098Z
source: "web:rocknblock.io"
source_timestamp: "2026-02"
---

## Key points
- YES + NO shares always sum to $1.00 - this is the fundamental arbitrage constraint that defines all trading opportunities
- Mirrored orders: placing a buy order for YES at $0.40 automatically creates a mirrored sell order for NO at $0.60 (1 - 0.40)
- Price display rule: midpoint shown when bid-ask spread ≤ $0.10, otherwise last trade price is displayed
- Three execution types: Direct Match (exchange existing shares), Minting (create new shares when YES+NO prices = $1), Merge (burn shares when selling at complementary prices)
- Market makers should post tight quotes on both sides and monitor inventory closely to capture liquidity rewards
- Arbitrageurs must monitor YES + NO sum deviation from $1.00 - execution speed critical at sub-100ms with typical window of 2-15 seconds
- Directional traders benefit from using limit orders instead of market orders for better fill prices
- Order book depth matters: market orders can be partially filled across multiple price levels
- New market prices form when two matching limit orders appear with prices summing to $1.00
- Smart contracts (CTFExchange.sol, Trading.sol) handle execution on-chain while order matching occurs off-chain
- The hybrid CLOB architecture allows off-chain order placement with EIP-712 signatures but on-chain settlement in USDC

## Source
- Title: How Polymarket Works: Technical Deep Dive
- Author: RockNBlock
- URL: https://rocknblock.io/blog/how-polymarket-works-the-tech-behind-prediction-markets
- Publish time: 2026-02
