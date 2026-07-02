import {
  WalletAccount,
  WalletAdapter,
  CosmosWalletProviderId,
  KeplrLikeProvider,
} from "./types";
import { ATOMONE_CHAIN_CONFIG, CHAIN_NAMES, EXPLORER_ADDRESS } from "./chain-configs";

export const DEFAULT_COSMOS_CHAIN_ID = "cosmoshub-4";

/** Chains we ask Keplr-like wallets to enable. All read-only: connect + address. */
export const COSMOS_CHAIN_IDS = ["cosmoshub-4", "stargaze-1", "atomone-1"];

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

function bytesToHex(bytes?: Uint8Array): string | undefined {
  if (!bytes) return undefined;
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function suggestChainIfNeeded(provider: KeplrLikeProvider, chainId: string) {
  if (chainId !== "atomone-1" || !provider.experimentalSuggestChain) return;
  try {
    await provider.experimentalSuggestChain(ATOMONE_CHAIN_CONFIG);
  } catch {
    // Wallets can reject duplicate chain suggestions; enable() below gives the real result.
  }
}

function buildAccount(
  id: CosmosWalletProviderId,
  label: string,
  supportLevel: WalletAdapter["supportLevel"],
  chainId: string,
  key: { name: string; bech32Address: string; pubKey?: Uint8Array }
): WalletAccount {
  return {
    address: key.bech32Address,
    displayAddress: key.name || `${key.bech32Address.slice(0, 10)}…${key.bech32Address.slice(-4)}`,
    name: key.name || undefined,
    chainId,
    chainName: CHAIN_NAMES[chainId] ?? chainId,
    providerLabel: label,
    supportLevel,
    publicKeyHex: bytesToHex(key.pubKey),
    explorerAddressUrl: EXPLORER_ADDRESS[chainId]?.(key.bech32Address),
    provider: id,
    ecosystem: "cosmos",
    isMock: false,
  };
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
    isAvailable: () => supportLevel !== "disabled" && getProvider(id) !== null,

    connect: async (chainId?: string): Promise<WalletAccount> => {
      if (supportLevel === "disabled") {
        throw new Error(`${label} support is disabled.`);
      }
      const provider = getProvider(id);
      if (!provider) {
        throw new Error(`${label} not detected. Please install the ${label} extension.`);
      }
      const targetChain = chainId ?? DEFAULT_COSMOS_CHAIN_ID;
      try {
        await suggestChainIfNeeded(provider, targetChain);
        // Enable is only called after an explicit user click (no auto-popup).
        await provider.enable(targetChain);
        const key = await provider.getKey(targetChain);
        if (!key?.bech32Address) {
          throw new Error(`${label} did not return an address.`);
        }
        return buildAccount(id, label, supportLevel, targetChain, key);
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
        return buildAccount(id, label, supportLevel, targetChain, key);
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
export const leapWalletAdapter = makeAdapter("leap", "Leap", "disabled");
export const cosmostationWalletAdapter = makeAdapter("cosmostation", "Cosmostation", "preview");
