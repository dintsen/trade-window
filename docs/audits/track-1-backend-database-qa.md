# Track 1 Backend + Database QA

## Storage
- **Postgres driver:** Fully integrated using `pgxpool`. Connection logic gracefully handles startup errors if `DATABASE_URL` is omitted while `STORAGE_DRIVER=postgres`.
- **JSONL fallback:** Successfully verified on local instance run. Defaults cleanly, allowing zero-config local prototyping.
- **Migrations:** SQL structure defined at `services/backend-go/migrations/001_create_trade_window_tables.sql` successfully covering all required tables (`board_listings`, `deal_requests`, `trade_rooms`, `trade_events`).

## API endpoints
- **Health:** `/health` returning `200 OK`.
- **Board:** `GET /api/board/listings` successfully returns data. `POST /api/board/listings` validates correctly. Support for legacy field names (`side`, `baseAsset`, `quoteAsset`, `amount`, `terms`) mapped smoothly to new schema.
- **Requests:** `POST /api/deal-requests` verified to gracefully accept missing enums for `qa request` values.

## Frontend integration
- The `/board` UI fetches actively from backend.
- The `/board/new` UI posts effectively to backend.
- The `/request` UI form properly leverages `/api/deal-requests` endpoint instead of relying on older mailto schemes.

## Privacy checks
- Endpoints accurately withhold `privateName`, `privateEmail`, and internal notes from public board `GET` responses via `.ToPublic()` conversion step.

## Local smoke tests
- Backend started locally on port 8080 and passed curl smoke tests.
- UI manually verified to hit API cleanly.

## Production env checklist
- `docs/deployment-production-checklist.md` contains the necessary variables for both Vercel (`NEXT_PUBLIC_API_URL`, etc) and the Backend (`DATABASE_URL`, `STORAGE_DRIVER`).

## Remaining blockers
- None currently blocking production deployment of backend.

## Safe next step
- Proceed with deploying to a live staging/production environment (e.g. Supabase, Railway/Render) using the finalized checklist.
