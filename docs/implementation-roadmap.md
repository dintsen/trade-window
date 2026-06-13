# Implementation Roadmap

_Last updated: 2026-06-13_

---

## Current State Summary

The MVP foundation is built and deployed. The project is in a grant-ready state with a running demo.

| Layer | Status |
|---|---|
| Next.js frontend | ✅ Deployed (Vercel, `trade-window-final`) |
| Go backend | ✅ Deployed (Railway, `STORAGE_DRIVER=postgres`) |
| Supabase Postgres | ✅ Active (4 migrations applied) |
| GitHub → Vercel auto-deploy | ✅ Connected |
| WebSocket room state machine | ✅ Running |
| Shareable trade room invite links | ✅ Implemented |
| OTC board (`/board/new`) | ✅ With asset select, balance fetch, Max, validation |
| Deal request form (`/request`) | ✅ Email draft flow |
| History page | ✅ Built |
| Wallet: Mock (demo) | ✅ Active |
| Wallet: Adena (Gno.land) | ✅ Detection + read-only connect |
| Wallet: Keplr (Cosmos) | ✅ Detection + read-only preview |
| Wallet: Cosmostation (Cosmos) | ✅ Detection + read-only preview |
| Leap wallet | ❌ Removed — sunset May 28, 2026 |
| Gno contract deployment | ⏳ Scaffold only, not deployed |
| Real signing / settlement | ❌ Not implemented |
| IBC 2.0 / Eureka | ❌ Research phase |
| AtomOne RPC (live balances) | ❌ Not implemented |

---

## Phase 1 — Foundation ✅ Complete

- Clean Next.js + TypeScript + Tailwind + shadcn-compatible structure
- Go WebSocket backend with room state machine
- Supabase Postgres storage layer
- Shared asset and trade intent model
- Technical asset tooltips (denom, chain ID, IBC trace)
- System logs

## Phase 2 — Trade Room ✅ Complete

- P2P trade room with offer append-only state
- Lock / 10-second countdown / intent hash
- Chat (temporary)
- Shareable invite link (`/trade?room=<id>`)
- Auto-join via URL param `?room=`
- Final intent preview before signing

## Phase 3 — OTC Board ✅ Complete

- `/board/new` — post a listing with asset selector
- Balance fetch from cosmos.directory LCD (read-only)
- Max button + amount validation
- Asset verification flags (unverified / risky markers)
- `/board` — board listing page
- `/history` — trade history

## Phase 4 — Wallet Integration ✅ Partial

- Mock wallet (demo, always works)
- Adena: detection + read-only connection (Gno.land path)
- Keplr: detection + read-only (Cosmos/AtomOne path)
- Cosmostation: detection + read-only (Cosmos/AtomOne path)
- ADR-036 off-chain signing: planned, not yet implemented
- Real signing requires Gno contract deployment (Phase 6)

## Phase 5 — Gno Contract Scaffold ✅ Partial

- Gno realm scaffold: `gno/realms/tradewindow/`
- Intent commitment types defined
- Local validation tested
- **Blocked**: `gnoland` dev node setup required for local deployment
- **Not deployed** to testnet or mainnet

## Phase 6 — Gno Contract Deployment ⏳ Next Priority

- Set up `gnoland` local dev node
- Deploy tradewindow realm to Gno testnet
- Wire Adena `signArbitrary` (ADR-036) to commit intents
- Test intent create / lock / cancel flow end-to-end
- Research AtomOne chain IDs and RPC endpoints

## Phase 7 — AtomOne / IBC Integration ⏳ Research

- AtomOne chain integration research
- IBC 2.0 / Eureka readiness study
- IBC denom trace lookup
- Do not claim cross-chain atomic settlement until confirmed feasible

## Phase 8 — Utility Token & Grant ⏳ Planned

- Token utility design document (see `docs/token-utility.md`)
- Grant proposal (see `docs/grant-proposal.md`)
- Demo script (see `docs/demo-script.md`)
- No investment language, no production launch claims

---

## What Is Explicitly Out of Scope (MVP)

- Real mainnet settlement
- Production token launch
- Cross-chain atomic swap
- Custodial escrow
- Complex DAO governance
- NFT transfer unless confirmed by Gno contract support
- Real fee collection
- Any investment or speculative tokenomics
