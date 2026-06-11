import { WalletAdapter } from "./types";

export const cosmostationWalletAdapter: WalletAdapter = {
  id: "cosmostation",
  ecosystem: "atomone",
  label: "Cosmostation",
  isAvailable: () => false, // TODO: Implement window.cosmostation check
  connect: async () => {
    throw new Error("Cosmostation integration planned. Not connected in MVP.");
  },
  disconnect: async () => {
    // Stub
  },
  getAccount: async () => {
    return null;
  },
};
