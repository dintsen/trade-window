'use client';

import { useWalletStore } from '@/lib/wallet/wallet-store';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export function WalletConnectPanel() {
  const { account, connect, adapters, isConnecting, activeProvider } = useWalletStore();
  
  if (account) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-emerald-400">Connected</div>
          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{account.provider}</Badge>
        </div>
        <div className="font-mono text-sm text-white">{account.address}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Active Section */}
      <div>
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-1 border-l-2 border-emerald-500 pl-2">Active</h3>
        <div className="w-full flex flex-col items-start p-4 rounded-xl border border-white/10 bg-white/5 transition-all relative overflow-hidden">
          <div className="flex justify-between items-start w-full mb-2">
            <div className="flex items-center gap-2">
              <User className="text-emerald-400" size={16} />
              <span className="font-medium text-white">Mock Wallet (Demo)</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2 w-full">
            <Button onClick={() => connect("mock", "A")} size="sm" className="flex-1 bg-white/10 hover:bg-emerald-500/20 text-white/80 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30">User A</Button>
            <Button onClick={() => connect("mock", "B")} size="sm" className="flex-1 bg-white/10 hover:bg-emerald-500/20 text-white/80 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30">User B</Button>
          </div>
        </div>
      </div>

      {/* Gno.land priority */}
      <div>
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-1 border-l-2 border-emerald-500 pl-2">Gno.land priority</h3>
        {(() => {
          const adena = adapters.find(a => a.id === "adena");
          const isAvailable = adena?.isAvailable();
          return (
            <div className="w-full flex flex-col items-start p-4 rounded-xl border border-white/5 bg-black/20 transition-all relative overflow-hidden group hover:border-white/10">
              <div className="flex justify-between items-start w-full mb-2">
                <div className="flex items-center gap-2">
                  <Image src="/assets/wallets/adena.svg" alt="Adena" width={16} height={16} className="w-4 h-4 rounded-full bg-white/10 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <span className="font-medium text-white/80">Adena Wallet</span>
                </div>
                {isAvailable ? (
                  <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">Detected</Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] border-rose-500/30 text-rose-400 bg-rose-500/10">Not detected</Badge>
                )}
              </div>
              <p className="text-[10px] text-white/40 mb-3 leading-relaxed">
                {isAvailable 
                  ? "Adena detected. Read-only prototype available / planned."
                  : "Adena not detected. Mock Wallet remains active for the demo."}
              </p>
              <Button 
                onClick={() => connect("adena")} 
                disabled={!isAvailable || isConnecting} 
                size="sm" 
                className="w-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 disabled:opacity-50"
              >
                {isConnecting && activeProvider === "adena" ? "Connecting..." : "Connect (Read-only)"}
              </Button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
