export const featureFlags = {
  enableAdena: process.env.NEXT_PUBLIC_ENABLE_ADENA === "true",
  enableGnoTxPreview: process.env.NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW === "true",
  enableGnoTestnetTransfers:
    process.env.NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS === "true",
  enableGnoMainnetTransfers:
    process.env.NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS === "true",
  enableEscrowPrototype:
    process.env.NEXT_PUBLIC_ENABLE_ESCROW_PROTOTYPE !== "false",
  enableEscrowTestnetSettlement:
    process.env.NEXT_PUBLIC_ENABLE_ESCROW_TESTNET_SETTLEMENT === "true",
};

export const TRANSFERS_DISABLED_MESSAGE =
  "Real token transfer is disabled in this MVP. Use testnet/local mode only.";

export const ESCROW_SETTLEMENT_DISABLED_MESSAGE =
  "Gno escrow settlement is preview-only until a testnet/local realm deployment is configured.";
