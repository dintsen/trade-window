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
* **Limitations**: A local Gno escrow state machine is implemented and tested, but deployed mainnet settlement and NFT/RWA transfers are not live.


---
### Current Architectural Positioning
* **Core Definition**: Trade Window = Gno.land smart-contract commitment layer + Go coordination backend + Next.js trade UI.
* **Adena Priority**: Adena is the priority wallet path. The current implementation is a read-only/detection prototype only.
* **Limitations**: Gno escrow signing is preview/testnet-gated. Mainnet settlement is disabled.
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

## Escrow + Source Fix Iteration
**Date:** 2026-06-15
**Target:** Gno realms, Go room intent hashing, Next.js trade room

### Tests Performed
- `scripts/gno/test-contracts.sh` passed for board, escrow, fees, intents, registry, rooms, and token.
- `go test ./... -count=1 -v` passed with writable `GOCACHE`.
- `npm run lint` passed.
- `next build --webpack` passed.

### Notes
- Default Turbopack build was blocked by sandbox port restrictions; webpack build completed.
- Google font fetching was removed from `layout.tsx` so production builds do not require network access to Google Fonts.
- Escrow mainnet settlement remains disabled by default.

## Wallet + Gno Verification Iteration
**Date:** 2026-06-16
**Target:** wallet connections, Gno validation, Solana planning

### Tests Performed
- `scripts/gno/test-contracts.sh` passed for board, escrow, fees, intents, registry, rooms, and token.
- `/Users/dmitriydintsen/go/bin/gno version` returned `master.3150+b738c1083`.
- `GOCACHE=/private/tmp/trade-window-go-build-cache /Users/dmitriydintsen/.local/go/bin/go test ./... -count=1 -v` passed.
- `npm run lint` passed.
- `npm run build` passed and generated the expected app routes including `/board`, `/board/new`, `/request`, `/trade`, and `/escrow`.
- `git diff --check` passed.

### Gno Source Check
- Official Gno docs confirm `gno test` as the local package test runner and clarify that local test execution uses a mocked in-memory blockchain environment.
- Official Gno realm docs confirm realm state is mutated by signed function call messages and that origin caller context is part of the realm call stack model.
- Official GnoConnect docs confirm metadata/TxLinks as a wallet/client integration path, but this app has not enabled GnoConnect metadata yet.
- The current Codex tool registry does not expose a Gno MCP server; validation used official docs/GitHub plus local CLI tests.

### Wallet QA Status
- Wallet account state now preserves provider label, ecosystem, chain id/name, full address, support level, public key when exposed, and explorer URL when supported.
- Trade setup sidebar now displays a wallet details panel after connection.
- Keplr/Cosmostation paths remain read-only and can show live balances through public REST endpoints.
- AtomOne chain config is suggested to Keplr-compatible wallets when possible before enabling `atomone-1`.
- Stargaze NFT address input auto-fills from a connected `stargaze-1` account with a `stars` address.
- Leap is disabled because the official Leap site reports wallet sunset on 2026-05-28.

### Browser Smoke Status
- Local browser smoke could not run in this sandbox because Next dev server binding failed with `listen EPERM: operation not permitted 127.0.0.1:3210`.
- This is an environment blocker, not a frontend build failure.

### Solana Status
- Solana is documented as a future read-only external-network research track.
- Solana assets must remain settlement-unsupported until a verified bridge/escrow/attestation route exists.

## Multi-Wallet Settlement Routing Iteration
**Date:** 2026-06-16
**Target:** multi-wallet send/receive routing and fee readiness

### Tests Performed
- `npm run lint` passed.
- `npm run build` passed.
- `GOCACHE=/private/tmp/trade-window-go-build-cache /Users/dmitriydintsen/.local/go/bin/go test ./... -count=1 -v` passed.
- `scripts/gno/test-contracts.sh` passed.
- `git diff --check` passed.

### QA Status
- Frontend can retain multiple connected settlement accounts in wallet state.
- Trade setup sidebar exposes a settlement wallet panel for adding Gno/Cosmos/AtomOne/Stargaze wallets.
- Offered assets now attach a settlement route with sender wallet, network and fee estimate.
- Backend validates settlement routes and rejects receiver addresses on the wrong chain.
- Backend tests confirm that changing a settlement receiver address changes the final intent hash.
- Ready-to-sign UI displays settlement readiness issues before escrow preview.

