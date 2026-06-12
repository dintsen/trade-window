# Gno Wallet Integration

Trade Window uses a dual-wallet strategy for testing and future production:

1. **Mock Wallet** (`isMock: true`): Used for local UI demo flows, simulating different users connecting without needing an actual browser extension.
2. **Adena Wallet** (`isMock: false`): The real Gno.land wallet extension.

## Wallet Store (`lib/wallet/wallet-store.ts`)

The `useWalletStore` hook manages the active account, available adapters (`MockWalletAdapter`, `AdenaWalletAdapter`), and connection status.

## Gno Transaction Preview

The `GnoTransactionPreview` component safely displays what a transaction will do before it is broadcast.

- Parses `/bank.MsgSend` and `/vm.m_call` payloads.
- Displays the action type, from/to addresses, payload method, amount, and chain ID.
- Expands raw JSON for technical users.

## Safety Guidelines

- Mainnet transfers are strictly guarded via the `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS` feature flag.
- Backend never signs transactions or holds private keys. All signing is handled client-side by Adena.
