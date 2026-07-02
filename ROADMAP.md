# Roadmap

## Current Prototype

- Next.js trade-room UI
- Go WebSocket coordination backend
- Gno.land commitment scaffold
- Gno tests
- Adena / GnoConnect read-only prototype
- Gno commitment call preview
- Mock Wallet MVP flow

## Next

- Gno.land smart contract protocol implementation
- Gno local node / gnokey deployment dry run
- Adena signing research
- Gno commitment transaction prototype
- Improved asset registry
- Codex security audit prep

## Later

- AtomOne read-only integration
- Keplr / Cosmostation support
- IBC 2.0 research
- Utility token fee logic

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
