/**
 * Production feature flags.
 *
 * Canonical flags (production contract):
 *   NEXT_PUBLIC_ENABLE_REAL_WALLET          — real wallet adapters (Adena/Keplr/Cosmostation). Default: true.
 *   NEXT_PUBLIC_ENABLE_GNO_COMMIT           — on-chain Gno intent-commit / tx preview UI. Default: false.
 *   NEXT_PUBLIC_ENABLE_TESTNET_SETTLEMENT   — testnet/localnet transfer + escrow settlement. Default: false.
 *   NEXT_PUBLIC_ENABLE_MAINNET_SETTLEMENT   — mainnet transfers. Default: false. Keep false until approved.
 *
 * Legacy flags (kept for backwards compatibility) are OR-ed with the
 * canonical flags below, so existing deployments keep working.
 */

const flag = (value: string | undefined, defaultValue = false): boolean =>
  value === undefined ? defaultValue : value === "true";

const enableRealWallet = flag(process.env.NEXT_PUBLIC_ENABLE_REAL_WALLET, true);
const enableGnoCommit = flag(process.env.NEXT_PUBLIC_ENABLE_GNO_COMMIT);
const enableTestnetSettlement = flag(
  process.env.NEXT_PUBLIC_ENABLE_TESTNET_SETTLEMENT
);
const enableMainnetSettlement = flag(
  process.env.NEXT_PUBLIC_ENABLE_MAINNET_SETTLEMENT
);

export const featureFlags = {
  /**
   * Mock wallet is a local demo tool ONLY.
   * Disabled unless NEXT_PUBLIC_ENABLE_MOCK_WALLET=true is set explicitly.
   * Production deployments must never set this flag.
   */
  enableMockWallet: process.env.NEXT_PUBLIC_ENABLE_MOCK_WALLET === "true",

  /** Canonical production flags */
  enableRealWallet,
  enableGnoCommit,
  enableTestnetSettlement,
  enableMainnetSettlement,

  /** Legacy names (consumers unchanged); canonical flags are OR-ed in. */
  enableAdena:
    flag(process.env.NEXT_PUBLIC_ENABLE_ADENA) || enableRealWallet,
  enableGnoTxPreview:
    flag(process.env.NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW) || enableGnoCommit,
  enableGnoTestnetTransfers:
    flag(process.env.NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS) ||
    enableTestnetSettlement,
  enableGnoMainnetTransfers:
    flag(process.env.NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS) ||
    enableMainnetSettlement,
  enableEscrowPrototype:
    process.env.NEXT_PUBLIC_ENABLE_ESCROW_PROTOTYPE !== "false",
  enableEscrowTestnetSettlement:
    flag(process.env.NEXT_PUBLIC_ENABLE_ESCROW_TESTNET_SETTLEMENT) ||
    enableTestnetSettlement,
};

export const TRANSFERS_DISABLED_MESSAGE =
  "Real token transfer is disabled in this MVP. Use testnet/local mode only.";

export const ESCROW_SETTLEMENT_DISABLED_MESSAGE =
  "Gno escrow settlement is preview-only until a testnet/local realm deployment is configured.";
