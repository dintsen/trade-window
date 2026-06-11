# Trade Window Grant Proposal

## Abstract
Trade Window is a Gno.land-native OTC trade-room protocol and interface for safer negotiated P2P asset deals. We are applying for a grant to develop this protocol natively on Gno.land.

## Open Source and Licensing
* **License**: This project is licensed under Apache License 2.0.
* **Attribution**: Attribution is strictly preserved through the LICENSE and NOTICE files.
* **Open Protocols**: Gno contracts and protocol interfaces are intended to be publicly reviewable and forkable.

## Gno.land Smart Contract Protocol Layer
* **Gno.land smart contracts / realms are the protocol layer.**
* Go backend is not the settlement/protocol authority.
* Frontend is not the settlement/protocol authority.
* Go backend coordinates realtime room state.
* Gno smart contracts store protocol commitments, fee logic, registry and future OTC board.

## Current Prototype State
* **MVP / Research Prototype**: The current implementation is strictly an MVP and research prototype. Do not claim production status.
* **No Real Settlement**: Real asset settlement is not implemented.
* **No Real Signing**: Production wallet signing is not implemented.
* **No Asset Transfer**: No real token, NFT, or RWA transfers are implemented.
* **Local Gno**: The Gno contracts are a local validated commitment scaffold. Public deployment is not implemented.

## Roadmap Highlights
Phase 1 focuses on Gno protocol architecture (Docs and realm structure). Phase 2 delivers the Gno intent commitment MVP (Create/cancel/expire/commit intent). Later phases will introduce Adena wallet research, AtomOne path, and IBC 2.0.
