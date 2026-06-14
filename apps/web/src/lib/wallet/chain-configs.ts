/**
 * Chain configurations for Keplr / Cosmos SDK chains.
 * Only used when the chain is NOT already in Keplr's registry
 * (e.g. AtomOne mainnet which Keplr may not have by default).
 */

export interface ChainConfig {
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bip44: { coinType: number };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: ChainCurrency[];
  feeCurrencies: FeeCurrency[];
  stakeCurrency: ChainCurrency;
}

interface ChainCurrency {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  coinGeckoId?: string;
}

interface FeeCurrency extends ChainCurrency {
  gasPriceStep?: { low: number; average: number; high: number };
}

export const ATOMONE_CHAIN_CONFIG: ChainConfig = {
  chainId: "atomone-1",
  chainName: "AtomOne",
  rpc: "https://rpc.atomone.xyz",
  rest: "https://api.atomone.xyz",
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "atone",
    bech32PrefixAccPub: "atonepub",
    bech32PrefixValAddr: "atonevaloper",
    bech32PrefixValPub: "atonevaloperpub",
    bech32PrefixConsAddr: "atonevalcons",
    bech32PrefixConsPub: "atonevalconspub",
  },
  currencies: [
    { coinDenom: "ATONE", coinMinimalDenom: "uatone", coinDecimals: 6 },
    { coinDenom: "PHOTON", coinMinimalDenom: "uphoton", coinDecimals: 6 },
  ],
  feeCurrencies: [
    {
      coinDenom: "PHOTON",
      coinMinimalDenom: "uphoton",
      coinDecimals: 6,
      gasPriceStep: { low: 0.001, average: 0.002, high: 0.01 },
    },
  ],
  stakeCurrency: { coinDenom: "ATONE", coinMinimalDenom: "uatone", coinDecimals: 6 },
};

/** Explorer TX URL builder per chain */
export const EXPLORER_TX: Record<string, (txHash: string) => string> = {
  "cosmoshub-4": (h) => `https://www.mintscan.io/cosmos/transactions/${h}`,
  "stargaze-1": (h) => `https://www.mintscan.io/stargaze/transactions/${h}`,
  "atomone-1": (h) => `https://explorer.atomone.xyz/atomone/tx/${h}`,
  "gno-testnet": (h) => `https://gnoscan.io/transactions/${h}`,
};
