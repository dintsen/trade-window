# Backend Security Review

Scope: `services/backend-go` (Go coordination backend, Railway production).

## Summary Table

| Area | Status | Notes |
| :--- | :--- | :--- |
| CORS | OK | Origin checked against `ALLOWED_ORIGINS`; non-allowed origins get `Access-Control-Allow-Origin: null`. `/health` uses `*` (harmless, no private data). |
| Private field filtering | OK | `BoardListing.ToPublic()` strips `PrivateEmail`/`PrivateName`; `HistoryItem` contains no contact fields. Public APIs return only public structs. |
| Migrations | OK | `go:embed` runner with `schema_migrations` tracking + SHA-256 checksums; runs at startup before routes; fails loudly. Idempotent `ADD COLUMN IF NOT EXISTS` in `002_add_wallet_history.sql`. No destructive SQL. |
| Secrets in logs | OK | `DATABASE_URL` and passwords are never printed; only driver name and migration filenames are logged. |
| Input validation | OK | JSON decode errors return 4xx; missing `wallet` query returns `{"error":"wallet_required"}` 400; method checks on all handlers. |
| Mainnet actions | OK | Backend has no signing, no key storage, no transfer endpoints. Mainnet transfers are impossible from the backend by construction. |
| WS origin check | OK | `CheckOrigin` validates against `ALLOWED_ORIGINS`; empty origins currently allowed for local QA (tighten before any settlement phase). |

## Known Weaknesses (tracked)

1. **Wallet identity is not authenticated (P0, blocked).** `GET /api/me/trades?wallet=` trusts the query parameter. Anyone can read any wallet's aggregated *public* activity. No private contact data is exposed through this endpoint, which is why MVP shipping is acceptable. Real fix: nonce + signature auth per `WALLET_AUTH_PLAN.md`, blocked on Adena off-chain signing support.
2. **No rate limiting** on POST endpoints (board listings, deal requests). Mitigation planned: per-IP limits at the edge or middleware.
3. **Empty WS origins allowed** — acceptable for the mock coordination layer; must be tightened before settlement.
4. **No request IDs / structured logging** — observability gap, P1.

## Secrets Handling Rules

* No secrets in code or git history; env-only configuration.
* `SECURITY_ROTATION_CHECKLIST.md` lists credentials requiring rotation (tokens were exposed in chat/remote URL during development sessions — rotate them).
* Git remote URLs must not embed PATs going forward.

## Verification Scripts

* `scripts/production-smoke.sh` — endpoint health.
* `scripts/privacy-regression.sh` — scans public API output for private field names.
* `scripts/mainnet-guard-regression.sh` — asserts mainnet transfer flags stay off.
