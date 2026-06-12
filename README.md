# Trade Window

A Gno.land-native OTC trade-room protocol and interface for safer negotiated P2P asset deals.

## Architecture

Next.js Trade UI
Go WebSocket coordination backend
Gno.land smart-contract commitment layer
Adena / GnoConnect read-only prototype
Future AtomOne / Interchain support

## What it does

* Displays a public `/board` of OTC intents.
* Connects counterparties in a private realtime WebSocket `room`.
* Coordinates structured steps (lock assets, review deal, etc.).

## Tech Stack

*   **Frontend**: Next.js (React), TailwindCSS, TypeScript.
*   **Backend**: Go (standard library HTTP, Gorilla WebSockets, pgx/v5).
*   **Storage**: Postgres (Supabase) for production, JSONL for local MVP fallback.
*   **Smart Contracts**: Gno.land (realms).
*   **Deployment**: Vercel (Frontend), Docker / Generic Host (Backend).

## Current MVP Status

Implemented:
* Next.js trade-room UI
* Go WebSocket coordination backend
* Gno.land commitment scaffold and tests
* Adena / GnoConnect read-only detection prototype
* Gno commitment call preview
* Mock Wallet demo flow

Not implemented yet:
* real wallet signing
* real asset settlement
* production deployment
* token/NFT/RWA transfer
* AtomOne RPC
* IBC execution
* token payments

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
