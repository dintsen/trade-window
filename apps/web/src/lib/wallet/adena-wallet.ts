import { GnoWalletAccount, WalletAdapter } from "./types";
export const adenaWalletAdapter: WalletAdapter = {
  id: "adena",
  label: "Adena Wallet",
  isAvailable: () => typeof window !== 'undefined' && !!(window as any).adena,
  
  connect: async (): Promise<GnoWalletAccount> => {
    if (!(window as any).adena) {
      throw new Error("Adena not detected. Please install the Adena extension.");
    }
    try {
      const adena = (window as any).adena;
      await adena.AddEstablish("Trade Window");
      const accountInfo = await adena.GetAccount();
      
      return {
        address: accountInfo.address,
        displayAddress: "Adena User",
        provider: "adena",
        isMock: false
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error("Failed to connect to Adena: " + msg);
    }
  },
  
  disconnect: async (): Promise<void> => {
    // Read-only prototype; disconnecting just drops the state in our app
  },
  
  getAccount: async (): Promise<GnoWalletAccount | null> => {
    if (!(window as any).adena) return null;
    try {
      // In a real app we might need to check if we are established first.
      // But for prototype, we just attempt GetAccount
      const adena = (window as any).adena;
      const accountInfo = await adena.GetAccount();
      if (!accountInfo || !accountInfo.address) return null;

      return {
        address: accountInfo.address,
        displayAddress: "Adena User",
        provider: "adena",
        isMock: false
      };
    } catch {
      return null;
    }
  },
};
