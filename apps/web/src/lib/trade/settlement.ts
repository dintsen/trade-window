import { TradeAsset, SettlementFeeEstimate, SettlementRoute } from './assets';
import { WalletAccount, WalletBalance } from '@/lib/wallet/types';
import { formatBaseAmount, parseHumanAmount } from '@/lib/wallet/balances';

export interface SettlementReadinessIssue {
  level: 'error' | 'warning';
  assetId?: string;
  message: string;
}

export interface SettlementReadiness {
  ok: boolean;
  issues: SettlementReadinessIssue[];
}

const FEE_ESTIMATES: Record<string, SettlementFeeEstimate> = {
  'cosmoshub-4': {
    denom: 'uatom',
    amount: '5000',
    displayAmount: '0.005 ATOM',
    source: 'static-estimate',
  },
  'atomone-1': {
    denom: 'uphoton',
    amount: '5000',
    displayAmount: '0.005 PHOTON',
    source: 'static-estimate',
  },
  'stargaze-1': {
    denom: 'ustars',
    amount: '5000',
    displayAmount: '0.005 STARS',
    source: 'static-estimate',
  },
  'gno-testnet': {
    denom: 'ugnot',
    amount: '1',
    displayAmount: '0.000001 GNOT',
    source: 'static-estimate',
  },
  'solana-mainnet-beta': {
    denom: 'lamports',
    amount: '5000',
    displayAmount: '0.000005 SOL',
    source: 'static-estimate',
  },
};

export function estimateSettlementFee(chainId: string): SettlementFeeEstimate | undefined {
  return FEE_ESTIMATES[chainId];
}

export function buildSettlementRoute(
  asset: TradeAsset,
  sender: WalletAccount,
  receiver?: WalletAccount
): SettlementRoute {
  const fee = estimateSettlementFee(asset.chainId);
  const receiverMatches = receiver?.chainId === asset.chainId;

  return {
    network: asset.chainId,
    sender: {
      chainId: sender.chainId ?? asset.chainId,
      address: sender.address,
      label: sender.name ?? sender.displayAddress,
      provider: sender.provider,
    },
    receiver: receiverMatches
      ? {
          chainId: receiver.chainId ?? asset.chainId,
          address: receiver.address,
          label: receiver.name ?? receiver.displayAddress,
          provider: receiver.provider,
        }
      : undefined,
    fee,
    support: receiverMatches ? 'ready' : 'receiver_required',
    warning: receiverMatches
      ? undefined
      : `Receiver wallet for ${asset.chainId} is required before settlement.`,
  };
}

export function validateSettlementReadiness(
  assets: TradeAsset[],
  balances: WalletBalance[]
): SettlementReadiness {
  const issues: SettlementReadinessIssue[] = [];

  for (const asset of assets) {
    const route = asset.settlement;
    if (!route) {
      issues.push({
        level: 'warning',
        assetId: asset.id,
        message: `${asset.displayDenom}: settlement route is not attached to the intent yet.`,
      });
      continue;
    }

    if (!route.receiver?.address) {
      issues.push({
        level: 'warning',
        assetId: asset.id,
        message: `${asset.displayDenom}: receiver wallet for ${asset.chainId} is missing.`,
      });
    }

    if (route.sender.chainId !== asset.chainId) {
      issues.push({
        level: 'error',
        assetId: asset.id,
        message: `${asset.displayDenom}: sender wallet is on ${route.sender.chainId}, asset is on ${asset.chainId}.`,
      });
    }

    if (route.receiver && route.receiver.chainId !== asset.chainId) {
      issues.push({
        level: 'error',
        assetId: asset.id,
        message: `${asset.displayDenom}: receiver wallet is on ${route.receiver.chainId}, asset is on ${asset.chainId}.`,
      });
    }

    if (asset.chainId.startsWith('solana') || asset.chainId === 'solana-mainnet-beta') {
      issues.push({
        level: 'warning',
        assetId: asset.id,
        message: `${asset.displayDenom}: Solana settlement is read-only research and cannot be executed through Gno escrow.`,
      });
    }

    addBalanceIssue(asset, balances, issues);
    addFeeIssue(asset, balances, issues);
  }

  return {
    ok: issues.every((issue) => issue.level !== 'error'),
    issues,
  };
}

function addBalanceIssue(
  asset: TradeAsset,
  balances: WalletBalance[],
  issues: SettlementReadinessIssue[]
) {
  if (asset.type !== 'coin') return;
  const required = parseHumanAmount(asset.amount, asset.decimals);
  if (required === null) {
    issues.push({
      level: 'error',
      assetId: asset.id,
      message: `${asset.displayDenom}: amount is not a valid decimal value.`,
    });
    return;
  }

  const senderAddress = asset.settlement?.sender.address;
  const balance = balances.find(
    (b) =>
      b.chainId === asset.chainId &&
      b.denom === asset.technicalDenom &&
      (!senderAddress || !b.ownerAddress || b.ownerAddress === senderAddress)
  );
  if (!balance) {
    issues.push({
      level: 'warning',
      assetId: asset.id,
      message: `${asset.displayDenom}: wallet balance for ${asset.technicalDenom} was not found.`,
    });
    return;
  }

  if (BigInt(balance.amount) < required) {
    issues.push({
      level: 'error',
      assetId: asset.id,
      message: `${asset.displayDenom}: balance ${formatBaseAmount(balance.amount, asset.decimals)} is below offer amount ${asset.amount}.`,
    });
  }
}

function addFeeIssue(
  asset: TradeAsset,
  balances: WalletBalance[],
  issues: SettlementReadinessIssue[]
) {
  const fee = asset.settlement?.fee ?? estimateSettlementFee(asset.chainId);
  if (!fee) {
    issues.push({
      level: 'warning',
      assetId: asset.id,
      message: `${asset.displayDenom}: fee estimate is unavailable for ${asset.chainId}.`,
    });
    return;
  }

  const senderAddress = asset.settlement?.sender.address;
  const balance = balances.find(
    (b) =>
      b.chainId === asset.chainId &&
      b.denom === fee.denom &&
      (!senderAddress || !b.ownerAddress || b.ownerAddress === senderAddress)
  );
  if (!balance) {
    issues.push({
      level: 'warning',
      assetId: asset.id,
      message: `${asset.displayDenom}: fee balance ${fee.displayAmount} (${fee.denom}) was not found.`,
    });
    return;
  }

  const requiredAsset = asset.type === 'coin' && asset.technicalDenom === fee.denom
    ? parseHumanAmount(asset.amount, asset.decimals) ?? BigInt(0)
    : BigInt(0);
  const requiredTotal = requiredAsset + BigInt(fee.amount);

  if (BigInt(balance.amount) < requiredTotal) {
    issues.push({
      level: 'error',
      assetId: asset.id,
      message: `${asset.displayDenom}: balance must cover amount plus fee ${fee.displayAmount}.`,
    });
  }
}
