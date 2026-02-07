---
id: 21c2af4a-1200-4bb2-bd73-a50a14401fe6
title: "Inside UMA Oracle: How Prediction Markets Resolution Works"
topic: prediction_market
tags: ["uma_oracle","market_resolution","optimistic_oracle","oracle_design","dvm","polymarket","settlement_mechanics","game_theory"]
created_at: 2026-02-07T13:44:53.801Z
source: "https://rocknblock.io/blog/how-prediction-markets-resolution-works-uma-optimistic-oracle-polymarket"
---

## Key points
- Resolution converts YES/NO tokens to final payouts after market closes; blockchain requires oracles to verify off-chain events (elections, sports) for on-chain settlement
- UMA Optimistic Oracle operates on 'optimistic' assumption: assertions assumed valid unless disputed during liveness period (typically 2 hours to 2 days)
- Two-layer architecture: Optimistic Oracle (OO) handles ~98.5% of requests without dispute; Data Verification Mechanism (DVM) provides decentralized voting for disputed outcomes
- Economic security through bonded assertions: asserters and disputers post collateral; correct side earns rewards, incorrect side loses bonds; manipulation requires controlling majority of $UMA tokens
- Intersubjective data handling: UMA excels at verifying publicly observable but not purely objective data (election outcomes, sports results) through coordinated human judgment
- Resolution workflow: market closes → asserter posts bonded claim → liveness period for disputes → if no dispute, assertion accepted; if disputed, escalates to DVM vote (48-96 hours)
- DVM voting uses commit-reveal process: stakers submit vote hashes privately, then reveal votes for tallying; accurate votes earn rewards, incorrect/missing votes face slashing
- Price identifiers standardize data requests: YES_OR_NO_QUERY (UMIP-107) returns 1 for YES or 0 for NO; ancillary data provides context for resolution interpretation
- Polymarket uses UMA CTF Adapter to connect Conditional Tokens Framework with UMA Oracle for automated market settlement based on verified outcomes
- Game theory incentives: Schelling Point principle drives honest voting (expect others to report truth); dishonesty is costly, honesty is rewarded through bond redistribution
- Request-driven efficiency: unlike continuous price feeds (Chainlink), UMA provides data only when requested, reducing on-chain costs for unusual or one-time queries
- System resilience: open participation prevents centralized control; economic penalties for manipulation; slashing mechanism punishes non-participation or incorrect votes in DVM
