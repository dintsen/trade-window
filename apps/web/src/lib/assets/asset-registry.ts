export type VerificationStatus = 'verified' | 'unverified' | 'suspicious' | 'demo';
export type SupportLevel = 'live' | 'preview' | 'planned' | 'disabled';
export type Ecosystem = 'gno' | 'atomone' | 'cosmos' | 'stargaze';

export interface AssetIdentity {
  symbol: string;
  name: string;
  displayDenom: string;
  technicalDenom: string;
  chainId: string;
  ecosystem: Ecosystem;
  source: string;
  decimals: number;
  logoUrl: string;
  verificationStatus: VerificationStatus;
  supportLevel: SupportLevel;
  isDemo: boolean;
  explorerUrl?: string;
  description?: string;
}

export const ASSET_REGISTRY: Record<string, AssetIdentity> = {
  gnot: {
    symbol: 'GNOT',
    name: 'Gno Token',
    displayDenom: 'GNOT',
    technicalDenom: 'ugnot',
    chainId: 'gno-testnet',
    ecosystem: 'gno',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/logos/gnot-icon.svg',
    verificationStatus: 'demo',
    supportLevel: 'preview',
    isDemo: true,
    description: 'Native token of Gno.land (Testnet)',
  },
  atone: {
    symbol: 'ATONE',
    name: 'AtomOne',
    displayDenom: 'ATONE',
    technicalDenom: 'uatone',
    chainId: 'atomone-1',
    ecosystem: 'atomone',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/logos/atomone.svg',
    verificationStatus: 'demo',
    supportLevel: 'preview',
    isDemo: true,
    explorerUrl: 'https://www.mintscan.io/atomone/address/{address}',
    description: 'Native staking token of AtomOne',
  },
  photon: {
    symbol: 'PHOTON',
    name: 'Photon',
    displayDenom: 'PHOTON',
    technicalDenom: 'uphoton',
    chainId: 'atomone-1',
    ecosystem: 'atomone',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/logos/photon.svg',
    verificationStatus: 'demo',
    supportLevel: 'preview',
    isDemo: true,
    description: 'AtomOne fee token',
  },
  atom: {
    symbol: 'ATOM',
    name: 'Cosmos Hub',
    displayDenom: 'ATOM',
    technicalDenom: 'uatom',
    chainId: 'cosmoshub-4',
    ecosystem: 'cosmos',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/logos/cosmos.svg',
    verificationStatus: 'verified',
    supportLevel: 'preview',
    isDemo: false,
    explorerUrl: 'https://www.mintscan.io/cosmos/address/{address}',
    description: 'Native staking token of the Cosmos Hub',
  },
  stars: {
    symbol: 'STARS',
    name: 'Stargaze',
    displayDenom: 'STARS',
    technicalDenom: 'ustars',
    chainId: 'stargaze-1',
    ecosystem: 'stargaze',
    source: 'native',
    decimals: 6,
    logoUrl: '/assets/tokens/stars.svg',
    verificationStatus: 'verified',
    supportLevel: 'preview',
    isDemo: false,
    explorerUrl: 'https://www.mintscan.io/stargaze/address/{address}',
    description: 'Native token of Stargaze (NFT hub of Cosmos)',
  },
};

/**
 * Legacy alias map. `AON` was an old internal name for AtomOne and is
 * deprecated: it must never be shown as a selectable live asset. When old
 * stored data contains `AON`/`uaon`, it is transparently mapped to ATONE.
 */
const LEGACY_ALIASES: Record<string, string> = {
  aon: 'atone',
  uaon: 'uatone',
};

function normalizeDenom(input: string): string {
  const lower = input.toLowerCase();
  return LEGACY_ALIASES[lower] ?? lower;
}

export function getAsset(technicalDenom: string): AssetIdentity | undefined {
  const normalized = normalizeDenom(technicalDenom);
  const key = Object.keys(ASSET_REGISTRY).find(
    (k) =>
      ASSET_REGISTRY[k].technicalDenom === normalized ||
      ASSET_REGISTRY[k].symbol.toLowerCase() === normalized
  );
  return key ? ASSET_REGISTRY[key] : undefined;
}

export function getAllAssets(): AssetIdentity[] {
  return Object.values(ASSET_REGISTRY);
}

export function getAssetsByEcosystem(ecosystem: Ecosystem): AssetIdentity[] {
  return getAllAssets().filter((a) => a.ecosystem === ecosystem);
}
