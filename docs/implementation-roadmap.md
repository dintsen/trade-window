# Implementation Roadmap

_Last updated: 2026-06-16_

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
| Wallet: Adena (Gno.land) | ✅ Detection + read-only account details + escrow preview |
| Wallet: Keplr (Cosmos) | ✅ Detection + read-only account details + live balance fetch |
| Wallet: Cosmostation (Cosmos) | ✅ Detection + read-only account details + live balance fetch |
| Leap wallet | ❌ Removed — sunset May 28, 2026 |
| Gno contract deployment | ⏳ Local realm scaffold only, not deployed |
| Gno escrow prototype | ✅ Local tests passing |
| Real signing / settlement | ⏳ Escrow preview only; testnet gated |
| IBC 2.0 / Eureka | ❌ Research phase |
| AtomOne RPC (live balances) | ✅ Read-only browser balance fetch via public REST when available |
| Solana integration | ⏳ Research only; read-only roadmap drafted |
| Multi-wallet settlement routing | ✅ Foundation implemented; receiver announcement flow still pending |

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
- Keplr: detection + read-only account details, public key when exposed, live balances
- Cosmostation: detection + read-only account details, live balances through Keplr-compatible provider
- Wallet details panel: provider, ecosystem, chain id/name, full address, public key, explorer link, balances
- Multi-wallet settlement panel: users can add multiple connected accounts for different networks
- Offer assets now include settlement route metadata: sender, receiver placeholder, network and fee estimate
- Stargaze NFTs: address auto-fill when a `stargaze-1` wallet with a `stars` address is connected
- Leap: disabled because the official Leap site reports sunset on 2026-05-28
- ADR-036 off-chain signing: planned, not yet implemented
- Real signing requires Gno contract deployment (Phase 6)

## Phase 5 — Gno Contract Scaffold ✅ Partial

- Gno realm scaffold: `gno/realms/tradewindow/`
- Intent commitment types defined
- Escrow state-machine prototype: `gno/realms/tradewindow/escrow`
- Bundle escrow payload builder: `apps/web/src/lib/gno/escrow-call.ts`
- Local validation tested
- **Blocked**: `gnoland` dev node setup required for local deployment
- **Not deployed** to testnet or mainnet

## Phase 6 — Gno Contract Deployment ⏳ Next Priority

- Set up `gnoland` local dev node
- Deploy tradewindow rooms/intents/escrow realms to Gno testnet
- Wire Adena `signArbitrary` (ADR-036) to commit intents
- Test intent create / escrow create / fund / release / dispute flow end-to-end
- Research AtomOne chain IDs and RPC endpoints

## Phase 7 — AtomOne / IBC Integration ⏳ Research

- AtomOne chain integration research
- IBC 2.0 / Eureka readiness study
- IBC denom trace lookup
- Do not claim cross-chain atomic settlement until confirmed feasible

## Phase 7.5 — Solana External Network Research ⏳ Planned

- Keep Solana out of the current Gno escrow settlement path
- Start with read-only wallet identity, SOL balance, SPL token accounts and NFT metadata
- Mark Solana assets as unsupported for settlement until a verified route exists
- See `docs/solana-integration-roadmap.md`

## Phase 7.6 — Multi-Wallet Settlement Routing ✅ Foundation

- Add settlement route metadata to each offered asset
- Preserve settlement route fields in deterministic intent hashing
- Reject wrong-chain settlement receiver routes in backend validation
- Estimate network fee readiness before final escrow preview
- See `docs/multi-wallet-settlement.md`

Remaining work:

- Share receiver wallet announcements over the live room protocol
- Cache balances per connected settlement wallet
- Add exact fee simulation via chain-specific RPC/wallet APIs
- Add Solana read-only wallet adapter only after approval

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
