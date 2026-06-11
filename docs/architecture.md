# Trade Window Architecture

## System Components
1. **Gno.land Smart Contracts / Realms (Protocol Layer)**: The ultimate authority. Stores protocol commitments, fee logic, registry, and future OTC board.
2. **Backend (`services/backend-go`)**: A Go WebSocket server using Gorilla WebSockets. This forms the coordination layer across two disparate P2P browsers for live, temporary room state. It is authoritative *only* for live room state in the mocked MVP; Gno contracts are the planned protocol commitment layer.
3. **Frontend (`apps/web`)**: A Next.js 14+ React frontend tailored with Tailwind CSS. It handles user interface, asset inspection display, trade-room UX, and final intent preview.

## Data Flow
- **Lobby Phase**: Users generate intent on the Frontend and open a WebSocket channel. The Backend establishes their connection in a thread-safe Hub map.
- **Negotiation Phase**: JSON payloads (`offer:add`, `trade:lock`, `chat:message`) are synchronized strictly through the Go Hub to prevent tampering. Temporary UI room state and Chat remain off-chain.
- **Commitment Phase (Gno.land)**: The backend coordinates an Intent Hash. The Frontend will interact with the Gno smart contract to store trade intent commitments, finalized trade hash, party addresses, status, and fee accounting.
- **Settlement Phase (Future)**: Real asset settlement is a later phase and must be researched before claiming support. Future utility token logic and OTC board listings will be handled by the Gno realm.

## In-Memory Constraints
For MVP agility, the backend heavily leverages `sync.Mutex` and native Go Maps to hold session rooms dynamically. Persistence (DB) is deliberately ignored because P2P negotiations are ephemeral by nature. If the trade cancels or completes, the state should vanish from memory.

## Concurrency Design
- **One Goroutine per Room Countdown**: When both parties emit `trade:lock`, an atomic check `StartCountdown()` guarantees only a single `runCountdown` goroutine is spawned for the room.
- **Client Read/Write Pumps**: Standard asynchronous non-blocking Gorilla read and write channels per client.
- **Graceful Cleanup**: A central Hub polling mechanism (`RunCleanup`) guarantees no memory leaks from abandoned connections.


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