### Known Gaps
- Receiver wallet announcements are not yet shared as first-class room events.
- Balance checks use connected-wallet balance rows when owner metadata is available.
- Exact network fee simulation is not implemented yet.
- Solana remains documented as a future read-only adapter and unsupported for settlement.

## Connected Wallet Token Totals Iteration
**Date:** 2026-06-16
**Target:** aggregated token inventory across multiple connected wallets

### QA Status
- Added a connected-wallet balance hook that fetches balances for every linked settlement account.
- Balance rows preserve owner wallet metadata: address, label, provider and owner key.
- Asset picker uses all connected wallet balances instead of only the selected wallet.
- Token summary groups totals by `chainId + denom`, with per-wallet source breakdown.
- Settlement readiness checks now match balances against the exact sender wallet when owner metadata is available.
- No fiat portfolio value is displayed because no price feed/indexer is configured.

### Known Gaps
- Exact fee simulation is still static-estimate based.
- Receiver wallet announcements are still not shared as first-class live room events.

## Fake Token + Verified Exchange Iteration
**Date:** 2026-06-16
**Target:** token authenticity checks and Gno exchange contract hardening

### Tests Performed
- `scripts/gno/test-contracts.sh` passed.
- `GOCACHE=/private/tmp/trade-window-go-build-cache /Users/dmitriydintsen/.local/go/bin/go test ./... -count=1 -v` passed.
- `npm run lint` passed.

### QA Status
- Frontend now verifies token authenticity by `chainId + technicalDenom`, not display ticker.
- Known ticker mismatches are marked `suspicious`.
- Backend rejects fake verified known tickers and unknown assets marked `verified`.
- Gno escrow realm now includes `CreateVerifiedExchange` for one-asset-per-side exchange state.
- Gno escrow stores sender, receiver, fee denom, fee amount and verification status per side.
- `MarkFundedWithProof` records funding proof/tx reference per party.
- Gno tests cover fake verified ticker rejection and explicit suspicious mismatch acceptance.

### Remaining Limits
- `CreateVerifiedExchange` is local/tested but not deployed.
- Multi-asset bundles still use digest-based `CreateBundleEscrow`; full per-asset contract storage for large bundles remains future work.
- The realm records exchange state and proofs; it still does not execute cross-chain transfers.

## Demo Seat Ownership Iteration
**Date:** 2026-06-16
**Target:** mock User A/User B room ownership and invite errors

### QA Status
- Browser sessions now send a persistent `clientId` with the WebSocket connection.
- Backend room seats store private `PartyAClientID` / `PartyBClientID` values.
- The same browser session can restore its own seat.
- A different browser session cannot join as an already occupied party address.
- Full rooms reject a third distinct party.
- Mock invite links include the recommended counterparty seat (`mockSeat=A` or `mockSeat=B`).
- The connect screen disables the host's occupied mock seat when opened from a mock invite link.

### Known Limits
- Offline visual demo cannot synchronize room ownership across browsers without the Go WebSocket backend.
- Live two-window testing requires `NEXT_PUBLIC_WS_URL` and the backend service to be running.

---

## QA Update 2026-07-02 — Production hardening verification

| Check | Result |
| --- | --- |
| `go test ./...` (backend, incl. new expiry + ratelimit tests) | PASS |
| `npx tsc --noEmit` | PASS (0 errors) |
| `npm run lint` (eslint) | PASS (0 errors) |
| `next build` | PASS (15/15 static pages) |
| `gno test` — rooms/intents/registry/fees/escrow/board/token | PASS (7/7) |
| Localnet: addpkg 7 realms | PASS |
| Localnet: dual-sign intent e2e (+ negative: wrong hash, stranger) | PASS |
| Localnet: escrow full lifecycle | PASS |

Fixed since codex audit: mock wallet gating, deterministic intent expiry
(in-hash), WS rate limiting, IBC denom-trace lookup, realm crossing ABI
(on-chain calls previously impossible), deployment config + canonical flags.

Outstanding (manual, requires real browser + extensions): two-wallet manual QA
per docs/manual-qa-two-wallets.md; production deploy verification per
docs/deployment.md.
