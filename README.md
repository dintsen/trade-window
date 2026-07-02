# Trade Window

A Gno.land-oriented non-custodial OTC coordination platform for safer negotiated P2P asset deals.

**Live demo**: https://tradewindow.xyz
**Backend**: https://trade-window-production.up.railway.app

> Trade Window is a Gno.land-oriented non-custodial OTC coordination platform with public listings, private deal requests, wallet-aware trade rooms, transaction preview, and user trade history. The current production MVP uses a Go backend, Postgres storage, and a Next.js frontend. Mainnet transfers remain disabled while the Gno.land commitment receipt layer is finalized.

## Architecture

```txt
Trade Window = Gno.land commitment layer (planned) + Go coordination backend + Next.js OTC frontend
```

* Next.js Trade UI (Vercel)
* Go WebSocket coordination backend (Railway)
* Postgres storage (Supabase)
* Gno.land smart-contract commitment scaffold (local, tested, not deployed)
* Adena / GnoConnect read-only wallet prototype
* Future AtomOne / Interchain support

## What it does

* Displays a public `/board` of OTC intents with a create flow at `/board/new`.
* Accepts private deal requests at `/request` (contact data never exposed publicly).
* Connects counterparties in a private realtime WebSocket trade room at `/trade`.
* Coordinates structured steps: append-only offers, double lock, countdown, deterministic intent hash.
* Shows wallet-aware trade history (My Trades) at `/history` and `/trades`.
* Previews Gno commitment calls without signing or broadcasting anything.

## Tech Stack

*   **Frontend**: Next.js (React), TailwindCSS, TypeScript.
*   **Backend**: Go (standard library HTTP, Gorilla WebSockets, pgx/v5).
*   **Storage**: Postgres (Supabase) for production, JSONL for local MVP fallback.
*   **Smart Contracts**: Gno.land (realms).
*   **Deployment**: Vercel (Frontend), Docker / Generic Host (Backend).

## Current Production Status

Live in production:
* Next.js frontend at `tradewindow.xyz` (`/`, `/board`, `/board/new`, `/request`, `/trade`, `/history`, `/trades`)
* Go backend on Railway with Postgres (Supabase) storage and startup auto-migrations
* Public OTC board API, deal request API, trade history API (`/api/me/trades`)
* Adena detection / read-only connect prototype, Gno transaction preview
* Mock Wallet demo flow

Implemented but not deployed:
* Gno.land commitment realm scaffold with local tests (`gno/realms/tradewindow`)

Not implemented yet (honest limitations):
* real wallet signing (blocked on Adena off-chain message signing — see `docs/WALLET_AUTH_PLAN.md`)
* real asset settlement — mainnet transfers are disabled
* token/NFT/RWA transfer
* AtomOne RPC integration
* IBC execution
* token payments

Wallet history filtering uses a deprecated `?wallet=` MVP parameter, not cryptographic authentication. It exposes only public activity, never private contact data.

## Features

* private trade room
* append-only offers
* double lock
* lock reset on offer change
* countdown
* technical asset inspection
* suspicious asset warning
* deterministic intent hash
* Gno commitment call preview
* temporary chat/system logs

## Local setup

Frontend:
```bash
cd apps/web
npm install
npm run dev
```

Backend:
```bash
export PATH="$HOME/.local/go/bin:$PATH"
cd services/backend-go
go run cmd/server/main.go
```

Gno tests:
```bash
export PATH="$HOME/go/bin:$PATH"

cd gno/realms/tradewindow/rooms
gno test . -v

cd ../intents
gno test . -v

cd ../registry
gno test . -v
```

## Environment variables

* `NEXT_PUBLIC_WS_URL`: WebSocket endpoint (e.g. `ws://localhost:8080/ws`)
* `NEXT_PUBLIC_DEMO_MODE`: Enable mock UI flows
* `NEXT_PUBLIC_ENABLE_ADENA`: Enable Adena wallet integration (true/false)
* `NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW`: Enable Gno transaction previews (true/false)
* `NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS`: Enable testnet/local Gno transfers via Adena (true/false)
* `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS`: Strictly guarded mainnet transfer enabler (true/false)
* `PORT`: Backend port
* `ALLOWED_ORIGINS`: CORS origins
* `COUNTDOWN_SECONDS`: Final lock countdown duration
* `ROOM_EXPIRY_MINUTES`: Expiry timeout
* `ROOM_CLEANUP_INTERVAL_SECONDS`: Background sweeper

## Demo flow

* open `/`
* open `/trade`
* select Demo User A
* create room
* open second browser window
* select Demo User B
* join room
* add assets
* lock/reset/countdown
* inspect intent hash
* preview Gno commitment call

## License

Trade Window is licensed under the Apache License 2.0.

You may use, copy, modify and distribute this project under the terms of Apache-2.0.

Please preserve the copyright, license and attribution notices, including the
`NOTICE` file, when redistributing this project or derivative works.

Suggested attribution:

> Based on Trade Window by Dintsen / Trade Window.

See `LICENSE` and `NOTICE`.

## Trademark and Affiliation Notice

This project may reference Gno.land, AtomOne, Adena, Keplr, Cosmostation, Cosmos
and IBC for technical integration purposes. These references do not imply
partnership, endorsement or official affiliation.

The Apache-2.0 license does not grant trademark rights.

## Safety disclaimer

* this is not audited;
* this is not production ready;
* no real settlement is implemented;
* no real asset transfer is implemented;
* no token investment or financial product is offered;
* current demo is mock/research only.

## Deal Request / Contact Platform

Trade Window includes a public inquiry flow where users can submit OTC deal requests and contact details for manual follow-up.

This does not execute trades automatically and does not provide custody, financial advice, guaranteed settlement or production wallet signing.

## Public OTC Board

Trade Window provides a public OTC listing board (`/board`) where users can post negotiated deal intents. 
Users can create new listings at `/board/new`. 
Backend endpoints support `GET /api/board/listings`, `POST /api/board/listings`, and `GET /api/board/listings/{id}` using JSONL MVP storage.
Private email and name data are strictly protected and never exposed publicly.
The board does not provide custody, guaranteed matching, automatic settlement, liquidity, or financial advice.
Production storage should later move to Postgres/Supabase or another persistent DB.
