import { useState, useCallback } from "react";
import { WalletAccount, WalletAdapter, WalletProviderId } from "./types";
import { mockWalletAdapter, setNextMockUser } from "./mock-wallet";
import { keplrWalletAdapter } from "./keplr-wallet";
import { cosmostationWalletAdapter } from "./cosmostation-wallet";
import { adenaWalletAdapter } from "./adena-wallet";

const ADAPTERS: Record<WalletProviderId, WalletAdapter> = {
  mock: mockWalletAdapter,
  keplr: keplrWalletAdapter,
  cosmostation: cosmostationWalletAdapter,
  adena: adenaWalletAdapter,
};

export function useWalletStore() {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [activeProvider, setActiveProvider] = useState<WalletProviderId | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (providerId: WalletProviderId, mockUser?: "A" | "B") => {
    setIsConnecting(true);
    setError(null);
    try {
      const adapter = ADAPTERS[providerId];
      if (providerId === "mock" && mockUser) {
        setNextMockUser(mockUser);
      }
      const acc = await adapter.connect();
      setAccount(acc);
      setActiveProvider(providerId);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown connection error");
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (activeProvider) {
      await ADAPTERS[activeProvider].disconnect();
    }
    setAccount(null);
    setActiveProvider(null);
    setError(null);
  }, [activeProvider]);

  return {
    account,
    activeProvider,
    isConnecting,
    error,
    connect,
    disconnect,
    adapters: Object.values(ADAPTERS),
  };
}
