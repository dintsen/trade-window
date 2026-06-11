# QA Audit Log

## Backend Hardening Iteration
**Date:** 2026-06-11
**Target:** `services/backend-go`

### Scope Note
The current Go Backend is tested only as a coordination layer for live mock session state. The true protocol authority (commitments, signatures, registry) will be tested separately via Gno.land smart contracts once developed.

### Tests Performed
1. **Invalid JSON:** Passed. Protocol rejects malformed bytes cleanly.
2. **Unknown Event Type:** Passed. Returns `invalid_event` error payload.
3. **Missing Wallet:** Passed. Refuses websocket upgrade instantly with 401 Unauthorized HTTP fallback.
4. **Invalid Party Actions:** Passed. Attempting to add assets or toggle locks from a tertiary observer fails gracefully with `unauthorized party`.
5. **Room Not Found:** Passed. Joins against missing IDs or HTTP `GET` requests against dead rooms yield `room_not_found`.
6. **Malformed Add Asset Payload:** Passed. Missing amounts or denominators reject with `invalid asset payload`.
7. **Add Asset During Countdown:** Passed. State machine enforces strict `StateActive` requirement for mutations, rendering the action invalid during `StateLockedCountdown`.
8. **Cancel During Countdown:** Passed. Allowed intentionally to provide a "panic" escape hatch. Accurately tears down the countdown timer state and broadcasts `cancelled`.
9. **Countdown Reaches Ready_to_sign:** Passed. Safely transitions to readiness exactly once per room.
10. **Expired Room Rejection:** Passed. `RunCleanup` periodically deletes rooms abandoned over an hour ago. Attempts to re-activate expired rooms fail.
11. **Chat Too Long:** Passed. Messages over 500 characters reject with `message_too_long` to prevent memory bloat/spam.
12. **Panic Stability:** Passed. Backend does not panic under chaotic malformed WebSocket payload blasting.


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

### QA Status: Adena Connection
- Adena detection works defensively without crashing if missing.
- Explicit `AddEstablish` flow works safely.
- No auto-prompting or signing occurs.
- Mock wallet flow works alongside Adena without conflict.

### QA Status: Gno Local Deployment
- Local tooling checked. `gnoland` is missing.
- Local deployment correctly identified as blocked.
- Frontend commitment preview displays correctly without causing side-effects.
