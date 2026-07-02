# Persistence Verification Report

**Date:** 2026-06-13  
**Commit:** `a185cd3`  
**Branch:** `main` → pushed to `github.com/dintsen/trade-window`

---

```
Step:                  Production Persistence Verification (Tasks #37–#39)
Status:                COMPLETE
```

---

## Files Read

- `docs/DEPLOYMENT_STATUS.md`
- `docs/grant-proposal.md`
- `docs/FINAL_STEP_REPORT.md`
- `services/backend-go/cmd/server/main.go`
- `apps/web/src/components/layout/header.tsx`

---

## Files Created

- `docs/PERSISTENCE_VERIFICATION_REPORT.md` (this file)

---

## Files Changed

| File | Change |
|------|--------|
| `docs/DEPLOYMENT_STATUS.md` | Storage status updated: Postgres confirmed active; verification evidence added |
| `docs/grant-proposal.md` | Limitation #5 updated: Postgres unconfirmed → confirmed; backend table row updated |

---

## Commands Run

```bash
# Persistence test (from tradewindow.xyz page context via Chrome JS)
POST https://trade-window-production.up.railway.app/api/board/listings
→ 201 {"id":"1df4b351-064f-48e3-b056-f3159d5f51b3",...}

GET https://trade-window-production.up.railway.app/api/board/listings
→ 200 [{"id":"1df4b351-064f-48e3-b056-f3159d5f51b3",...}]  (count: 1)

GET https://trade-window-production.up.railway.app/health
→ 200 {"status":"ok","service":"trade-window-backend","storage_driver":"postgres"}

# Commit + push
git add docs/DEPLOYMENT_STATUS.md docs/grant-proposal.md
git commit -m "docs: confirm Postgres persistence verified 2026-06-13"
git push origin main   # ca882d1..a185cd3
```

---

## Tests / Checks

| Check | Result |
|-------|--------|
| `/health` → `storage_driver` field | ✅ `"postgres"` |
| `POST /api/board/listings` | ✅ 201, listing created with UUID |
| `GET /api/board/listings` | ✅ 200, test listing present |
| `privateEmail` / `privateName` in GET response | ✅ Absent — `ToPublic()` working |
| CORS (POST from tradewindow.xyz) | ✅ No CORS error — origin allowed |
| Secrets printed / committed | ✅ None — DATABASE_URL never logged or committed |
| Frontend UI changed | ✅ No changes |
| New features added | ✅ None |
| Mainnet transfers enabled | ✅ Still disabled |

---

## What Works

1. **Postgres persistence confirmed** — `/health` returns `"storage_driver":"postgres"`
2. **Write + read round-trip verified** — POST 201 → GET 200 with matching ID
3. **Privacy** — `ToPublic()` strips `privateEmail` and `privateName` from all public responses
4. **CORS** — `tradewindow.xyz` origin accepted; Railway dashboard origin (not in allowlist) correctly rejected
5. **Auth scaffold** — `/api/auth/nonce` live (32-byte nonce, 5-min expiry); `/api/auth/verify` returns 501 (ADR-036 pending)
6. **Grant proposal** — `docs/grant-proposal.md` updated: Postgres limitation removed, confirmed active

---

## What Does Not Work (Known Limitations)

| Item | Status |
|------|--------|
| ADR-036 signature verification | 501 scaffold — post-grant milestone |
| Cosmos wallet signing | Address read only — no tx broadcast |
| Gno.land realm deployment | Scaffold only |
| `api.tradewindow.xyz` CNAME | Not configured — Railway URL used directly |
| IBC denom trace lookup | Planned — unknown assets marked suspicious |
| Real settlement / swap execution | Out of scope for MVP |

---

## Risks

1. Test listing `1df4b351-064f-48e3-b056-f3159d5f51b3` remains in Postgres — safe to delete manually via Supabase dashboard; does not affect production users
2. Nonces are in-memory — Railway restarts invalidate pending nonces (acceptable for MVP scaffold)
3. `?wallet=` history query is unauthenticated — documented; not used for sensitive data

---

## Questions

None blocking. ADR-036 verification is a post-grant milestone (Milestone 1 in grant-proposal.md).

---

## Recommended Next Step

Production persistence is verified. The project is grant-ready:

- Live demo: https://tradewindow.xyz
- Backend: https://trade-window-production.up.railway.app (Postgres active)
- Repository: https://github.com/dintsen/trade-window
- Grant proposal: `docs/grant-proposal.md`

Submit `docs/grant-proposal.md` to AtomOne / Gno.land grant program.
