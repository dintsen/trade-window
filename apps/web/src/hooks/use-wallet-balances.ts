'use client';

import { useState, useEffect, useCallback } from 'react';
import { WalletBalance } from '@/lib/wallet/types';
import { fetchBalances, fetchGnoBalances } from '@/lib/wallet/balances';
import { useWalletStore } from '@/lib/wallet/wallet-store';

export interface WalletBalancesState {
  balances: WalletBalance[];
  loading: boolean;
  error: string | null;
  /** Timestamp of last successful fetch */
  lastFetched: number | null;
  /** Re-fetch balances manually */
  refresh: () => void;
}

export function useWalletBalances(): WalletBalancesState {
  const { account, selectedAccount } = useWalletStore();
  const balanceAccount = selectedAccount ?? account;
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    if (!balanceAccount) {
      setBalances([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let result: WalletBalance[] | null = null;

      if (balanceAccount.ecosystem === 'gno') {
        result = await fetchGnoBalances(balanceAccount.address);
      } else if (balanceAccount.chainId) {
        result = await fetchBalances(balanceAccount.address, balanceAccount.chainId);
      } else {
        result = [];
      }

      if (result === null) {
        // Chain not supported yet for live balance fetch
        setError(`Live balance query not available for ${balanceAccount.chainId}`);
        setBalances([]);
      } else {
        // Sort: known assets first, then by amount descending
        const sorted = result.sort((a, b) => {
          const aKnown = a.symbol ? 1 : 0;
          const bKnown = b.symbol ? 1 : 0;
          if (aKnown !== bKnown) return bKnown - aKnown;
          return BigInt(b.amount) > BigInt(a.amount) ? 1 : -1;
        });
        setBalances(sorted);
        setLastFetched(Date.now());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Balance fetch failed');
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }, [balanceAccount]);

  // Auto-fetch when account changes
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (balanceAccount) {
        fetch();
      } else {
        setBalances([]);
        setLastFetched(null);
        setError(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [balanceAccount, fetch]);

  return { balances, loading, error, lastFetched, refresh: fetch };
}
