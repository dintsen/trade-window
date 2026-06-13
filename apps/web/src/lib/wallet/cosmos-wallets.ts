import {
  WalletAccount,
  WalletAdapter,
  CosmosWalletProviderId,
  KeplrLikeProvider,
} from "./types";

export const DEFAULT_COSMOS_CHAIN_ID = "cosmoshub-4";

/** Chains we ask Keplr-like wallets to enable. All read-only: connect + address. */
export const COSMOS_CHAIN_IDS = ["cosmoshub-4", "stargaze-1"];

function getProvider(id: CosmosWalletProviderId): KeplrLikeProvider | null {
  if (typeof window === "undefined") return null;
  switch (id) {
    case "keplr":
      return window.keplr ?? null;
    case "leap":
      return window.leap ?? null;
    case "cosmostation":
      return window.cosmostation?.providers?.keplr ?? null;
  }
}

function makeAdapter(
  id: CosmosWalletProviderId,
  label: string,
  supportLevel: WalletAdapter["supportLevel"]
): WalletAdapter {
  return {
    id,
    label,
    ecosystem: "cosmos",
    supportLevel,
    isAvailable: () => getProvider(id) !== null,

    connect: async (chainId?: string): Promise<WalletAccount> => {
      const provider = getProvider(id);
      if (!provider) {
        throw new Error(`${label} not detected. Please install the ${label} extension.`);
      }
      const targetChain = chainId ?? DEFAULT_COSMOS_CHAIN_ID;
      try {
        // Enable is only called after an explicit user click (no auto-popup).
        await provider.enable(targetChain);
        const key = await provider.getKey(targetChain);
        if (!key?.bech32Address) {
          throw new Error(`${label} did not return an address.`);
        }
        return {
          address: key.bech32Address,
          displayAddress: key.name || label,
          chainId: targetChain,
          provider: id,
          ecosystem: "cosmos",
          isMock: false,
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/reject|denied|cancel/i.test(msg)) {
          throw new Error(`Connection request was rejected in ${label}.`);
        }
        throw new Error(`Failed to connect to ${label}: ${msg}`);
      }
    },

    getAccount: async (chainId?: string): Promise<WalletAccount | null> => {
      const provider = getProvider(id);
      if (!provider) return null;
      try {
        const targetChain = chainId ?? DEFAULT_COSMOS_CHAIN_ID;
        const key = await provider.getKey(targetChain);
        if (!key?.bech32Address) return null;
        return {
          address: key.bech32Address,
          displayAddress: key.name || label,
          chainId: targetChain,
          provider: id,
          ecosystem: "cosmos",
          isMock: false,
        };
      } catch {
        return null;
      }
    },

    disconnect: async (): Promise<void> => {
      // Read-only connection; dropping local state is sufficient.
    },
  };
}

export const keplrWalletAdapter = makeAdapter("keplr", "Keplr", "preview");
export const leapWalletAdapter = makeAdapter("leap", "Leap", "preview");
export const cosmostationWalletAdapter = makeAdapter("cosmostation", "Cosmostation", "preview");
