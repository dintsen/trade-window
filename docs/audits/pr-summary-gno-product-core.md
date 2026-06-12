# PR Summary: Gno Product Core Backend and Storage Foundation

This PR introduces the foundational production-ready backend infrastructure for the Trade Window protocol, transitioning from early UI mocks to a fully functional staging-ready architecture.

## 🗄️ Storage 
- **Postgres Storage Support:** Fully implemented utilizing the `pgxpool` driver for performant production usage (`services/backend-go/internal/storage/db.go`).
- **JSONL Fallback:** Local development remains fast and frictionless through seamless fallback to `.jsonl` files when `STORAGE_DRIVER=jsonl` is configured.
- **SQL Migrations:** Established canonical schema via `services/backend-go/migrations/001_create_trade_window_tables.sql`.

## 🔌 API Endpoints
- Standardized RESTful endpoints for `GET /api/board/listings`, `POST /api/board/listings`, `GET /api/board/listings/{id}`.
- Refactored `POST /api/deal-requests` to reliably process forms without `mailto:` fallback.
- Added room intent paths `POST /api/trade/rooms` and `GET /api/trade/rooms/{id}`.

## 🖥️ Frontend API Integration
- Wired `/board`, `/board/new`, `/request`, and `/trade` to dynamically fetch and submit payloads to the actual Go backend instead of mocking success. 
- Integrated robust inline error states and clear visual disabled states when the backend is unreachable.

## 🔒 Privacy Checks
- Enhanced `BoardListing.ToPublic()` explicitly stripping out PII (`privateEmail`, `privateName`, internal messages/notes) ensuring public responses remain clean and secure.

## 🛡️ Wallet & Gno Safety Status
- **Mainnet Disabled:** `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS` explicitly defaults to `false`.
- **E2E Safety Boundaries:** Maintained strict safety principles: no auto-prompts on load, no custody or signing executed on the backend, and transaction previews mandate deliberate review before invoking `window.adena`.

## 🛠️ Gno Tooling & Tests
- Confirmed availability of `gno`, `gnokey`, and `gnodev` CLIs.
- `gno test` runs effectively and passes against existing `rooms`, `intents`, and `registry` realms.

## 🚀 Remaining Manual Deployment Steps
1. Create a Supabase/Postgres instance and inject `DATABASE_URL` into the chosen hosting provider.
2. Deploy the `services/backend-go` service configuring `PORT`, `ALLOWED_ORIGINS`, and `STORAGE_DRIVER=postgres`.
3. Configure DNS records for `api.tradewindow.xyz` pointing to the deployed backend.
4. Update the Vercel Production Environment Variables with `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`.
5. Run the `001_create_trade_window_tables.sql` against the database.
