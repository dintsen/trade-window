# Trade Window Architecture

_Last updated: 2026-06-13_

---

## System Overview

Trade Window is a three-layer system:

```
[Next.js Frontend]  ←WebSocket→  [Go Backend]  ←SQL→  [Supabase Postgres]
        ↓                                                        
  [Wallet Layer]                                                  
  Adena / Keplr / Cosmostation (read-only, MVP)                  
        ↓  (future)                                              
  [Gno.land Realm Layer]                                         
  Intent commitments, fee logic, verified registry               
```

---

## Layer 1 — Frontend (`apps/web`)

- **Stack**: Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui-compatible
- **Deployed**: Vercel project `trade-window-final` (auto-deploy from GitHub `main`)
- **Key pages**:
  - `/` — Landing page (hero, product preview, ecosystem roadmap)
  - `/trade` — Trade room (wallet connect → live P2P room)
  - `/board` — OTC board (public deal listings)
  - `/board/new` — Post a listing (asset selector, balance fetch, amount validation)
  - `/history` — Trade history
  - `/request` — Submit private OTC deal request
  - `/thank-you` — Post-submit confirmation
  - `/whitepaper` — Project whitepaper
  - `/ecosystem` — Ecosystem overview
- **Design language**: Supabase-style dark UI (`#0A0A0A` bg, `#171717` cards, `#2b2b2b` borders, `#3ECF8E` green accents)
- **Wallet support**:
  - Mock wallet (demo, always available)
  - Adena (Gno.land, read-only detection)
  - Keplr (Cosmos/AtomOne, read-only preview)
  - Cosmostation (Cosmos/AtomOne, read-only preview)
  - Leap: **removed** — sunset May 28, 2026

## Layer 2 — Go Backend (`services/backend-go`)

- **Stack**: Go, Gorilla WebSockets
- **Deployed**: Railway with `STORAGE_DRIVER=postgres`
- **Responsibilities**:
  - WebSocket room state machine (hub pattern)
  - Offer management (append-only)
  - Trade lock / 10-second countdown / intent hash
  - Temporary chat broadcast
  - System log events
  - Deal request persistence to Postgres
  - OTC board listing persistence
- **Not responsible for**: settlement, asset custody, signing
- **Concurrency**: `sync.Mutex` per room, single countdown goroutine per room, graceful cleanup via `RunCleanup`

## Layer 3 — Supabase Postgres

- **Project ref**: `szdhljgchxrkaosmcoxy`
- **Migrations applied**: 4 (initial schema, deal_requests, otc_board, stargaze_nfts)
- **Tables**: `deal_requests`, `otc_listings`, `trade_rooms` (ephemeral metadata)
- **Used by**: Railway backend via `DATABASE_URL`

## Layer 4 — Gno.land Realm (Planned Protocol Layer)

- **Stack**: Gno language, Gno.land realms
- **Location**: `gno/realms/tradewindow/`
- **Current state**: Local scaffold only — not deployed
- **Planned**: Intent commitments, fee logic, verified asset registry, OTC board (on-chain)
- **Blocked on**: `gnoland` dev node setup, Adena signing (ADR-036)

---

## Data Flow

### Trade Room Session
1. User connects wallet (mock/Adena/Keplr) → frontend stores account in wallet store
2. User creates room → POST `/rooms` → backend creates room UUID → WebSocket upgrade
3. Counterparty joins via shareable link `tradewindow.xyz/trade?room=<id>` → auto-join
4. Both sides add offers via `offer:add` WebSocket messages (append-only)
5. Each side locks → backend tracks lock state
6. Both locked → countdown starts (10s, cancellable)
7. Countdown complete → intent hash computed → final intent preview displayed
8. Future: Adena signs ADR-036 commitment → Gno realm stores intent

### OTC Board Listing
1. User selects offer asset → frontend fetches balance via cosmos.directory LCD (read-only)
2. User enters amount (validated against balance) → submits form
3. Backend persists listing to Supabase Postgres
4. `/board` fetches and displays listings with filters

---

## Security Boundaries

| Boundary | Rule |
|---|---|
| Frontend | Not trusted — cannot set server state unilaterally |
| Backend | Not settlement authority — only coordinates room state |
| Wallet | Read-only in MVP — no signing, no broadcasting |
| Gno realm | Future authority for committed intents |
| Unknown assets | Always marked as unverified in UI |
| Final intent | Must be previewed before any future signing step |
| Technical denom | Always shown alongside display name |

---

## Deployment Stack

| Service | Provider | Status |
|---|---|---|
| Frontend | Vercel | ✅ Live, auto-deploys from GitHub `main` |
| Backend | Railway | ✅ Live, `STORAGE_DRIVER=postgres` |
| Database | Supabase Postgres | ✅ Active, 4 migrations |
| Domain | `tradewindow.xyz` (planned) | ⏳ Not yet configured |
| Gno testnet | Gno.land | ❌ Not deployed |

---

## Update 2026-07-02 — Production hardening pass

Verified working state (all tests run in CI-like sandbox):

- Frontend: real wallet adapters (Adena read+sign preview, Keplr/Cosmostation),
  live LCD balance queries, IBC denom-trace resolution (`lib/wallet/ibc.ts`),
  registry-based token authenticity checks. Mock wallet exists only behind
  `NEXT_PUBLIC_ENABLE_MOCK_WALLET=true` and is absent from production builds' UI.
- Backend (Go): WS origin allowlist, wallet/clientId validation, full asset
  payload validation, 16KB message cap, per-connection rate limit
  (`WS_RATE_LIMIT_PER_MINUTE`), room expiry + cleanup, third-user rejection,
  deterministic trade intent with fixed `ExpiresAt` (set on ready_to_sign,
  part of the hash).
- Gno realms: 7 realms (rooms, intents, registry, fees, escrow, board, token)
  on the current crossing ABI, unit-tested with `gno test` and verified on a
  localnet end-to-end (addpkg, dual-sign commitment, escrow lifecycle).
- Deployment: `render.yaml` + Dockerfile for the backend, Vercel env contract
  for the frontend, canonical feature flags (see `docs/deployment.md`).
