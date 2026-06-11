# Trade Window Project Context

## Product Identity
Trade Window is a Gno.land-native OTC trade-room protocol and interface for safer negotiated P2P asset deals.

## Architecture & Layers
1. **Gno.land Smart Contracts / Realms (Protocol Layer):** Stores protocol commitments, fee logic, registry, and future OTC board. The ultimate authority of the application.
2. **Go WebSocket / Coordination Backend (Coordination Layer):** Handles live room synchronization, temporary chat, system logs, countdown broadcast, and temporary room state. It is authoritative *only* for live room state in the mocked MVP; Gno contracts are the planned protocol commitment layer.
3. **Next.js Trade Window UI (Frontend):** Handles user interface, asset inspection display, trade-room UX, final intent preview, and eventually wallet connections and contract calls.

## Current State
The current MVP is mocked and does not execute production settlement. Real asset settlement is a later phase and must be researched before claiming support. Future integrations include Adena wallet signing, AtomOne / Cosmos support, and IBC.


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

## Phase 3 Update: Adena Wallet Prototype
- **First Real Wallet Path:** Adena is the first real wallet path supported for the Gno.land smart-contract layer.
- **Read-Only Connection:** The current Adena integration is a read-only connection prototype.
- **No Signing or Settlement Yet:** No signing, broadcasting, or asset settlement is implemented.
- **Commitment Scaffold:** Gno contracts are local commitment scaffold. Gno deployment is not implemented.
- **Coordination Layer:** The Go backend remains the realtime coordination layer.
- **MVP Fallback:** The Mock Wallet remains active as the MVP fallback.

## Phase 4 Update: Gno Local Deployment Dry Run
- **Local Tooling Checked:** The `gno` and `gnokey` CLIs are present. However, the `gnoland` local dev node is NOT installed.
- **Local Deployment Blocked:** Real local deployment to a dev chain cannot be completed due to the missing node daemon.
- **Frontend State:** The frontend remains in a preview-only state, correctly structuring and displaying the future `CreateRoomCommitment` payload without actually calling `gnokey` or broadcasting anything.
