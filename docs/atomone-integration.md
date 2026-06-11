# AtomOne Integration

## Current Status
- Real AtomOne RPC calls are NOT implemented.
- Asset rendering relies on hardcoded `DEMO_ASSETS`.
- Wallet connection utilizes a `WalletAdapter` interface, but currently only `mock-wallet.ts` is active.

## Next Steps
- Implement Keplr `window.keplr` detection for read-only connection.
- Wait for the foundational demo flow to completely solidify before enabling `keplr-wallet.ts` or real chain interaction.
