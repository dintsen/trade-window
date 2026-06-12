# Wallet Flow Status

## Current Wallet Support Status
- **Supported Wallet**: Adena (Gno.land)
- **Implementation Level**: Read-only prototype and testnet transaction preview functionality implemented.
- **Auto-connect**: Disabled (No automatic wallet popup on load; requires user click).

## Enabled Feature Flags
- `NEXT_PUBLIC_ENABLE_ADENA=true`
- `NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW=true`

## Disabled Feature Flags
- `NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS=false`
- `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS=false`

## Known Limitations
- The integration is an early read-only and preview prototype.
- Real mainnet transfers and real settlement claims are currently **disabled** and unsupported.
- The `adenaWalletAdapter` connects by establishing connection and getting the account, but does not persist local offline private keys or offer backend custody signing.

## Manual QA Checklist
- [ ] Ensure "Adena Wallet" appears in the connect modal if available.
- [ ] Connect without error to Adena (should show address in UI).
- [ ] Attempt a mock trade flow up to transaction preview.
- [ ] Verify that real mainnet transactions cannot be executed (transfer guards enforce this).
- [ ] Verify that no private data is collected or exposed by the wallet.

## Security Statement
Trade Window is fully **non-custodial**. 
- No user private keys are ever stored or transmitted to the backend.
- No backend wallet signing is performed on behalf of the user.
- Mainnet transfers are strictly guarded and remain disabled in this deployment phase.
