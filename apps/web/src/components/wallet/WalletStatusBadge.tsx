'use client';

import { useWalletStore } from '@/lib/wallet/wallet-store';
import { Badge } from '@/components/ui/badge';

export function WalletStatusBadge() {
  const { account } = useWalletStore();
  
  if (!account) {
    return <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-white/40">No Wallet</Badge>;
  }

  if (account.provider === 'mock') {
    return <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/20 text-amber-400">Mock Demo</Badge>;
  }

  if (account.provider === 'adena') {
    return <Badge variant="outline" className="text-xs bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Adena Connected</Badge>;
  }

  return (
    <Badge variant="outline" className="text-xs bg-sky-500/10 border-sky-500/20 text-sky-300">
      {account.providerLabel ?? account.provider} Connected
    </Badge>
  );
}
