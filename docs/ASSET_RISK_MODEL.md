# Asset Risk Model

Trade Window displays every asset with its technical denom and a verification status so users never rely on display names alone.

## Supported Ecosystem Assets

| Symbol | Name | Technical denom | Ecosystem | Decimals | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| GNOT | Gno Token | `ugnot` | Gno.land | 6 | demo (testnet representation) |
| ATONE | AtomOne | `uatone` | AtomOne | 6 | demo (testnet representation) |
| PHOTON | Photon | `uphoton` | AtomOne | 6 | demo (testnet representation) |

Notes:
* The correct AtomOne ticker is `ATONE`. The ticker `AON` is incorrect and must never be used.
* Registry source: `apps/web/src/lib/assets/asset-registry.ts`.
* Logos live under `apps/web/public/assets/tokens/` (placeholders acceptable).

## Risk States

The code uses `VerificationStatus = 'verified' | 'unverified' | 'suspicious' | 'demo'`.

Mapping to the product risk vocabulary:

| Product term | Code status | UI treatment |
| :--- | :--- | :--- |
| verified | `verified` | normal display, verified badge |
| unknown | `unverified` | yellow "Unverified asset" warning, technical denom emphasized |
| warning | `suspicious` | red "Suspicious denom" warning, trade discouraged |
| blocked | (not stored; enforcement rule) | asset cannot be added to an offer |
| demo | `demo` | gray "Demo" badge; explicitly not a real asset claim |

## Display Rules

1. The technical denom (e.g. `ugnot`, IBC trace) is always available in the UI, not only the marketing ticker.
2. Unknown/unverified assets must show a visible warning before locking a trade.
3. Suspicious denoms (e.g. fake "USDC" with a wrong trace) are flagged inline in the trade room.
4. Any change to an offer resets locks and changes the deterministic intent hash.
5. No asset in the current MVP is claimed to be transferable on mainnet. Mainnet transfers are disabled.

## Future Work

* Verified registry sourced from a Gno.land realm (`gno/realms/tradewindow/registry`).
* IBC denom trace resolution for AtomOne/Cosmos assets.
* Explorer links per asset once target networks are finalized.
