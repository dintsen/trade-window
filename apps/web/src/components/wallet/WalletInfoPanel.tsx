'use client';

import { useState } from 'react';
import { Copy, ExternalLink, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import { useWalletBalances } from '@/hooks/use-wallet-balances';
import { useWalletStore } from '@/lib/wallet/wallet-store';
import { formatBaseAmount } from '@/lib/wallet/balances';

const SUPPORT_LABELS = {
  live: 'Live',
  preview: 'Preview',
  planned: 'Planned',
  disabled: 'Disabled',
} as const;

const SUPPORT_STYLES = {
  live: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  preview: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  planned: 'border-white/10 bg-white/5 text-white/40',
  disabled: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
} as const;

function shortKey(value?: string) {
  if (!value) return null;
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

export function WalletInfoPanel() {
  const { account, selectedAccount, activeProvider } = useWalletStore();
  const { balances, loading, error, lastFetched, refresh } = useWalletBalances();
  const [copied, setCopied] = useState(false);

  const visibleAccount = selectedAccount ?? account;

  if (!visibleAccount) return null;

  const support = visibleAccount.supportLevel ?? (visibleAccount.isMock ? 'live' : 'preview');
  const providerLabel = visibleAccount.providerLabel ?? activeProvider ?? visibleAccount.provider;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(visibleAccount.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Wallet size={15} className="text-emerald-300" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white truncate">Wallet Details</h3>
            <p className="text-[11px] text-white/35 truncate">{providerLabel}</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-1 rounded-md border ${SUPPORT_STYLES[support]}`}>
          {SUPPORT_LABELS[support]}
        </span>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-white/5 bg-black/30 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/25 mb-1">Address</p>
              <p className="font-mono text-[11px] text-white/70 break-all">{visibleAccount.address}</p>
            </div>
            <button
              onClick={copyAddress}
              className="w-7 h-7 rounded-md border border-white/10 bg-white/5 text-white/35 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors shrink-0 flex items-center justify-center"
              title="Copy wallet address"
            >
              {copied ? <ShieldCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/5 bg-black/20 p-3 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/25 mb-1">Network</p>
            <p className="text-xs text-white/70 truncate">{visibleAccount.chainName ?? visibleAccount.chainId ?? 'Unknown'}</p>
            {visibleAccount.chainId && <p className="font-mono text-[10px] text-white/30 truncate mt-0.5">{visibleAccount.chainId}</p>}
          </div>
          <div className="rounded-lg border border-white/5 bg-black/20 p-3 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/25 mb-1">Provider</p>
            <p className="text-xs text-white/70 truncate">{providerLabel}</p>
            <p className="font-mono text-[10px] text-white/30 truncate mt-0.5">{visibleAccount.ecosystem ?? 'unknown'}</p>
          </div>
        </div>

        {visibleAccount.publicKeyHex && (
          <div className="rounded-lg border border-white/5 bg-black/20 p-3 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/25 mb-1">Public Key</p>
            <p className="font-mono text-[11px] text-white/55 truncate" title={visibleAccount.publicKeyHex}>
              {shortKey(visibleAccount.publicKeyHex)}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-white/5 bg-black/20 p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/25">Balances</p>
              {lastFetched && (
                <p className="text-[10px] text-white/25 mt-0.5">{new Date(lastFetched).toLocaleTimeString()}</p>
              )}
            </div>
            <button
              onClick={refresh}
              className="w-7 h-7 rounded-md border border-white/10 bg-white/5 text-white/35 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors flex items-center justify-center"
              title="Refresh balances"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <p className="text-xs text-white/35">Reading balances...</p>
          ) : error ? (
            <p className="text-xs text-amber-300/80 leading-relaxed">{error}</p>
          ) : balances.length === 0 ? (
            <p className="text-xs text-white/30">No live balances returned for this address.</p>
          ) : (
            <div className="space-y-1.5">
              {balances.slice(0, 6).map((balance) => {
                const decimals = balance.decimals ?? 6;
                return (
                  <div key={`${balance.chainId}-${balance.denom}`} className="flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="text-white/70 truncate">{balance.symbol ?? balance.denom}</p>
                      <p className="font-mono text-[10px] text-white/25 truncate">{balance.denom}</p>
                    </div>
                    <p className="font-mono text-white/45 shrink-0">
                      {formatBaseAmount(balance.amount, decimals)}
                    </p>
                  </div>
                );
              })}
              {balances.length > 6 && (
                <p className="text-[10px] text-white/25">+{balances.length - 6} more denoms</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className={`text-[11px] leading-relaxed ${visibleAccount.isMock ? 'text-amber-300/80' : 'text-white/35'}`}>
            {visibleAccount.isMock ? 'Demo wallet: no real chain account.' : 'Read-only wallet view. Settlement remains behind explicit flags.'}
          </p>
          {visibleAccount.explorerAddressUrl && (
            <a
              href={visibleAccount.explorerAddressUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-md border border-white/10 bg-white/5 text-white/35 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors shrink-0 flex items-center justify-center"
              title="Open wallet in explorer"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
