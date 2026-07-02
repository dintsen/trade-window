# Manual QA Plan — Two Real Wallets

Purpose: the sandboxed CI environment cannot run browser wallet extensions, so
wallet integration is verified with this manual plan. Run it before every
production release that touches wallet, room or intent code.

Prerequisites:
- Two browser profiles (or two machines): Profile A with Keplr, Profile B with
  Keplr (different account) — plus Adena on at least one profile for Gno checks.
- Backend running (local `go run ./cmd/server` or https://api.tradewindow.xyz).
- Frontend running with `NEXT_PUBLIC_WS_URL` pointing at that backend and
  `NEXT_PUBLIC_ENABLE_MOCK_WALLET` UNSET.

## 1. Wallet connection

| # | Step | Expected |
|---|------|----------|
| 1.1 | Open /trade without any wallet extension | Real-wallet rows show "not detected / install" state; no auto-popup; NO mock wallet block |
| 1.2 | Connect Keplr (Profile A) | Approval popup only after click; panel shows address, chain name + chain ID, provider label "Keplr" |
| 1.3 | Connect Adena | Same; chain ID comes from Adena response |
| 1.4 | Reject the wallet popup | Clear "rejected" error, app stays usable |
| 1.5 | Search page + DevTools network | No request ever asks for seed phrase / private key |

## 2. Balances and assets

| # | Step | Expected |
|---|------|----------|
| 2.1 | After connect, open asset picker | Live balances from LCD; no hardcoded demo assets |
| 2.2 | Inspect a native asset tooltip | technical denom, base denom, source chain, decimals, verification status |
| 2.3 | Inspect an `ibc/...` asset (if held) | resolved trace `transfer/channel-N/<base>` shown; status stays "unverified" with warning |
| 2.4 | LCD unreachable (offline test) | Honest "no live balances" state; nothing invented |

## 3. Trade room (A + B)

| # | Step | Expected |
|---|------|----------|
| 3.1 | A creates room, B joins via invite link | Both see the same room; third profile joining gets rejected |
| 3.2 | A adds asset | Appears on both sides; append-only (no remove/decrease UI) |
| 3.3 | A locks, then B adds asset | A's lock resets with visible warning log |
| 3.4 | Both lock | 10s countdown on both; Cancel active during countdown |
| 3.5 | Countdown ends | ready_to_sign; final intent preview shows parties, assets with technical denoms, expiry, version, fee fields and intent hash |
| 3.6 | Recreate identical final state in a new room | Displayed intent hash differs only via room id/nonce/expiry fields as designed; same room state re-render keeps identical hash |
| 3.7 | Cancel during countdown | Room destroyed for both; chat/logs gone |

## 4. Signing gates

| # | Step | Expected |
|---|------|----------|
| 4.1 | With all settlement flags false, attempt sign/transfer | Blocked with TRANSFERS_DISABLED message; no wallet popup |
| 4.2 | `NEXT_PUBLIC_ENABLE_TESTNET_SETTLEMENT=true` on a testnet account | Wallet signing popup appears; success/failure comes from the real chain response with tx hash + explorer link |
| 4.3 | Mainnet chain account with mainnet flag false | Hard-blocked regardless of other flags |

## 5. Backend abuse checks (curl / wscat)

| # | Step | Expected |
|---|------|----------|
| 5.1 | WS connect from disallowed Origin | 403 (blocked origin) |
| 5.2 | WS connect with malformed wallet/clientId | 401 |
| 5.3 | Send >16KB frame | trade:error message_too_long |
| 5.4 | Flood >120 msg/min | trade:error rate_limited |
| 5.5 | Asset payload with known ticker on wrong chain, status "verified" | rejected: must be suspicious |

Record results in docs/qa-audit.md with date and commit hash.
