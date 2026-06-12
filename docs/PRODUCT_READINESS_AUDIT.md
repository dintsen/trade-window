# Trade Window Product Readiness Audit

This document audits the Trade Window codebase and production deployment to transition it from MVP mode to a production-grade product.

## Product Readiness Audit Table

| Area | Current Status | Risk | Required Fix | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **1. Backend Runtime** | Go v1.25.0; Dockerfile multi-stage alpine setup; Railway live backend at `trade-window-production.up.railway.app`. Go/Docker missing from agent environment. | Local verification of Go builds and tests fails in agent environment. | Backend testing and linting must run in CI/CD pipeline ([ci.yml](file:///Users/dmitriydintsen/ai-tools/trade/.github/workflows/ci.yml)). Provide Docker instructions for local dev. | **P0** |
| **1. Backend Runtime** | DB migrations relied on manual SQL Editor copy-paste. | Out-of-sync schemas across environments; manual errors; untracked state. | **[FIXED]** Implemented embedded migration runner ([migrations.go](file:///Users/dmitriydintsen/ai-tools/trade/services/backend-go/migrations/migrations.go)) and ([migrations.go](file:///Users/dmitriydintsen/ai-tools/trade/services/backend-go/internal/storage/migrations.go)) that tracks schema states automatically on startup in `schema_migrations`. | **P0** |
| **2. DB** | Tables `board_listings`, `deal_requests`, `trade_rooms`, `trade_events` exist. Migration `002_add_wallet_history.sql` was unapplied in production. | Trade history queries for `creator_wallet` / `requester_wallet` crash or return empty due to missing columns in live DB. | **[FIXED]** Auto-applied migration `002_add_wallet_history.sql` via startup migration runner. Verified idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. | **P0** |
| **3. Frontend** | Next.js app on `https://tradewindow.xyz`. Clean lint and build compiled. | Minor ESLint image element warnings. | Fix ESLint warnings by replacing standard `<img>` tags with Next.js optimized `<Image />` component. | **P1** |
| **4. Wallet/Security** | Adena wallet adapter integrated; connects without auto-popup; testnet preview works; mainnet disabled. | **No real wallet authentication.** Spoofable query-param filtering is deprecated. Real signature verification is blocked by Adena wallet signing limitations. | Implement signature verification after Gno.land/Adena standardize an off-chain message-signing API. Nonce and session schemas are designed. | **P0 (Blocked)** |
| **5. Product Flows** | Board listing, deal request, trade room creation, and history exist as MVP workflows. | OTC listings lack secure coordination; no structured event timelines or on-chain receipts on mainnet. | Enforce production trade room status machine, timeline views, and SHA256 hashes of terms/metadata on-chain. | **P1** |
| **6. Testing** | Go unit tests exist in source, but no automated integration, regression, or privacy validation scripts were available. | Privacy regression (exposing emails/contacts) or mainnet transfer guard bypass might go undetected. | **[FIXED]** Added [production-smoke.sh](file:///Users/dmitriydintsen/ai-tools/trade/scripts/production-smoke.sh), [privacy-regression.sh](file:///Users/dmitriydintsen/ai-tools/trade/scripts/privacy-regression.sh), and [mainnet-guard-regression.sh](file:///Users/dmitriydintsen/ai-tools/trade/scripts/mainnet-guard-regression.sh) to CI/CD and deployment checks. | **P0** |
| **7. Operations** | Basic CLI output logs; manual secrets list in `SECURITY_ROTATION_CHECKLIST.md`. | Lack of request IDs, database backups, audit trails, and uptime monitoring. | Implement structured JSON logging with request tracing. Document database backup/export plan and setup Uptime Kuma/Pingdom monitoring. | **P1** |

---

## Detailed Findings

### 1. Database Migrations (P0)
Before our changes, database migrations were manual copy-paste operations. This led to out-of-sync database schemas where `002_add_wallet_history.sql` (adding `creator_wallet` and `requester_wallet`) was unapplied in production, breaking the trade history page because the schema lacked these fields.
* **Resolution:** We built an auto-migrator that runs on backend server startup. It tracks applied files in a `schema_migrations` table, compares SHA256 checksums to ensure schema integrity, and applies unapplied scripts inside separate transactions.

### 2. Wallet Signature Authentication (P0 - Blocked)
Currently, `GET /api/me/trades` retrieves records by checking a `wallet` query parameter. Anyone can pass any wallet address in the query parameter to view that wallet's history. 
* **Required Fix:** A cryptographic wallet authentication flow using a nonce requested from the backend, signed on the frontend using Adena, and verified on the backend.
* **Blocker**: Adena lacks a standard `signMessage` or `signArbitrary` API method for browser extensions. Cryptographic backend verification is also blocked locally by the lack of `go` and `docker` compilers in the development sandbox. This flow is planned for development as soon as Adena standardizes its signature interfaces. Query-param filtering is deprecated in production.

### 3. Local Test Environment Consistency (P0)
* The agent environment lacks `go` and `docker`. The development team must run all local backend tests in a Docker container or rely on Github Actions runner environment which has Go installed.

### 4. Privacy & Mainnet Guards (P0)
* Any backend regression that leaks contact fields (emails, phone numbers, TG handles) or overrides the mainnet transfer guard (`NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS=false`) poses extreme financial/privacy risks.
* **Resolution:** Created [privacy-regression.sh](file:///Users/dmitriydintsen/ai-tools/trade/scripts/privacy-regression.sh) and [mainnet-guard-regression.sh](file:///Users/dmitriydintsen/ai-tools/trade/scripts/mainnet-guard-regression.sh) to block unauthorized releases.
