# AtomOne Integration

## Current Status
- Real AtomOne RPC calls are NOT implemented.
- Asset rendering relies on hardcoded `DEMO_ASSETS`.
- Wallet connection utilizes a `WalletAdapter` interface, but currently only `mock-wallet.ts` is active.

## Next Steps
- Implement Keplr `window.keplr` detection for read-only connection.
- Wait for the foundational demo flow to completely solidify before enabling `keplr-wallet.ts` or real chain interaction.

---

## Update 2026-07-02

- Balance lookups run against public LCD endpoints (cosmos.directory proxies)
  for cosmoshub-4 / stargaze-1 / atomone-1; move to dedicated endpoints via env
  before scale.
- `ibc/<HASH>` denoms are now resolved through
  `/ibc/apps/transfer/v1/denom_traces/<hash>` (`lib/wallet/ibc.ts`); resolved
  path + base denom are displayed and carried into the trade intent, but a
  resolved trace is intentionally NOT treated as verification.
- AtomOne signing path (Keplr suggestChain with atone bech32 + PHOTON fees)
  exists behind settlement flags; mainnet remains hard-disabled by default.
