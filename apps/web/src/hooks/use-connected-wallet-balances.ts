'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchBalances, fetchGnoBalances, formatBaseAmount } from '@/lib/wallet/balances';
import { WalletAccount, WalletBalance } from '@/lib/wallet/types';
import { useWalletStore } from '@/lib/wallet/wallet-store';

export interface WalletBalanceSource {
  address: string;
  label: string;
  provider: string;
  amount: string;
  displayAmount: string;
}

export interface TokenBalanceAggregate {
  key: string;
  chainId: string;
  denom: string;
  symbol?: string;
  decimals: number;
  totalAmount: string;
  displayAmount: string;
  walletCount: number;
  sources: WalletBalanceSource[];
}

export interface ConnectedWalletBalancesState {
  balances: WalletBalance[];
  aggregates: TokenBalanceAggregate[];
  loading: boolean;
  errors: string[];
  lastFetched: number | null;
  refresh: () => void;
}

export function useConnectedWalletBalances(): ConnectedWalletBalancesState {
  const { accounts } = useWalletStore();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    if (accounts.length === 0) {
      setBalances([]);
      setErrors([]);
      setLastFetched(null);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const results = await Promise.all(accounts.map(fetchAccountBalances));
      const nextBalances = results.flatMap((result) => result.balances);
      const nextErrors = results.flatMap((result) => result.error ? [result.error] : []);
      setBalances(nextBalances);
      setErrors(nextErrors);
      setLastFetched(Date.now());
    } finally {
      setLoading(false);
    }
  }, [accounts]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const aggregates = useMemo(() => aggregateBalances(balances), [balances]);

  return { balances, aggregates, loading, errors, lastFetched, refresh };
}

async function fetchAccountBalances(
  account: WalletAccount
): Promise<{ balances: WalletBalance[]; error: string | null }> {
  if (account.isMock) {
    return { balances: [], error: null };
  }

  let result: WalletBalance[] | null = null;
  if (account.ecosystem === 'gno') {
    result = await fetchGnoBalances(account.address);
  } else if (account.chainId) {
    result = await fetchBalances(account.address, account.chainId);
  }

  if (result === null) {
    return {
      balances: [],
      error: `${account.chainName ?? account.chainId ?? account.provider}: live balances unavailable`,
    };
  }

  const ownerKey = `${account.provider}:${account.chainId ?? 'unknown'}:${account.address}`;
  return {
    balances: result.map((balance) => ({
      ...balance,
      ownerAddress: account.address,
      ownerLabel: account.name ?? account.displayAddress,
      ownerProvider: account.provider,
      ownerKey,
    })),
    error: null,
  };
}

function aggregateBalances(balances: WalletBalance[]): TokenBalanceAggregate[] {
  const byToken = new Map<string, WalletBalance[]>();

  balances.forEach((balance) => {
    const key = `${balance.chainId}:${balance.denom}`;
    const current = byToken.get(key) ?? [];
    current.push(balance);
    byToken.set(key, current);
  });

  return Array.from(byToken.entries())
    .map(([key, tokenBalances]) => {
      const first = tokenBalances[0];
      const decimals = first.decimals ?? 6;
      const total = tokenBalances.reduce((sum, balance) => {
        if (!/^\d+$/.test(balance.amount)) return sum;
        return sum + BigInt(balance.amount);
      }, BigInt(0));

      return {
        key,
        chainId: first.chainId,
        denom: first.denom,
        symbol: first.symbol,
        decimals,
        totalAmount: total.toString(),
        displayAmount: formatBaseAmount(total.toString(), decimals),
        walletCount: new Set(tokenBalances.map((balance) => balance.ownerKey ?? balance.ownerAddress ?? '')).size,
        sources: tokenBalances.map((balance) => ({
          address: balance.ownerAddress ?? '',
          label: balance.ownerLabel ?? balance.ownerAddress ?? 'Wallet',
          provider: balance.ownerProvider ?? 'wallet',
          amount: balance.amount,
          displayAmount: formatBaseAmount(balance.amount, balance.decimals ?? decimals),
        })),
      };
    })
    .sort((a, b) => {
      const symbolCompare = (a.symbol ?? a.denom).localeCompare(b.symbol ?? b.denom);
      if (symbolCompare !== 0) return symbolCompare;
      return a.chainId.localeCompare(b.chainId);
    });
}
