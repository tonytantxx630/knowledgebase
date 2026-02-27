## Polymarket Maker Rebates Program 2026

### Overview

Polymarket has enabled taker fees on 15-minute crypto markets, 5-minute crypto markets, and sports markets (NCAAB, Serie A). These fees fund a Maker Rebates program that pays daily USDC rebates to liquidity providers.

### Why Maker Rebates Matter

When liquidity is deeper:
- Spreads tend to be tighter
- Price impact is lower
- Fills are more reliable
- Markets are more resilient during volatility

### How Maker Rebates Work

- **Paid daily in USDC**: Rebates calculated and distributed every day
- **Performance-based**: Earn based on share of liquidity you provided that got taken
- **Eligibility**: Place orders that add liquidity to the book and get filled

### Rebate Rates by Market Type

| Market Type | Start Date | Maker Rebate |
|-------------|------------|--------------|
| 15-Min Crypto | Jan 19, 2026 | +20% |
| 5-Min Crypto | Feb 12, 2026 | +20% |
| Sports (NCAAB, Serie A) | Feb 18, 2026 | +25% |

### Fee-Curve Weighted Formula

Rebates distributed using formula:
```
fee_equivalent = C × p × feeRate × (p × (1 - p))^exponent
```

Where C = shares traded, p = share price

### Taker Fee Structure

Fees vary based on share price - highest at 50% probability, lowest at extremes.

**5-Min and 15-Min Crypto Markets**:
- Max effective fee: 1.56% at 50% probability
- Decreases toward extremes

**Sports Markets**:
- Max effective fee: 0.44% at 50% probability
- Lower overall fees than crypto markets

### Eligible Markets

- 15-minute crypto markets
- 5-minute crypto markets  
- NCAAB (college basketball) markets
- Serie A markets

All other markets remain fee-free.

### Strategy Implications

Under Polymarket's new rules, the advantage is shifting from taker arbitrage to a long-term structure centered around market-making and liquidity provision. This makes providing liquidity more sustainable for automated trading bots.