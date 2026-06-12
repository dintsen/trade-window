export type GnoWalletProviderId = "mock" | "adena";

export interface GnoWalletAccount {
  address: string;
  displayAddress: string;
  chainId?: string;
  provider: GnoWalletProviderId;
  isMock: boolean;
}

export interface WalletAdapter {
  id: GnoWalletProviderId;
  label: string;
  isAvailable(): boolean;
  connect(): Promise<GnoWalletAccount>;
  getAccount(): Promise<GnoWalletAccount | null>;
  disconnect(): Promise<void>;
}
