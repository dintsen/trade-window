'use client';

import { Wallet, Plus, Send, Inbox } from 'lucide-react';
import { useWalletStore } from '@/lib/wallet/wallet-store';
import { Button } from '@/components/ui/button';

const COSMOS_CHAINS = [
  { id: 'cosmoshub-4', label: 'ATOM' },
  { id: 'atomone-1', label: 'ATONE' },
  { id: 'stargaze-1', label: 'STARS/NFT' },
];

export function SettlementWalletsPanel() {
  const { accounts, connect, adapters, isConnecting, activeProvider, selectedAccount } = useWalletStore();
  const keplr = adapters.find((adapter) => adapter.id === 'keplr');
  const cosmostation = adapters.find((adapter) => adapter.id === 'cosmostation');
  const adena = adapters.find((adapter) => adapter.id === 'adena');

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg border border-sky-500/20 bg-sky-500/10 flex items-center justify-center">
            <Wallet size={15} className="text-sky-300" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Settlement Wallets</h3>
            <p className="text-[11px] text-white/35">Add one wallet per network you send or receive on.</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-white/30">{accounts.length} linked</span>
      </div>

      {accounts.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {accounts.map((account) => {
            const selected = selectedAccount?.address === account.address && selectedAccount?.chainId === account.chainId;
            return (
              <div
                key={`${account.provider}-${account.chainId}-${account.address}`}
                className={`rounded-lg border px-3 py-2 ${selected ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-white/5 bg-black/20'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-white/70 truncate">{account.chainName ?? account.chainId}</p>
                    <p className="font-mono text-[10px] text-white/30 truncate">{account.address}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/25">
                    <Send size={11} />
                    <Inbox size={11} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {adena?.isAvailable() && (
          <Button
            onClick={() => connect('adena')}
            disabled={isConnecting}
            size="sm"
            className="w-full justify-start bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
          >
            <Plus size={13} />
            {isConnecting && activeProvider === 'adena' ? 'Connecting...' : 'Add Gno / Adena'}
          </Button>
        )}

        {keplr?.isAvailable() && (
          <div className="grid grid-cols-3 gap-1.5">
            {COSMOS_CHAINS.map((chain) => (
              <button
                key={`keplr-${chain.id}`}
                onClick={() => connect('keplr', chain.id)}
                disabled={isConnecting}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-medium text-white/55 hover:border-emerald-500/30 hover:text-white disabled:opacity-40"
              >
                + {chain.label}
              </button>
            ))}
          </div>
        )}

        {cosmostation?.isAvailable() && (
          <div className="grid grid-cols-2 gap-1.5">
            {COSMOS_CHAINS.slice(0, 2).map((chain) => (
              <button
                key={`cosmostation-${chain.id}`}
                onClick={() => connect('cosmostation', chain.id)}
                disabled={isConnecting}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-medium text-white/55 hover:border-emerald-500/30 hover:text-white disabled:opacity-40"
              >
                + Cosmostation {chain.label}
              </button>
            ))}
          </div>
        )}

        {!adena?.isAvailable() && !keplr?.isAvailable() && !cosmostation?.isAvailable() && (
          <p className="text-xs text-white/30 leading-relaxed">
            Install Adena, Keplr or Cosmostation to add live settlement wallets. Mock wallet remains demo-only.
          </p>
        )}
      </div>
    </div>
  );
}
