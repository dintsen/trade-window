/**
 * Global wallet store — module-level singleton.
 * All components that call useWalletStore() share the same state.
 * Uses useSyncExternalStore for safe React 18 concurrent-mode reads.
 */

import { useSyncExternalStore, useCallback } from "react";
import { WalletAccount, WalletAdapter, WalletProviderId } from "./types";
import { mockWalletAdapter, setNextMockUser } from "./mock-wallet";
import { adenaWalletAdapter } from "./adena-wallet";
import {
  keplrWalletAdapter,
  leapWalletAdapter,
  cosmostationWalletAdapter,
} from "./cosmos-wallets";

// ─── Adapters ────────────────────────────────────────────────────────────────

const ADAPTERS: Record<WalletProviderId, WalletAdapter> = {
  mock: mockWalletAdapter,
  adena: adenaWalletAdapter,
  keplr: keplrWalletAdapter,
  leap: leapWalletAdapter,
  cosmostation: cosmostationWalletAdapter,
};

// ─── Singleton state ─────────────────────────────────────────────────────────

interface WalletState {
  account: WalletAccount | null;
  activeProvider: WalletProviderId | null;
  isConnecting: boolean;
  error: string | null;
}

let state: WalletState = {
  account: null,
  activeProvider: null,
  isConnecting: false,
  error: null,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function setState(patch: Partial<WalletState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

async function connect(
  providerId: WalletProviderId,
  mockUserOrChainId?: "A" | "B" | string
) {
  setState({ isConnecting: true, error: null });
  try {
    const adapter = ADAPTERS[providerId];
    let chainId: string | undefined;
    if (providerId === "mock" && (mockUserOrChainId === "A" || mockUserOrChainId === "B")) {
      setNextMockUser(mockUserOrChainId);
    } else if (typeof mockUserOrChainId === "string") {
      chainId = mockUserOrChainId;
    }
    const acc = await adapter.connect(chainId);
    setState({ account: acc, activeProvider: providerId, isConnecting: false, error: null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown connection error";
    setState({ isConnecting: false, error: msg });
  }
}

async function disconnect() {
  const { activeProvider } = state;
  if (activeProvider) {
    await ADAPTERS[activeProvider].disconnect().catch(() => {});
  }
  setState({ account: null, activeProvider: null, error: null });
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useWalletStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const stableConnect = useCallback(connect, []);
  const stableDisconnect = useCallback(disconnect, []);

  return {
    account: snap.account,
    activeProvider: snap.activeProvider,
    isConnecting: snap.isConnecting,
    error: snap.error,
    connect: stableConnect,
    disconnect: stableDisconnect,
    adapters: Object.values(ADAPTERS),
  };
}
