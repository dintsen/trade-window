# Wallet Flow & Authentication Status

## Current Wallet Support Status
- **Supported Wallet**: Adena (Gno.land)
- **Implementation Level**: Read-only prototype and testnet transaction preview functionality.
- **Auto-connect**: Disabled (No automatic wallet popup on load; requires user click).
- **Authentication**: **Blocked / Pending**. Query-parameter filtering (`?wallet=<address>`) remains active in production as an MVP-only filter over public activity data. It is deprecated as an authentication mechanism and will be replaced by signature auth. It never exposes private contact data.

## Enabled Feature Flags
- `NEXT_PUBLIC_ENABLE_ADENA=true`
- `NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW=true`

## Disabled Feature Flags
- `NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS=false`
- `NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS=false`

## Critical Security Limitations
1. **No Production Authentication**:
   * The query parameter `?wallet=<address>` used in MVP mode is **deprecated**. It is strictly a developer fallback and must not be used as secure authentication.
   * Cryptographic signature verification is currently blocked (see [WALLET_AUTH_PLAN.md](file:///Users/dmitriydintsen/ai-tools/trade/docs/WALLET_AUTH_PLAN.md)).
2. **Non-Custodial Architecture**:
   * No user private keys are ever stored or transmitted to the backend.
   * No backend wallet signing is performed on behalf of the user.
   * Real mainnet transfers are strictly disabled.

## Technical Blockers for Production Auth
1. **Adena API Constraints**: Adena lacks a standard `signMessage` or `signArbitrary` method for browser dApps, supporting only Gno transaction signing (`adena.Sign(tx)`).
2. **Missing Local Compiler**: The local agent environment lacks Go/Docker, preventing verification of secp256k1 cryptographic verification routines before shipping to CI.
