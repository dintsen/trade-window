# Wallet Authentication Plan

**Last updated:** 2026-06-13

---

## Current State (MVP — Honest Summary)

The current MVP uses **unsigned wallet filtering** for trade history:

```
GET /api/me/trades?wallet=<address>
```

This is **not authenticated**. Any caller who knows or guesses a wallet address can fetch its trade history. This is acceptable for the current demo/grant phase because:

- No sensitive financial data is returned (listings are already public)
- No mainnet transactions are involved
- The board is explicitly described as an intent coordination layer, not settlement

All UI surfaces this limitation honestly — the `/history` page is labeled "My Trades (Preview)" and does not claim any ownership proof.

---

## Planned Authentication Architecture

### Phase 1 — Cosmos Wallet Signature Auth (ADR-036)

Cosmos wallets (Keplr, Leap, Cosmostation) support **ADR-036 off-chain message signing** via `signArbitrary`:

```ts
// Keplr / Leap / Cosmostation (via keplr-compat mode)
const sig = await window.keplr.signArbitrary(chainId, address, message);
```

This returns a `StdSignature` with `signature` (base64) and `pub_key`.

**Flow:**

1. User clicks "Sign in with Wallet" (no auto-popup on page load)
2. Frontend calls `POST /api/auth/nonce` with wallet address + chainId
3. Backend returns a deterministic sign-in message + one-time nonce (5-min expiry)
4. Frontend passes message to wallet `signArbitrary`
5. Frontend sends `{ wallet, pubKey, signature, nonce }` to `POST /api/auth/verify`
6. Backend verifies: nonce not expired, nonce not replayed, pubKey hashes to wallet address (secp256k1 / RIPEMD-160 / SHA-256 / Bech32), signature valid
7. Backend issues an HttpOnly Secure SameSite=None session cookie (32-byte random token, SHA-256 hashed before storage)

**Signing message format:**

```
Trade Window Sign-In

Domain: tradewindow.xyz
Wallet: <bech32_address>
Chain: <chainId>
Nonce: <uuid>
Issued At: <ISO8601>
Expires At: <ISO8601>

This signature proves wallet ownership.
It does not authorize a transaction or transfer of any asset.
```

### Phase 2 — Gno.land / Adena

Adena does not expose a standard off-chain `signArbitrary` equivalent. The only current signing path is `adena.DoContract()` which constructs a Gno.land transaction — this is inappropriate for a sign-in flow because users see a transaction warning.

**Blocker:** Adena / Gno.land does not yet have a standardized browser message signing API.

**Resolution path:** Wait for Gno.land to publish a GnoConnect sign-in spec, or use a minimal Gno realm `SignIn` message that is deterministically non-executable (verifiable by the realm as a no-op).

---

## Backend Requirements (not yet implemented)

```sql
-- Required migrations (not yet applied)
CREATE TABLE auth_nonces (
  nonce      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet     TEXT NOT NULL,
  chain_id   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ
);

CREATE TABLE auth_sessions (
  session_hash TEXT PRIMARY KEY,  -- SHA-256 of the random token
  wallet       TEXT NOT NULL,
  chain_id     TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ NOT NULL
);
```

**Required Go endpoints (not yet implemented):**
- `POST /api/auth/nonce` — generate + return sign-in nonce
- `POST /api/auth/verify` — verify signature, issue session cookie
- `POST /api/auth/logout` — clear session cookie
- Auth middleware for `GET /api/me/trades` — validate session cookie before filtering

**Crypto libraries needed:**
- `github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1` for pubkey recovery
- `github.com/cosmos/cosmos-sdk/types/bech32` for address derivation
- Standard `crypto/sha256` + `crypto/rand` (stdlib)

---

## Security Rules (always apply)

- No auto-popup on page load — sign-in is always user-initiated
- Session cookie: `HttpOnly`, `Secure`, `SameSite=None`, 24h expiry
- Nonce: single-use, 5-minute expiry, marked used on first verify attempt
- CORS: `Allow-Credentials: true` only for `tradewindow.xyz` and `www.tradewindow.xyz`
- Backend never logs or stores raw session tokens — only SHA-256 hashes
- Frontend never stores session token — cookie only
- No private keys, no signing keys on server

---

## Frontend Copy Guidelines (honest MVP language)

Use this copy for current MVP UI:

| Location | Copy |
|----------|------|
| `/history` page header | `My Trades (Preview)` |
| History filter note | `Showing listings by wallet address. Wallet ownership is not cryptographically verified in this preview.` |
| `/board/new` wallet section | `Connect wallet to pre-fill your address. Wallet signature auth coming in a future update.` |
| `/trade` page wallet panel | `Preview — connect to read address only. No signing or transactions in this build.` |

Do not write copy that implies the wallet is authenticated or that the user has proven ownership.

---

## Roadmap

| Step | Status |
|------|--------|
| `?wallet=` query filtering (unsigned) | ✅ Live |
| Cosmos wallet detection + connect (read-only) | ✅ Live (Preview) |
| Adena wallet detection + connect (read-only) | ✅ Live (Preview) |
| ADR-036 Cosmos sign-in + session cookies | 📋 Planned |
| `/api/auth/nonce` + `/api/auth/verify` backend | 📋 Planned |
| Gno.land / Adena off-chain sign-in | 🔬 Blocked (no API) |
| Hardware wallet (Ledger via Keplr) | 📋 Future |
