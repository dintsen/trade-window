import { useState, useCallback } from "react";
import { GnoWalletAccount, WalletAdapter, GnoWalletProviderId } from "./types";
import { mockWalletAdapter, setNextMockUser } from "./mock-wallet";
import { adenaWalletAdapter } from "./adena-wallet";

const ADAPTERS: Record<GnoWalletProviderId, WalletAdapter> = {
  mock: mockWalletAdapter,
  adena: adenaWalletAdapter,
};

export function useWalletStore() {
  const [account, setAccount] = useState<GnoWalletAccount | null>(null);
  const [activeProvider, setActiveProvider] = useState<GnoWalletProviderId | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (providerId: GnoWalletProviderId, mockUser?: "A" | "B") => {
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
