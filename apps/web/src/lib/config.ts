export const config = {
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || null,
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  enableAdena: process.env.NEXT_PUBLIC_ENABLE_ADENA === 'true',
  enableGnoTxPreview: process.env.NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW === 'true',
  enableGnoTestnetTransfers: process.env.NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS === 'true',
  enableGnoMainnetTransfers: process.env.NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS === 'true',
};
