export type WalletEcosystem = "atomone" | "gno";

export type WalletProviderId =
  | "mock"
  | "keplr"
  | "cosmostation"
  | "adena";

declare global {
  interface Window {
    adena?: {
      AddEstablish: (dappName: string) => Promise<unknown>;
      GetAccount: () => Promise<{ address: string }>;
    };
  }
}

export interface WalletAccount {
  address: string;
  displayAddress: string;
  chainId: string;
  source: WalletProviderId;
  ecosystem: WalletEcosystem;
  isMock: boolean;
}

export interface WalletAdapter {
  id: WalletProviderId;
  ecosystem: WalletEcosystem;
  label: string;
  isAvailable(): boolean;
  connect(): Promise<WalletAccount>;
  disconnect(): Promise<void>;
  getAccount(): Promise<WalletAccount | null>;
}
