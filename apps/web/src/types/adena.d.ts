declare global {
  interface Window {
    adena?: {
      AddEstablish?: (appName: string) => Promise<unknown>;
      GetAccount?: () => Promise<{ address: string; [key: string]: unknown }>;
    };
  }
}

export {};
