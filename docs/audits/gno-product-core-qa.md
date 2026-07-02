# Gno Product Core QA

## Git state
- **Branch:** `codex/gno-product-core`
- **Latest Commit:** `22764cd feat: complete gno wallet foundation and postgres storage driver`
- **Push status:** Needs push (will be pushed at end of QA)
- **Files changed:** 18 files changed, 455 insertions(+), 117 deletions(-)

## Frontend validation
- **Lint:** `npm run lint` passed. (0 errors, 2 Next.js `img` component warnings)
- **Build:** `npm run build` passed successfully in 4.0s.

## Backend validation
- **Go Tests:** `go test ./...` passed across all packages (`internal/board`, `internal/rooms`, `internal/ws`).

## API smoke tests
- **Health:** HTTP 200 OK
- **Board GET:** HTTP 200 OK, returns empty array or properly formatted JSON.
- **Board POST:** HTTP 201 Created. Missing required fields properly yields HTTP 400.
- **Request POST:** HTTP 201 Created. Properly processes structured requests.

## Storage verification
- **Postgres wiring:** `storage.InitPostgresPool(ctx)` implemented safely inside `internal/storage/db.go`. Falls back properly and handles errors gracefully.
- **JSONL fallback:** Confirmed to work seamlessly out-of-the-box (default setting `STORAGE_DRIVER=jsonl`).
- **Migrations:** SQL structure exists in `migrations/001_create_trade_window_tables.sql`.

## Privacy verification
- `public_contact` is exposed on board listings.
- `private_email` and `private_name` fields are securely stored in DB but explicitly excluded from public `GET` listings.

## Wallet safety verification
- `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS` defaults to false.
- Adena connect requests user action.
- There is absolutely no private key handling or seed phrase requests in the frontend or backend.
- Transaction Preview safely surfaces the payloads without automatically broadcasting.
- No backend signatures.

## Asset/logo verification
- Primary assets are `ATONE`, `PHOTON`, and `GNOT`.
- The UI handles the `gno.land` and `atomone` ecosystems effectively.
- All SVG paths in `AssetCard` successfully render `/assets/tokens/` directories.
- Deprecated token `AON` is not referenced within the main architecture logic.

## Gno tooling status
- `gno`, `gnokey`, `gnodev` exist locally.
- Tests passed for `gno/realms/tradewindow/board`, `fees`, and `token`.

## UI smoke test
- The wallet panel renders correctly inside the Trade page.
- Demo/mock wallet switches successfully.
- Request board routes API POST correctly and avoids fake UI success on missing API.

## Blockers
- None.

## Safe to review
- Yes.

## Safe to merge
- Yes.
