import { getAssetByChainAndDenom, getAssetsByDisplayDenom } from '@/lib/assets/asset-registry';
import { TradeAsset } from './assets';
import { VerificationStatus } from './verification';

export interface TokenAuthenticityInput {
  type?: string;
  chainId: string;
  displayDenom: string;
  technicalDenom: string;
  ibcTrace?: string;
}

export interface TokenAuthenticityResult {
  status: VerificationStatus;
  reason: string;
  registrySymbol?: string;
  registryName?: string;
  expectedIdentity?: string;
}

export function verifyTokenAuthenticity(input: TokenAuthenticityInput): TokenAuthenticityResult {
  if (input.type === 'nft') {
    return {
      status: 'unverified',
      reason: 'NFT identity must be verified by collection contract and token ID before settlement.',
    };
  }

  const exact = getAssetByChainAndDenom(input.chainId, input.technicalDenom);
  if (exact) {
    const display = input.displayDenom.toLowerCase();
    const matchesDisplay =
      display === exact.symbol.toLowerCase() ||
      display === exact.displayDenom.toLowerCase() ||
      display === exact.technicalDenom.toLowerCase();

    if (!matchesDisplay) {
      return {
        status: 'suspicious',
        reason: `Technical denom matches ${exact.symbol}, but display ticker says ${input.displayDenom}.`,
        registrySymbol: exact.symbol,
        registryName: exact.name,
        expectedIdentity: `${exact.chainId}/${exact.technicalDenom}`,
      };
    }

    return {
      status: exact.verificationStatus === 'verified' || exact.verificationStatus === 'demo'
        ? 'verified'
        : exact.verificationStatus,
      reason: `Registry match: ${exact.name} on ${exact.chainId} (${exact.technicalDenom}).`,
      registrySymbol: exact.symbol,
      registryName: exact.name,
      expectedIdentity: `${exact.chainId}/${exact.technicalDenom}`,
    };
  }

  const claimed = getAssetsByDisplayDenom(input.displayDenom);
  if (claimed.length > 0) {
    const expected = claimed.map((asset) => `${asset.symbol}=${asset.chainId}/${asset.technicalDenom}`).join(', ');
    return {
      status: 'suspicious',
      reason: `Ticker ${input.displayDenom} is known, but this token identity does not match registry. Expected ${expected}.`,
      expectedIdentity: expected,
    };
  }

  if (input.technicalDenom.toLowerCase().startsWith('ibc/')) {
    if (input.ibcTrace) {
      return {
        status: 'unverified',
        reason: `IBC asset resolved to ${input.ibcTrace}. Verify the source chain and channel before accepting; a resolved trace alone is not verification.`,
      };
    }
    return {
      status: 'unverified',
      reason: 'IBC denom trace could not be resolved; verify source path before accepting.',
    };
  }

  return {
    status: 'unknown',
    reason: 'Unknown token identity; verify chain ID and technical denom before accepting.',
  };
}

export function applyTokenAuthenticity(asset: TradeAsset): TradeAsset {
  const result = verifyTokenAuthenticity(asset);
  return {
    ...asset,
    verificationStatus: result.status,
    verificationReason: result.reason,
  };
}
