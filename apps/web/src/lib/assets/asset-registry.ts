export type VerificationStatus = 'verified' | 'unverified' | 'suspicious' | 'demo';

export interface AssetIdentity {
  symbol: string;
  name: string;
  displayDenom: string;
  technicalDenom: string;
  chainId: string;
  source: string;
  decimals: number;
  logoUrl: string;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
  description?: string;
}

export const ASSET_REGISTRY: Record<string, AssetIdentity> = {
  gnot: {
    symbol: 'GNOT',
    name: 'Gno Token',
    displayDenom: 'GNOT',
    technicalDenom: 'ugnot',
    chainId: 'gno-testnet',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/tokens/gnot.svg',
    verificationStatus: 'demo',
    isDemo: true,
    description: 'Native token of Gno.land (Testnet)',
  },
  atone: {
    symbol: 'ATONE',
    name: 'AtomOne',
    displayDenom: 'ATONE',
    technicalDenom: 'uatone',
    chainId: 'gno-testnet',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/tokens/atone.svg',
    verificationStatus: 'demo',
    isDemo: true,
    description: 'AtomOne test token',
  },
  photon: {
    symbol: 'PHOTON',
    name: 'Photon',
    displayDenom: 'PHOTON',
    technicalDenom: 'uphoton',
    chainId: 'gno-testnet',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/tokens/photon.svg',
    verificationStatus: 'demo',
    isDemo: true,
    description: 'Photon test token',
  },
};

export function getAsset(technicalDenom: string): AssetIdentity | undefined {
  const key = Object.keys(ASSET_REGISTRY).find(
    (k) => ASSET_REGISTRY[k].technicalDenom === technicalDenom || ASSET_REGISTRY[k].symbol.toLowerCase() === technicalDenom.toLowerCase()
  );
  return key ? ASSET_REGISTRY[key] : undefined;
}

export function getAllAssets(): AssetIdentity[] {
  return Object.values(ASSET_REGISTRY);
}
