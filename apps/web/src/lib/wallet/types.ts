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

export interface AdenaAccountInfo {
  address?: string;
  name?: string;
}

export interface AdenaContractRequest {
  messages: unknown[];
  gasFee?: number;
  gasWanted?: number;
  memo?: string;
}

export interface AdenaProvider {
  AddEstablish(appName: string): Promise<void>;
  GetAccount(): Promise<AdenaAccountInfo>;
  DoContract?(request: AdenaContractRequest): Promise<unknown>;
}

declare global {
  interface Window {
    adena?: AdenaProvider;
  }
}
