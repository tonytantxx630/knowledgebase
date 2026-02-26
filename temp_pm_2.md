# How Polymarket Works: Technical Deep Dive

## Summary

This technical guide explains how Polymarket's architecture functions, including its hybrid off-chain/on-chain order book, Conditional Tokens Framework for market conditions, and UMA's optimistic oracle for settlement. Understanding these mechanics is essential for developing trading strategies and understanding where edge can be found.

## Key Takeaways

- Polymarket uses a hybrid CLOB (Central Limit Order Book) combining off-chain matching with on-chain execution
- YES + NO shares always sum to $1.00 - this is the core mathematical constraint
- Order book shows mirrored orders for binary outcomes
- Market price displays as midpoint when spread <= $0.10, otherwise last trade price

## Core Mechanics

### Event Markets and Shares

Polymarket is an event market platform where users trade shares tied to different events. Each event is a yes-or-no question.

**Share Mechanics:**
- YES and NO are opposing outcomes for the same event
- Share prices range from $0 to $1
- Prices always sum to $1 between both outcomes
- Price reflects market's implied probability

**Example:**
- "Will TikTok be banned before May?"
- YES = $0.36 → 36% implied probability
- NO = $0.64 → 64% implied probability
- Sum = $1.00

### Order Book Architecture

Polymarket uses a **hybrid-decentralized CLOB**:

**Off-chain Components:**
- Backend operator tracks and matches orders
- Prepares data for market orders
- Users create orders off-chain with EIP-712 signatures
- Orders stay off-chain until execution

**On-chain Components:**
- Smart contracts handle calculations and execution
- Manages share contracts
- Handles settlement in USDC

### Mirrored Orders

The order book is designed for binary outcomes:

**How It Works:**
- User places limit order to buy 100 YES at $0.40
- System automatically shows mirrored order: sell 100 NO at $0.60
- Original order doesn't change - inversion is visual
- A buy becomes sell, price calculated as 1 minus original

**Core Principle:**
- One YES share + one NO share always equals $1
- Any order can be interpreted as its inverse
- This maintains unified order book for binary markets

## How Prices Are Calculated

### Initial Price Formation
- New markets start with no prices
- First prices appear when traders post limit orders
- When two matching orders appear (YES + NO = $1), a match occurs
- Those prices become the market's starting point

### Price Display Rules
- **Spread <= $0.10**: Display midpoint of spread as market price
  - Highest buy: $0.34, Lowest sell: $0 → spread = $0.02
  - Market price = $0.35
- **Spread > $0.10**: Display last executed trade price

## Order Execution Types

### 1. Direct Match (Normal)
One user buys, another sells at same price:
- System takes shares from seller
- Takes payment from buyer
- Transfers shares to buyer, funds to seller
- No new shares created

### 2. Minting (Creating New Shares)
When orders on opposite sides match:
- Order 1: Buy 100 YES at $0.35
- Order 2: Buy 50 NO at $0.65
- Prices add to $1.00 = valid match
- Protocol receives funds and mints new shares
- Alice gets 50 YES, Bob gets 50 NO
- Rest of Alice's order stays open

### 3. Merge (Burn Shares)
Reverse of minting:
- Sell orders on both sides at complementary prices
- System removes shares from circulation
- Burns shares, pays out dollar amounts

## Order Types

### Limit Orders
- Specific conditions must be met for execution
- Can include expiration time
- Can update or cancel without on-chain transactions

### Market Orders
- Instant execution at current market price
- Can be partially filled across multiple price levels
- System matches at best available prices

**Example:**
- Sell 100 YES at market price
- 40.27 shares available at $0.34
- Remaining 59.73 shares sell at $0.33
- Total: 40.27 × $0.34 + 59.73 × $0.33 = $33.40

## Smart Contracts

### CTFExchange.sol
- Handles order execution on-chain
- Manages user roles and fees
- Signature verification
- Currently zero fees built into logic

### Trading.sol
- Core exchange logic
- Asset management
- Trading rules implementation

## Trading Strategy Implications

**For Market Makers:**
- Post tight quotes on both sides
- Monitor inventory closely
- Take advantage of liquidity rewards

**For Arbitrageurs:**
- Monitor YES + NO sum deviation from $1.00
- Speed is critical - sub-100ms execution
- Window typically 2-15 seconds

**For Directional Traders:**
- Use limit orders for better fills
- Understand order book depth
- Watch for large orders that may move price

## Source

- Title: How Does Polymarket Work | The Tech Behind Prediction Markets
- Author: RockNBlock
- URL: https://rocknblock.io/blog/how-polymarket-works-the-tech-behind-prediction-markets
- Published: February 2026
