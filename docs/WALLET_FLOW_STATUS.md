# Wallet Flow & Authentication Status

**Last updated:** 2026-06-13

---

## Wallet Support Matrix

| Wallet | Ecosystem | Status | Notes |
|--------|-----------|--------|-------|
| Mock Wallet | Gno.land | ✅ Live | Demo A/B users, always available |
| Adena | Gno.land | 👁 Preview | Extension detection + read-only connect |
| Keplr | Cosmos / AtomOne | 👁 Preview | isAvailable detection + connect button |
| Leap | Cosmos / AtomOne | 👁 Preview | isAvailable detection + connect button |
| Cosmostation | Cosmos / AtomOne | 👁 Preview | isAvailable detection + connect button |

**Status key:**
- ✅ Live — functional, used for demo
- 👁 Preview — adapter exists, connect flow works, signing disabled
- 📋 Planned — not yet implemented

---

## Architecture

All wallets share a common `WalletAdapter` interface:

```ts
interface WalletAdapter {
  id: WalletProviderId;
  label: string;
  ecosystem: "gno" | "cosmos";
  supportLevel: "live" | "preview" | "planned" | "disabled";
  isAvailable(): boolean;
  connect(chainId?: string): Promise<WalletAccount>;
  getAccount(chainId?: string): Promise<WalletAccount | null>;
  disconnect(): Promise<void>;
}
```

Cosmos wallets (Keplr, Leap, Cosmostation) share a `KeplrLike` provider interface:

```ts
interface KeplrLikeProvider {
  enable(chainIds: string | string[]): Promise<void>;
  getKey(chainId: string): Promise<{ name: string; bech32Address: string }>;
}
```

---

## Safety Rules (enforced)

- ✅ No wallet auto-popup on page load
- ✅ Connect only on user click
- ✅ Rejected connection handled gracefully
- ✅ Disconnect/reset supported
- ✅ Mainnet transfers disabled
- ✅ No private key storage
- ✅ No backend signing
- ✅ Transaction preview only — no broadcast

---

## Balance Reading

Token balances are fetched from public LCD REST endpoints (cosmos.directory proxy):

| Chain | LCD Endpoint | Status |
|-------|-------------|--------|
| Cosmos Hub (cosmoshub-4) | rest.cosmos.directory/cosmoshub | 👁 Preview |
| AtomOne (atomone-1) | rest.cosmos.directory/atomone | 👁 Preview |
| Stargaze (stargaze-1) | rest.cosmos.directory/stargaze | 👁 Preview |

Balance reading is read-only. No signing. Returns `null` when unavailable; UI shows honest fallback.

---

## NFT Reading (Stargaze)

- Stargaze NFTs fetched from public GraphQL: `https://graphql.mainnet.stargaze-apis.com/graphql`
- Browser-side only — no server proxy
- Returns `null` when unavailable — no fake data shown
- Selection in `/board/new` NFT tab (preview)

---

## Known Limitations

1. Cosmos wallet signing not implemented — connect reads address only
2. Adena signing available but mainnet disabled in MVP
3. Balance reading requires connected wallet with matching chain address
4. Stargaze NFTs only accessible with `stars1...` address
5. Wallet session not persisted — reconnect required on page refresh
6. No wallet signature authentication for trade history — `?wallet=<address>` query only

---

## Backend Auth Scaffold (MVP)

**Status: Scaffold implemented — signature verification NOT yet active**

Two endpoints added to `services/backend-go/cmd/server/main.go`:

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/auth/nonce` | POST | ✅ Functional — issues 32-byte random nonce, 5-min expiry |
| `/api/auth/verify` | POST | ⚠️ 501 Not Implemented — nonce consumed, signature check pending |

Source: `services/backend-go/internal/auth/nonce.go`

**Flow:**
1. Client POSTs `{"wallet": "cosmos1..."}` → receives `{wallet, nonce, message}`
2. Client signs `message` with wallet (UI not yet implemented)
3. Client POSTs `{wallet, signature, pub_key}` → 501 until ADR-036 verification is wired

**Notes:**
- Nonces are in-memory only — not persisted across server restarts
- Replay protection: nonce consumed on first verify attempt regardless of outcome
- No private keys touch the server at any point

---

## Roadmap

1. ADR-036 / Amino signature verification in `/api/auth/verify`
2. Frontend sign-in flow: prompt wallet sign → store session token
3. Wallet signature auth for My Trades (replace `?wallet=` query)
4. Adena signing for Gno.land receipt creation
5. Cosmos wallet signing for AtomOne intent commitment
6. IBC 2.0 / Eureka readiness research
7. Hardware wallet support (Ledger via Keplr)
