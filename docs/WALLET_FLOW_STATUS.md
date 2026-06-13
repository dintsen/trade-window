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

## Roadmap

1. Wallet signature auth for My Trades (nonce + sign)
2. Adena signing for Gno.land receipt creation
3. Cosmos wallet signing for AtomOne intent commitment
4. IBC 2.0 / Eureka readiness research
5. Hardware wallet support (Ledger via Keplr)
