---
id: d84be38e-1002-4f75-b188-39c5f436b582
title: "UMA Optimistic Oracle for Polymarket Settlement"
topic: prediction_market
tags: ["uma_protocol","optimistic_oracle","settlement_mechanism","dispute_resolution","polymarket_infrastructure","oracle_design","schelling_point"]
created_at: 2026-02-08T04:09:15.842Z
source: "web:rocknblock"
---

## Key points
- UMA Optimistic Oracle resolves Polymarket outcomes via a three-phase system: request (contract asks for data), propose (asserter bonds an answer), dispute (challengers can contest during liveness window).
- Schelling Point Principle: participants are economically incentivized to report truthful outcomes because the majority answer determines rewards and penalties.
- Optimistic Oracle supports intersubjective data—outcomes agreed upon by observers but not objectively verifiable (e.g., election results, subjective criteria).
- Four key roles: Requester (market contract), Asserter (proposes bonded outcome), Disputer (challenges proposal), Voters (UMA stakers who resolve escalated disputes).
- Data Verification Mechanism (DVM) is the final dispute resolution layer, using commit-reveal voting to prevent coordination and front-running.
- Slashing penalizes incorrect or inactive DVM voters; their bonds are redistributed to voters who reported the correct outcome.
- YES_OR_NO_QUERY (UMIP-107) handles binary markets; MULTIPLE_VALUES (UMIP-183) reports up to seven integers per request for gas-efficient multi-outcome resolution.
- Managed Optimistic Oracle (MOOv2) restricts who can propose outcomes via whitelists to prevent invalid or premature proposals, while keeping disputes permissionless.
- Bond requirements and slashing create skin-in-the-game for all participants, aligning economic incentives with truthful reporting.
- Liveness period is the critical window during which disputes must be raised; after it expires, the proposed outcome is finalized on-chain.

## Source
- Title: Inside UMA Oracle | How Prediction Markets Resolution Works
- Author: Rock'n'Block
- URL: https://rocknblock.io/blog/how-prediction-markets-resolution-works-uma-optimistic-oracle-polymarket
- Publish time: 2025-10-29
