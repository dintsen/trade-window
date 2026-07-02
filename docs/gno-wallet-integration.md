# Gno Wallet Integration

Trade Window uses a staged wallet strategy for testing and future production:

1. **Mock Wallet** (`isMock: true`): Used for local UI demo flows, simulating different users connecting without needing an actual browser extension.
2. **Adena Wallet** (`isMock: false`): The real Gno.land wallet extension.
3. **Keplr/Cosmostation**: Cosmos-compatible browser wallets used for read-only Cosmos, AtomOne and Stargaze account/balance display.

## Wallet Store (`lib/wallet/wallet-store.ts`)

The `useWalletStore` hook manages the active account, available adapters, and connection status.

Current adapters:

- `mock`
- `adena`
- `keplr`
- `cosmostation`
- `leap` is kept disabled because Leap Wallet sunset on 2026-05-28.

The active account now stores technical wallet details where available:

- full address
- chain id and chain name
- wallet/provider label
- ecosystem
- support level
- public key for Keplr-compatible wallets
- explorer account URL where supported

## Gno Transaction Preview

The `GnoTransactionPreview` component safely displays what a transaction will do before it is broadcast.

- Parses `/bank.MsgSend` and `/vm.m_call` payloads.
- Displays the action type, from/to addresses, payload method, amount, and chain ID.
- Expands raw JSON for technical users.

## Safety Guidelines

- Mainnet transfers are strictly guarded via the `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS` feature flag.
- Backend never signs transactions or holds private keys. All signing is handled client-side by Adena.
- Gno escrow settlement is preview-only unless `NEXT_PUBLIC_ENABLE_ESCROW_TESTNET_SETTLEMENT=true`.
- Wallet balance display is read-only and must not be treated as proof that settlement is supported.
