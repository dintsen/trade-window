'use client';

import { Coins, RefreshCw, Wallet } from 'lucide-react';
import { useConnectedWalletBalances } from '@/hooks/use-connected-wallet-balances';
import { useWalletStore } from '@/lib/wallet/wallet-store';

export function ConnectedWalletTokenSummary() {
  const { accounts } = useWalletStore();
  const { aggregates, loading, errors, lastFetched, refresh } = useConnectedWalletBalances();

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Coins size={15} className="text-emerald-300" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white truncate">All Connected Tokens</h3>
            <p className="text-[11px] text-white/35 truncate">
              {accounts.length} wallet{accounts.length !== 1 ? 's' : ''} · {aggregates.length} token denom{aggregates.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="w-8 h-8 rounded-md border border-white/10 bg-white/5 text-white/35 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors flex items-center justify-center"
          title="Refresh all connected wallet balances"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {lastFetched && (
        <p className="text-[10px] text-white/25 mb-3">Updated {new Date(lastFetched).toLocaleTimeString()}</p>
      )}

      {accounts.length === 0 ? (
        <p className="text-xs text-white/30 leading-relaxed">Connect wallets to see token totals across networks.</p>
      ) : loading && aggregates.length === 0 ? (
        <p className="text-xs text-white/35">Reading connected wallet balances...</p>
      ) : aggregates.length === 0 ? (
        <p className="text-xs text-white/30 leading-relaxed">
          No live token balances returned yet. Demo wallets do not have real on-chain balances.
        </p>
      ) : (
        <div className="space-y-2">
          {aggregates.slice(0, 8).map((token) => (
            <div key={token.key} className="rounded-lg border border-white/5 bg-black/25 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/75 truncate">{token.symbol ?? token.denom}</p>
                  <p className="font-mono text-[10px] text-white/30 truncate">{token.chainId} · {token.denom}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-xs text-emerald-300">{token.displayAmount}</p>
                  <p className="text-[10px] text-white/25">{token.walletCount} wallet{token.walletCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {token.sources.length > 1 && (
                <div className="mt-2 space-y-1 border-t border-white/5 pt-2">
                  {token.sources.slice(0, 3).map((source) => (
                    <div key={`${token.key}-${source.address}-${source.provider}`} className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="flex items-center gap-1 text-white/30 min-w-0">
                        <Wallet size={10} className="shrink-0" />
                        <span className="truncate">{source.label}</span>
                      </span>
                      <span className="font-mono text-white/35 shrink-0">{source.displayAmount}</span>
                    </div>
                  ))}
                  {token.sources.length > 3 && (
                    <p className="text-[10px] text-white/20">+{token.sources.length - 3} more wallets</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {aggregates.length > 8 && (
            <p className="text-[10px] text-white/25">+{aggregates.length - 8} more token denoms</p>
          )}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
          {errors.slice(0, 3).map((error) => (
            <p key={error} className="text-[11px] text-amber-300/80 leading-relaxed">{error}</p>
          ))}
          {errors.length > 3 && <p className="text-[10px] text-amber-300/50">+{errors.length - 3} more balance warnings</p>}
        </div>
      )}
    </div>
  );
}
