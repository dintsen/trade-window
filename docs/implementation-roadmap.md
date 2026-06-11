# Implementation Roadmap

## Phase 1 — Gno protocol architecture
* Docs and realm structure

## Phase 2 — Gno intent commitment MVP
* Create/cancel/expire/commit intent

## Phase 3 — Adena / GnoConnect research
* Wallet connection and realm calls

## Phase 4 — Frontend calls Gno realm
* Read-only or testnet prototype

## Phase 5 — Fee logic / utility token placeholder
* No investment language

## Phase 6 — AtomOne / Cosmos wallet path
* Keplr and Cosmostation

## Phase 7 — IBC 2.0 research
* No unsupported execution claims


### Gno.land Architecture Note
* **Gno.land Protocol Layer**: Gno smart contracts / realms are the planned authoritative protocol layer.
* **Go Backend**: Coordinates realtime state and acts as a mock room for the current demo.
* **Frontend**: Next.js UI that renders state and will later call wallet/contract APIs directly.
* **Current State**: The Gno layer currently stores commitments and registry placeholders.
* **Limitations**: Real settlement is not implemented yet. No actual token, NFT, or RWA transfers are claimed to work in this MVP.


---
### Current Architectural Positioning
* **Core Definition**: Trade Window = Gno.land smart-contract commitment layer + Go coordination backend + Next.js trade UI.
* **Adena Priority**: Adena is the priority wallet path. The current implementation is a read-only/detection prototype only.
* **Limitations**: There is no real signing and no real settlement implemented yet.
* **Gno Contracts**: The Gno contracts are a local validated commitment scaffold. Deployment is not implemented.

### Current State: Adena Read-Only Prototype
- Adena detection and connection are implemented (read-only).
- Mock Wallet remains default.
- Signing, Gno deployment, and settlement are **NOT** implemented yet.

### Current State: Gno Local Deployment Dry Run Blocked
- `gno` and `gnokey` tooling is installed.
- `gnoland` dev node is missing, blocking local deployment.
- Frontend intent preview is functional.
- Adena signing, public deployment, and IBC transfers are NOT implemented.
