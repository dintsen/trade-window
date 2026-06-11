# Trade Window Product Specification

## Overview
Trade Window is a Gno.land-native OTC trade-room protocol and interface for safer negotiated P2P asset deals.

## Gno.land Smart Contract Protocol Layer
* **Gno.land smart contracts / realms are the protocol layer.**
* Go backend is not the settlement/protocol authority.
* Frontend is not the settlement/protocol authority.
* Go backend coordinates realtime room state.
* Gno smart contracts store protocol commitments, fee logic, registry and future OTC board.
* Real asset settlement is a later phase and must be researched before claiming support.
* Current MVP is mocked and not production settlement.

## On-chain vs Off-chain Boundary

### On-chain / Gno realm layer
Gno smart contracts should eventually handle:
* trade intent commitments;
* finalized trade hash;
* room metadata or commitment references;
* party addresses;
* status: created / committed / cancelled / expired / completed;
* fee accounting;
* future utility token fee logic;
* verified asset registry;
* OTC board listings;
* audit trail for finalized commitments.

### Off-chain / Go backend
Go backend should handle:
* live room synchronization;
* temporary chat;
* system logs;
* countdown broadcast;
* temporary room state;
* WebSocket events;
* offline/demo coordination;
* indexing later.

### Frontend
Frontend should handle:
* user interface;
* asset inspection display;
* trade-room UX;
* final intent preview;
* wallet connection later;
* calling Gno contracts later.


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
