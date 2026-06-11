# Security Architecture & Constraints

## CORS Limitations
The WebSocket connection explicitly validates origins via `CheckOrigin` against a strict `ALLOWED_ORIGINS` environment variable. By default, only local development environments (`localhost:3000`, `localhost:3001`) are allowed. Empty origins (such as native apps or cURL/Postman requests) are presently permitted to facilitate local QA and testing. This rule must be tightened before mainnet launch.

## State Mutability
Room state is authoritative on the backend only for live mock session coordination.
- Clients **cannot** forcibly manipulate countdown values.
- Clients **cannot** add assets to an unready room (e.g. while countdown is active or room is cancelled).
- `ToggleLock` actively prevents double-locking race conditions through the `StartCountdown()` atomicity constraint.

**Important Note on Protocol Authority**: The Go backend is *not* the final settlement/protocol authority. Future finalized commitments, signatures, and execution will be recorded and governed entirely by Gno.land smart contracts.

## Production Scaling Notes
The MVP handles state purely via in-memory maps (`h.Rooms`). While this works flawlessly for a single monolithic instance running the backend, it presents a horizontal scaling barrier. If the app is distributed behind a load balancer (e.g., Kubernetes ReplicaSets), websockets might route to instances unaware of the room state. 

**Future Solution:** Instead of heavy backend scaling, the final state synchronization and commitment layer will be offloaded to the Gno.land protocol.


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

### Adena Security Prototype
The Adena integration safely checks for `window.adena` and only calls `AddEstablish` upon explicit user interaction. It does not blindly prompt for signatures or perform automatic transactions, adhering strictly to read-only interaction limits.

### Local Deployment Safety
The `local-deploy-dry-run.sh` script enforces a strict check for the `gnoland` local node before attempting any deployment or interaction. Since the tool is missing, the script halts securely without making unintended network calls or attempting mainnet interactions.
