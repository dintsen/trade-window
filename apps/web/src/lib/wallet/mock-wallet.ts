import { WalletAccount, WalletAdapter } from "./types";

let currentAccount: WalletAccount | null = null;
let currentDemoUser: "A" | "B" | null = null;

const MOCK_ACCOUNTS: Record<"A" | "B", WalletAccount> = {
  A: {
    address: "atone1demoA9876543210qwertyuiop",
    displayAddress: "atone...uiop",
    chainId: "atomone-1",
    source: "mock",
    ecosystem: "atomone",
    isMock: true,
  },
  B: {
    address: "atone1demoB1234567890asdfghjkl",
    displayAddress: "atone...hjkl",
    chainId: "atomone-1",
    source: "mock",
    ecosystem: "atomone",
    isMock: true,
  },
};

export function setNextMockUser(user: "A" | "B") {
  currentDemoUser = user;
}

export const mockWalletAdapter: WalletAdapter = {
  id: "mock",
  ecosystem: "atomone",
  label: "Mock Wallet",
  isAvailable: () => true,
  connect: async () => {
    // Determine which demo user to assign
    const userToAssign = currentDemoUser || "A";
    currentAccount = MOCK_ACCOUNTS[userToAssign];
    return currentAccount;
  },
  disconnect: async () => {
    currentAccount = null;
    currentDemoUser = null;
  },
  getAccount: async () => {
    return currentAccount;
  },
};
