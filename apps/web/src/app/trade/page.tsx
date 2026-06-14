'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTradeRoom } from '@/hooks/use-trade-room';
import { TradeAsset, DEMO_ASSETS } from '@/lib/trade/assets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Info, AlertTriangle, RefreshCw, Copy, CheckCircle2, XCircle, Hexagon, User, Globe, Send, Terminal, Lock, LinkIcon, ImageIcon, ArrowLeftRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useWalletStore } from '@/lib/wallet/wallet-store';
import { buildRoomCommitmentPayload } from '@/lib/gno/commitment-call';
import { GnoTransactionPreview } from '@/components/trade/GnoTransactionPreview';
import { GnoTestnetTransfer } from '@/components/trade/GnoTestnetTransfer';
import { signAndBroadcast } from '@/lib/wallet/signing';
import { toast, updateToast } from '@/hooks/use-toasts';
import { useWalletBalances } from '@/hooks/use-wallet-balances';
import { WalletBalance } from '@/lib/wallet/types';
import { getAsset } from '@/lib/assets/asset-registry';
import { formatBaseAmount } from '@/lib/wallet/balances';

// ── Live balance → TradeAsset ─────────────────────────────────────────────────
const CHAIN_DISPLAY: Record<string, string> = {
  'cosmoshub-4': 'Cosmos Hub',
  'stargaze-1': 'Stargaze',
  'atomone-1': 'AtomOne',
  'gno-testnet': 'Gno.land',
};

function walletBalancesToTradeAssets(balances: WalletBalance[]): TradeAsset[] {
  return balances.map((b, i) => {
    const reg = getAsset(b.denom);
    const human = formatBaseAmount(b.amount, b.decimals ?? reg?.decimals ?? 6);
    const regStatus = reg?.verificationStatus;
    // 'demo' in registry means it's a known testnet token — show as verified
    const status: TradeAsset['verificationStatus'] =
      regStatus === 'verified' || regStatus === 'demo' ? 'verified' :
      regStatus === 'suspicious' ? 'suspicious' :
      regStatus === 'unverified' ? 'unverified' : 'unknown';

    return {
      id: `live-${i}-${b.denom}`,
      type: 'coin' as const,
      chainId: b.chainId,
      sourceChain: CHAIN_DISPLAY[b.chainId] ?? b.chainId,
      displayDenom: reg?.displayDenom ?? b.symbol ?? b.denom.toUpperCase(),
      baseDenom: b.denom,
      technicalDenom: b.denom,
      amount: human,   // used as placeholder; user types actual qty
      decimals: b.decimals ?? reg?.decimals ?? 6,
      ibcTrace: '',
      verificationStatus: status,
      verificationReason: reg
        ? `Known token — ${reg.name}`
        : 'Unknown denom — verify carefully before trading',
      metadata: '{}',
    };
  });
}

function TradeRoomWrapperInner() {
  const { account, connect, disconnect, adapters, isConnecting, activeProvider, error } = useWalletStore();
  
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* Top Navigation */}
      <header className="w-full h-14 flex justify-between items-center px-6 border-b border-[#1c1c1c] bg-[#0a0a0a] z-50">
        <div className="flex items-center gap-3">
          {/* Back to home */}
          <Link href="/" className="text-white/30 hover:text-white/60 transition-colors p-1">
            <ChevronLeft size={16} />
          </Link>
          <div className="w-px h-4 bg-[#1c1c1c]" />
          {/* Product name */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <ArrowLeftRight size={11} className="text-sky-400" />
            </div>
            <span className="text-sm font-semibold text-white/80">OTC Trading</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/board/new" className="px-3.5 py-1.5 rounded-md border border-[#2b2b2b] text-white/60 hover:bg-white/[0.04] hover:text-white/80 transition-colors text-xs font-medium">
              Post OTC Listing
            </Link>
            <Link href="/request" className="px-3.5 py-1.5 rounded-md border border-[#3ECF8E]/25 text-[#3ECF8E]/80 hover:bg-[#3ECF8E]/8 transition-colors text-xs font-medium">
              Request OTC Deal
            </Link>
          </div>
          {account ? (
            <div className="flex items-center gap-2.5 bg-[#111111] border border-[#1c1c1c] rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
              <span className="text-[#3ECF8E] text-xs font-medium">{account.displayAddress}</span>
              <div className="w-px h-3 bg-[#2b2b2b]" />
              <button onClick={() => disconnect()} className="text-white/30 hover:text-white/60 transition-colors"><XCircle size={13}/></button>
            </div>
          ) : (
            <span className="text-white/30 text-xs font-mono">No wallet</span>
          )}
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 flex overflow-hidden">
        {!account ? (
          <div className="w-full h-full flex items-center justify-center p-6 relative overflow-y-auto">
            {/* Supabase-style subtle bg glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#3ECF8E]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[420px] py-10">

              {/* Header */}
              <div className="mb-8 text-center">
                <p className="text-[10px] font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-5">Trade Window · MVP</p>
                <h1 className="text-xl font-semibold text-white tracking-tight mb-2">Connect wallet</h1>
                <p className="text-sm text-white/40 leading-relaxed">
                  Choose a wallet to enter the OTC trade room.
                </p>
              </div>

              {/* Mock Wallet */}
              <div className="bg-[#111111] border border-[#1c1c1c] rounded-xl p-4 mb-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center shrink-0">
                    <User size={20} className="text-[#3ECF8E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white">Mock Wallet</span>
                    <div className="mt-0.5"><span className="text-xs text-white/40">No real assets — prototype only</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => connect("mock", "A")}
                    className="py-2.5 rounded-lg bg-[#0a0a0a] border border-[#2b2b2b] text-sm font-medium text-white/70 hover:border-[#3ECF8E]/40 hover:text-white transition-all"
                  >
                    User A
                  </button>
                  <button
                    onClick={() => connect("mock", "B")}
                    className="py-2.5 rounded-lg bg-[#0a0a0a] border border-[#2b2b2b] text-sm font-medium text-white/70 hover:border-[#3ECF8E]/40 hover:text-white transition-all"
                  >
                    User B
                  </button>
                </div>
              </div>

              {/* Section label */}
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] mb-2 px-1">Real Wallets</p>

              {/* Real wallets list — compact single-row */}
              <div className="flex flex-col gap-1.5">

                {/* Wallet row helper styles shared across all three */}
                {/* Adena */}
                {(() => {
                  const adena = adapters.find(a => a.id === "adena");
                  const isAvailable = adena?.isAvailable();
                  return (
                    <div className="flex items-center gap-3 bg-[#111111] border border-[#1c1c1c] hover:border-[#2b2b2b] rounded-lg px-3.5 py-3 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/wallets/adena.svg" alt="Adena" width={24} height={24} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white leading-none mb-0.5">Adena</div>
                        <div className="text-[11px] text-white/35">Gno.land</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none ${isAvailable ? 'text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/20' : 'text-white/25 border-[#1c1c1c]'}`}>
                          {isAvailable ? 'Detected' : 'Not found'}
                        </span>
                        <button
                          onClick={() => connect("adena")}
                          disabled={!isAvailable || isConnecting}
                          className={`text-[11px] font-medium px-3 py-1.5 rounded-md border transition-all ${isAvailable ? 'border-[#2b2b2b] bg-[#1a1a1a] text-white/60 hover:text-white hover:border-[#3ECF8E]/30' : 'border-[#1c1c1c] text-white/20 cursor-not-allowed'}`}
                        >
                          {isConnecting && activeProvider === "adena" ? "…" : isAvailable ? "Connect" : "Install"}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Keplr */}
                {(() => {
                  const adapter = adapters.find(a => a.id === "keplr");
                  if (!adapter) return null;
                  const available = adapter.isAvailable();
                  const chains = [
                    { id: 'cosmoshub-4', label: 'Cosmos' },
                    { id: 'atomone-1', label: 'AtomOne' },
                    { id: 'stargaze-1', label: 'Stargaze' },
                  ];
                  return (
                    <div className="bg-[#111111] border border-[#1c1c1c] hover:border-[#2b2b2b] rounded-lg px-3.5 py-3 transition-colors">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/wallets/keplr.svg" alt="Keplr" width={24} height={24} className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white leading-none mb-0.5">Keplr</div>
                          <div className="text-[11px] text-white/35">Cosmos · AtomOne · Stargaze</div>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none ${available ? 'text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/20' : 'text-white/25 border-[#1c1c1c]'}`}>
                          {available ? 'Detected' : 'Not found'}
                        </span>
                      </div>
                      {available ? (
                        <div className="flex gap-1.5">
                          {chains.map(c => (
                            <button
                              key={c.id}
                              onClick={() => connect("keplr", c.id)}
                              disabled={isConnecting}
                              className="flex-1 text-[10px] font-medium py-1.5 rounded-md border border-[#2b2b2b] bg-[#0a0a0a] text-white/50 hover:text-white hover:border-[#3ECF8E]/30 transition-all disabled:opacity-40"
                            >
                              {isConnecting && activeProvider === "keplr" ? "…" : c.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <a href="https://www.keplr.app/download" target="_blank" rel="noopener noreferrer"
                          className="block w-full text-center text-[11px] font-medium py-1.5 rounded-md border border-[#1c1c1c] text-white/20">
                          Install Keplr →
                        </a>
                      )}
                    </div>
                  );
                })()}

                {/* Cosmostation */}
                {(() => {
                  const adapter = adapters.find(a => a.id === "cosmostation");
                  if (!adapter) return null;
                  const available = adapter.isAvailable();
                  const chains = [
                    { id: 'cosmoshub-4', label: 'Cosmos' },
                    { id: 'atomone-1', label: 'AtomOne' },
                  ];
                  return (
                    <div className="bg-[#111111] border border-[#1c1c1c] hover:border-[#2b2b2b] rounded-lg px-3.5 py-3 transition-colors">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/assets/wallets/cosmostation.png" alt="Cosmostation" width={24} height={24} className="object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white leading-none mb-0.5">Cosmostation</div>
                          <div className="text-[11px] text-white/35">Cosmos · AtomOne</div>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none ${available ? 'text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/20' : 'text-white/25 border-[#1c1c1c]'}`}>
                          {available ? 'Detected' : 'Not found'}
                        </span>
                      </div>
                      {available ? (
                        <div className="flex gap-1.5">
                          {chains.map(c => (
                            <button
                              key={c.id}
                              onClick={() => connect("cosmostation", c.id)}
                              disabled={isConnecting}
                              className="flex-1 text-[10px] font-medium py-1.5 rounded-md border border-[#2b2b2b] bg-[#0a0a0a] text-white/50 hover:text-white hover:border-[#3ECF8E]/30 transition-all disabled:opacity-40"
                            >
                              {isConnecting && activeProvider === "cosmostation" ? "…" : c.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <a href="https://www.cosmostation.io/wallet" target="_blank" rel="noopener noreferrer"
                          className="block w-full text-center text-[11px] font-medium py-1.5 rounded-md border border-[#1c1c1c] text-white/20">
                          Install Cosmostation →
                        </a>
                      )}
                    </div>
                  );
                })()}

              </div>

              {error && (
                <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center leading-relaxed">
                  {error}
                </div>
              )}

              <p className="mt-5 text-center text-[10px] text-white/20 font-mono">
                MVP prototype — AtomOne / Gno.land · Trust-based P2P settlement
              </p>
            </div>
          </div>
        ) : (
          <TradeRoom walletAddress={account.address} />
        )}
      </main>
    </div>
  );
}

export default function TradeRoomWrapper() {
  return (
    <Suspense>
      <TradeRoomWrapperInner />
    </Suspense>
  );
}

function TradeRoom({ walletAddress }: { walletAddress: string }) {
  const { connected, isOfflineMode, roomData, logs, countdown, intentHash, error, actions } = useTradeRoom(walletAddress);
  const [joinId, setJoinId] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const { account } = useWalletStore();
  const [activeTab, setActiveTab] = useState<'setup'|'assets'|'chat'|'logs'|'transfer'>('setup');
  const [forceOfflineView, setForceOfflineView] = useState(false);
  const [assetQuantities, setAssetQuantities] = useState<Record<string, string>>({});
  const [starsAddress, setStarsAddress] = useState('');
  const [nfts, setNfts] = useState<StargazeNFT[]>([]);
  const [nftLoading, setNftLoading] = useState(false);
  const [nftError, setNftError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signedTxHash, setSignedTxHash] = useState<string | null>(null);
  const { balances, loading: balancesLoading, refresh: refreshBalances } = useWalletBalances();

  // Decide which asset list to show in the picker:
  // – Real wallet (Keplr/Adena): live balances from chain
  // – Mock wallet: DEMO_ASSETS with explicit label
  const isRealWallet = account && !account.isMock;
  const liveTradeAssets = isRealWallet && balances.length > 0
    ? walletBalancesToTradeAssets(balances)
    : null;
  const assetsToShow: TradeAsset[] = liveTradeAssets ?? DEMO_ASSETS;
  const searchParams = useSearchParams();

  // Auto-join room from URL ?room=<id> when connected
  useEffect(() => {
    const roomParam = searchParams?.get('room');
    if (roomParam && connected && !roomData) {
      actions.joinRoom(roomParam);
    }
  }, [connected, searchParams, roomData, actions]);

  const inviteLink = roomData?.id
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://tradewindow.xyz'}/trade?room=${roomData.id}`
    : null;

  const copyInviteLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const isPartyA = roomData?.partyA === walletAddress;
  const isPartyB = roomData?.partyB === walletAddress;
  
  const myAssets = (isPartyA ? roomData?.offerA : (isPartyB ? roomData?.offerB : [])) || [];
  const theirAssets = (isPartyA ? roomData?.offerB : (isPartyB ? roomData?.offerA : [])) || [];
  
  const myLock = isPartyA ? roomData?.lockA : roomData?.lockB;
  const theirLock = isPartyA ? roomData?.lockB : roomData?.lockA;

  const copyRoomId = () => {
    if (roomData?.id) {
      navigator.clipboard.writeText(roomData.id);
    }
  };

  const ASSET_LOGOS: Record<string, string> = {
    ATONE: '/assets/logos/atomone.svg',
    GNOT: '/assets/logos/gnot-icon.svg',
    PHOTON: '/assets/logos/photon.svg',
    ATOM: '/assets/logos/cosmos.svg',
    USDC: '/assets/logos/usdc.svg',
  };

  const getAssetLogo = (denom: string): string | null => ASSET_LOGOS[denom.toUpperCase()] ?? null;

  const shareViaTelegram = (link: string) => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join my Trade Window room')}`, '_blank');
  };

  const getStatusDisplay = () => {
    if (isOfflineMode) return { text: "Offline Demo Mode", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (!connected) return { text: "Backend Disconnected", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    if (!roomData) return { text: "No Room", color: "text-white/40 bg-white/5 border-white/10" };
    switch (roomData.state) {
      case 'lobby': return { text: "Waiting for Counterparty", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      case 'active': return { text: "Editing Offers", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      case 'locked_countdown': return { text: "Countdown Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case 'ready_to_sign': return { text: "Ready to Sign", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case 'cancelled': return { text: "Cancelled", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
      case 'completed': return { text: "Completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case 'expired': return { text: "Expired", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
      default: return { text: roomData.state, color: "text-white/60 bg-white/10 border-white/20" };
    }
  };

  const status = getStatusDisplay();

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    actions.sendMessage(chatMsg);
    setChatMsg('');
  };

  /**
   * Cross-network validation: check if any asset the user is sending
   * belongs to a chain different from the connected wallet's chain.
   */
  const getCrossNetworkWarnings = (): string[] => {
    if (!account || !myAssets.length) return [];
    const warnings: string[] = [];
    myAssets.forEach((asset) => {
      if (asset.chainId && account.chainId && asset.chainId !== account.chainId) {
        warnings.push(
          `Asset "${asset.displayDenom}" is on ${asset.chainId} but your wallet is on ${account.chainId}.`
        );
      }
    });
    return warnings;
  };

  const handleSignAndSettle = async () => {
    if (!account) return;
    const crossNetworkWarnings = getCrossNetworkWarnings();
    if (crossNetworkWarnings.length > 0) {
      toast({
        type: 'warning',
        title: 'Cross-Network Warning',
        message: crossNetworkWarnings[0],
        duration: 8000,
      });
      return;
    }

    // For MVP demo: sign the first coin asset the user is offering
    const coinAsset = myAssets.find((a) => a.type === 'coin' && a.amount);
    if (!coinAsset) {
      toast({ type: 'info', title: 'Nothing to sign', message: 'Add a token asset to your offer first.' });
      return;
    }

    // Counterparty address (the other party in the room)
    const toAddress = isPartyA ? roomData?.partyB : roomData?.partyA;
    if (!toAddress) {
      toast({ type: 'error', title: 'No counterparty', message: 'Counterparty address not found.' });
      return;
    }

    setIsSigning(true);
    const pendingId = toast({
      type: 'pending',
      title: 'Signing transaction…',
      message: `Sending ${coinAsset.amount} ${coinAsset.displayDenom} to ${toAddress.slice(0, 10)}…`,
    });

    try {
      const result = await signAndBroadcast({
        account,
        toAddress,
        denom: coinAsset.baseDenom,
        amount: coinAsset.amount ?? '0',
        memo: `Trade Window · Room ${roomData?.id ?? ''}`,
      });

      updateToast(pendingId, {
        type: 'success',
        title: 'Transaction submitted!',
        message: 'Your assets are on their way.',
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
        duration: 0,
      });
      setSignedTxHash(result.txHash);
    } catch (err) {
      updateToast(pendingId, {
        type: 'error',
        title: 'Transaction failed',
        message: err instanceof Error ? err.message : 'Unknown error',
        duration: 8000,
      });
    } finally {
      setIsSigning(false);
    }
  };

  if (isOfflineMode && !forceOfflineView) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#030303] overflow-y-auto">
        <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-amber-400" size={28} />
            <h2 className="text-2xl font-medium text-white">Backend demo server is not connected.</h2>
          </div>
          
          <p className="text-white/60 mb-8 leading-relaxed">
            This public Vercel preview can show the interface, but live two-window room sync requires the Go WebSocket backend.
          </p>
          
          <div className="bg-black border border-white/5 rounded-xl p-6 mb-8 font-mono text-xs text-emerald-400 overflow-x-auto">
            <div className="text-white/40 mb-2"># Run locally:</div>
            <div className="text-white/40 mb-1">Terminal 1:</div>
            <div>export PATH=&quot;$HOME/.local/go/bin:$PATH&quot;</div>
            <div>cd services/backend-go</div>
            <div className="mb-4">go run cmd/server/main.go</div>
            
            <div className="text-white/40 mb-1">Terminal 2:</div>
            <div>cd apps/web</div>
            <div>npm run dev</div>
          </div>
          
          <Button 
            onClick={() => setForceOfflineView(true)}
            className="w-full py-6 text-base bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            Continue in offline visual demo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
      
      {/* Center: Main Trade Window */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto relative bg-[#030303]">
        
        {/* Room Header Info */}
        <div className="flex items-center justify-between mb-8 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-md border text-xs font-medium ${status.color}`}>
              {status.text}
            </div>
            {roomData?.id && (
              <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded-md px-3 py-1">
                <span className="text-white/40 text-xs font-mono">Room:</span>
                <span className="text-emerald-400 text-xs font-mono">{roomData.id}</span>
                <button onClick={copyRoomId} className="text-white/40 hover:text-white transition-colors" title="Copy Room ID"><Copy size={12}/></button>
              </div>
            )}
          </div>
          
          <div className="text-xs text-white/40">
            {error ? <span className="text-amber-400 flex items-center gap-1"><AlertTriangle size={14}/> {error}</span> : 
             !connected ? "Connecting to backend..." : "Backend State Verified"}
          </div>
        </div>

        {/* Trade Boards */}
        {!roomData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <Hexagon size={48} className="text-white/20 mb-4" />
            <h2 className="text-xl font-medium text-white mb-2">Step 2 — Create or join room</h2>
            <p className="text-white/50 text-sm max-w-sm">Use the Setup panel on the right to create a new room or join an existing one using a Room ID.</p>
          </div>
        ) : roomData.state === 'lobby' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 animate-pulse">
              <RefreshCw className="text-emerald-400 animate-spin" size={24} style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-2xl font-medium text-white mb-3">Waiting for counterparty…</h2>
            <p className="text-white/50 text-sm mb-8 max-w-md">
              Room created. Share this invite link with your trading partner — they open it and land directly in this room.
            </p>

            {/* Invite link — primary CTA */}
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-emerald-500/20 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon size={14} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Invite Link</span>
              </div>
              <div className="flex items-center gap-3 bg-black/50 border border-white/5 rounded-xl px-4 py-3 mb-3">
                <span className="text-sm font-mono text-white/70 flex-1 truncate">{inviteLink}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyInviteLink}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all"
                >
                  {linkCopied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                </button>
                <button
                  onClick={() => inviteLink && shareViaTelegram(inviteLink)}
                  title="Share via Telegram"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] font-semibold text-sm transition-all"
                >
                  {/* Telegram paper-plane */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  <span className="hidden sm:inline">Telegram</span>
                </button>
              </div>
            </div>

            {/* Room ID fallback */}
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span>Room ID:</span>
              <span className="font-mono text-white/50">{roomData.id}</span>
              <button onClick={copyRoomId} className="text-white/30 hover:text-white/60 transition-colors" title="Copy Room ID"><Copy size={11}/></button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 h-full">
            <div className="text-left w-full px-1 mb-[-12px]">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Step 3 — Add assets and lock trade</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
              
              {/* My Offer */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden">
                {myLock && <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-2xl pointer-events-none"></div>}
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/80 font-medium flex items-center gap-2"><User size={16}/> My Offer</span>
                  {myLock ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1"><Lock size={12}/> Locked</Badge>
                  ) : (
                    <Badge variant="outline" className="text-white/40 border-white/10">Editing</Badge>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
                  {myAssets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 text-sm italic">
                      No assets added. Use Asset Picker to build your offer.
                    </div>
                  ) : (
                    myAssets.map((asset, i) => <AssetCard key={i} asset={asset} />)
                  )}
                </div>
                
                <Button 
                  onClick={actions.lockTrade} 
                  disabled={myLock || roomData.state !== 'active' || myAssets.length === 0}
                  className="w-full bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-white border border-white/10 hover:border-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {myLock ? "Waiting for Counterparty" : "Lock Offer"}
                </Button>
              </div>

              {/* Counterparty Offer */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden">
                {theirLock && <div className="absolute inset-0 border-2 border-emerald-500/40 rounded-2xl pointer-events-none"></div>}
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/80 font-medium flex items-center gap-2"><Globe size={16}/> Counterparty Offer</span>
                  {theirLock ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1"><Lock size={12}/> Locked</Badge>
                  ) : (
                    <Badge variant="outline" className="text-white/40 border-white/10">Editing</Badge>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
                  {theirAssets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 text-sm italic">
                      Counterparty is building their offer.
                    </div>
                  ) : (
                    theirAssets.map((asset, i) => <AssetCard key={i} asset={asset} />)
                  )}
                </div>
                
                <div className="w-full py-2 text-center text-xs text-white/30 border-t border-white/5">
                  Always inspect technical denoms carefully.
                </div>
              </div>

            </div>

            {/* Final State / Countdown Area */}
            {roomData.state === 'locked_countdown' && (
              <div className="bg-black border border-emerald-500/30 rounded-2xl p-8 text-center mt-auto">
                <div className="text-5xl font-mono text-emerald-400 mb-4">{countdown}</div>
                <div className="text-white/60">Both parties locked. Final review countdown.</div>
                <Button onClick={actions.cancelTrade} variant="destructive" className="mt-4 bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30">Cancel Trade</Button>
              </div>
            )}

            {roomData.state === 'ready_to_sign' && (
              <div className="bg-[#0a0a0a] border border-[#1c1c1c] shadow-2xl rounded-2xl p-6 mt-auto flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#3ECF8E]/4 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-3 z-10">
                  <div className="w-10 h-10 rounded-lg bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center text-[#3ECF8E]">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Ready to Sign & Settle</h3>
                    <p className="text-xs text-white/40">Both sides locked. Review the intent hash, then sign your side.</p>
                  </div>
                </div>

                {/* Intent hash */}
                <div className="z-10 bg-[#030303] border border-[#3ECF8E]/20 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em] mb-1">Intent Hash</p>
                  <div className="font-mono text-[#3ECF8E] break-all text-xs font-medium tracking-wide">{intentHash}</div>
                </div>

                {/* Cross-network warnings */}
                {getCrossNetworkWarnings().map((w, i) => (
                  <div key={i} className="z-10 flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
                    <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300/80 leading-relaxed">{w}</p>
                  </div>
                ))}

                {/* Success state */}
                {signedTxHash ? (
                  <div className="z-10 flex items-center gap-2.5 bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-xl px-4 py-3">
                    <CheckCircle2 size={14} className="text-[#3ECF8E] shrink-0" />
                    <div>
                      <p className="text-xs text-[#3ECF8E] font-semibold">Transaction submitted</p>
                      <p className="text-[10px] font-mono text-white/30 mt-0.5 break-all">{signedTxHash}</p>
                    </div>
                  </div>
                ) : (
                  <div className="z-10 flex gap-3">
                    <Button
                      onClick={handleSignAndSettle}
                      disabled={isSigning || getCrossNetworkWarnings().length > 0}
                      className="flex-1 h-11 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg disabled:opacity-50 text-sm"
                    >
                      {isSigning ? 'Signing…' : 'Sign & Send My Assets'}
                    </Button>
                    <Button
                      onClick={actions.cancelTrade}
                      className="h-11 px-4 rounded-lg border border-[#2b2b2b] bg-transparent text-white/40 hover:text-white/70 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Gno commitment preview */}
                <div className="z-10 bg-[#111] border border-[#1c1c1c] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-medium text-white/50">Gno commitment call preview</h4>
                    <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/30">Preview only</Badge>
                  </div>
                  <GnoTransactionPreview
                    payload={buildRoomCommitmentPayload({
                      realmPath: "gno.land/r/tradewindow/rooms",
                      method: "CommitIntent",
                      args: [roomData.id, intentHash || "", roomData.partyA, roomData.partyB],
                      intentHash: intentHash || "",
                      roomId: roomData.id,
                      parties: [roomData.partyA, roomData.partyB]
                    }, walletAddress)}
                    disabledReason="Gno realm signing is not yet live. This preview shows the future smart contract call."
                    onSign={() => {}}
                  />
                </div>
              </div>
            )}
            
            {(roomData.state === 'cancelled' || roomData.state === 'expired') && (
              <div className="bg-[#0a0a0a] border border-rose-500/30 rounded-2xl p-8 text-center mt-auto">
                <XCircle size={48} className="text-rose-400 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Trade {roomData.state}</h3>
                <p className="text-white/40 mb-6">This room is no longer active.</p>
                <Link href="/" className="text-emerald-400 hover:underline">Return to Home</Link>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-l border-white/5 bg-[#0a0a0a] flex flex-col h-full">
        <div className="flex items-center border-b border-white/5 overflow-x-auto custom-scrollbar shrink-0">
          <button onClick={() => setActiveTab('setup')} className={`flex-1 py-4 px-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'setup' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Setup</button>
          <button onClick={() => setActiveTab('assets')} className={`flex-1 py-4 px-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'assets' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Assets</button>
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 px-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'chat' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Chat</button>
          <button onClick={() => setActiveTab('logs')} className={`flex-1 py-4 px-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'logs' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Logs</button>
          {account?.provider === 'adena' && (
             <button onClick={() => setActiveTab('transfer')} className={`flex-1 py-4 px-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'transfer' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Transfer</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-2">Create New Trade</h3>
                <p className="text-xs text-white/40 mb-4 leading-relaxed">Start a new P2P exchange room. You&apos;ll get a shareable invite link to send your counterparty.</p>
                <Button onClick={actions.createRoom} disabled={!!roomData} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold disabled:opacity-50">Create Room</Button>
                {inviteLink && (
                  <div className="mt-3 space-y-2">
                    <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1"><LinkIcon size={10}/> Share Invite</div>
                    <div className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 font-mono text-[10px] text-white/50 truncate">{inviteLink}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyInviteLink}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors"
                      >
                        {linkCopied ? <><CheckCircle2 size={12}/> Copied!</> : <><Copy size={12}/> Copy</>}
                      </button>
                      <button
                        onClick={() => shareViaTelegram(inviteLink)}
                        title="Share via Telegram"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] text-xs font-semibold transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                        TG
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <div className="text-xs text-white/30 uppercase font-medium">OR</div>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-2">Join Existing Trade</h3>
                <p className="text-xs text-white/40 mb-4 leading-relaxed">Paste the Room ID shared by your counterparty to join their trade.</p>
                <div className="flex flex-col gap-3">
                  <Input 
                    value={joinId} 
                    onChange={e => setJoinId(e.target.value)} 
                    placeholder="Room ID (e.g. room-1234)" 
                    disabled={!!roomData}
                    className="bg-black border-white/10 text-white text-sm"
                  />
                  <Button onClick={() => actions.joinRoom(joinId)} disabled={!!roomData || !joinId.trim()} className="w-full bg-white/10 hover:bg-white/20 text-white font-medium disabled:opacity-50">Join Room</Button>
                </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="flex flex-col gap-4">
              {/* Banner: real wallet vs demo mode */}
              {isRealWallet ? (
                <div className="flex items-center justify-between text-xs bg-[#0a0a0a] border border-white/5 p-3 rounded-lg">
                  <span className="text-white/50">
                    {balancesLoading
                      ? 'Fetching balances…'
                      : liveTradeAssets
                        ? `${liveTradeAssets.length} token${liveTradeAssets.length !== 1 ? 's' : ''} from your wallet`
                        : 'No balances found on this chain'}
                  </span>
                  <button
                    onClick={() => refreshBalances()}
                    className="text-white/30 hover:text-emerald-400 transition-colors"
                    title="Refresh balances"
                  >
                    <RefreshCw size={12} className={balancesLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg mb-2">
                  <strong>Demo mode:</strong> Assets are mocked. Connect Keplr or Adena to use real wallet balances.
                </div>
              )}

              {assetsToShow.length === 0 && isRealWallet && !balancesLoading && (
                <div className="text-xs text-white/30 text-center py-6 italic">
                  No tokens found. Make sure your wallet is connected to the right chain.
                </div>
              )}

              {assetsToShow.map((asset, i) => {
                const isSuspicious = asset.verificationStatus === 'suspicious';
                const isVerified = asset.verificationStatus === 'verified';
                const logo = getAssetLogo(asset.displayDenom);
                const qty = assetQuantities[asset.id] ?? '';
                return (
                  <div key={i} className={`bg-[#0a0a0a] border rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden shadow-inner ${isSuspicious ? 'border-rose-500/30' : 'border-white/5'}`}>
                    {isSuspicious && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 pl-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden relative p-1.5 shrink-0 ${isSuspicious ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/10'}`}>
                          {logo ? (
                            <Image src={logo} alt={asset.displayDenom} width={24} height={24} className="object-contain" />
                          ) : (
                            <span className="font-bold text-[10px] text-white/60">{asset.displayDenom.slice(0,3)}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-base font-bold text-white tracking-wide">{asset.displayDenom}</div>
                          <div className="text-[10px] text-white/40">{asset.sourceChain}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 mt-1">
                        {isVerified && <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Info size={10} /> Verified</span>}
                        {isSuspicious && <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium"><ShieldAlert size={10} /> Suspicious</div>}
                      </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded p-2 text-[9px] font-mono text-white/40 break-all">
                      {asset.technicalDenom}
                    </div>

                    {/* Quantity input */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder={`Enter amount (e.g. ${asset.amount})`}
                          value={qty}
                          onChange={e => setAssetQuantities(prev => ({ ...prev, [asset.id]: e.target.value }))}
                          disabled={!roomData || roomData.state !== 'active' || !!myLock}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 disabled:opacity-40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      <span className="text-xs text-white/40 font-mono shrink-0">{asset.displayDenom}</span>
                    </div>

                    <Button
                      onClick={() => {
                        const parsedQty = parseFloat(qty.trim());
                        if (!qty.trim() || isNaN(parsedQty) || parsedQty <= 0) return;
                        // Unique ID per add so duplicate offers of the same token are distinct
                        actions.addOffer({ ...asset, id: `${asset.id}-${Date.now()}`, amount: qty.trim() });
                        setAssetQuantities(prev => ({ ...prev, [asset.id]: '' }));
                      }}
                      disabled={!roomData || roomData.state !== 'active' || !!myLock || !qty.trim() || parseFloat(qty.trim()) <= 0}
                      size="sm"
                      className="w-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 disabled:opacity-30"
                    >
                      + Add to Offer
                    </Button>
                  </div>
                );
              })}

              {/* ── Stargaze NFTs ─────────────────────────────────────── */}
              <div className="mt-2 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon size={13} className="text-violet-400" />
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">NFTs via Stargaze</span>
                </div>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="stars1… address"
                    value={starsAddress}
                    onChange={e => setStarsAddress(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all font-mono"
                  />
                  <button
                    onClick={async () => {
                      const addr = starsAddress.trim();
                      if (!addr.startsWith('stars1')) { setNftError('Address must start with stars1'); return; }
                      setNftLoading(true); setNftError(null); setNfts([]);
                      try { setNfts(await fetchStargazeNFTs(addr)); }
                      catch (e) { setNftError(e instanceof Error ? e.message : 'Failed to load NFTs'); }
                      finally { setNftLoading(false); }
                    }}
                    disabled={nftLoading || !starsAddress.trim()}
                    className="px-3 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-semibold transition-colors disabled:opacity-40"
                  >
                    {nftLoading ? '…' : 'Load'}
                  </button>
                </div>

                {/* Sample NFTs — loads real Bad Kids from Stargaze IPFS */}
                <button
                  onClick={() => { setNftError(null); setNfts(SAMPLE_STARGAZE_NFTS); }}
                  className="w-full mb-3 py-1.5 rounded-lg border border-violet-500/15 text-violet-400/60 hover:border-violet-500/30 hover:text-violet-400 text-[10px] font-mono transition-colors"
                >
                  ↓ load sample NFTs from Stargaze
                </button>

                {nftError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 mb-3">
                    {nftError}
                  </div>
                )}

                {nfts.length === 0 && !nftLoading && !nftError && (
                  <div className="text-[11px] text-white/20 text-center py-4 italic">
                    Enter a Stargaze address or load sample NFTs.
                  </div>
                )}

                {nfts.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {nfts.map(nft => (
                      <div key={`${nft.collectionAddr}-${nft.tokenId}`} className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-violet-500/30 transition-colors group">
                        <div className="aspect-square bg-[#111] relative overflow-hidden">
                          {nft.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-white/10" />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <div className="text-[11px] font-semibold text-white truncate">{nft.name}</div>
                          <div className="text-[9px] text-white/30 truncate mb-2">{nft.collectionName}</div>
                          <button
                            onClick={() => {
                              const nftAsset: TradeAsset = {
                                id: `nft-${nft.collectionAddr}-${nft.tokenId}`,
                                type: 'nft',
                                chainId: 'stargaze-1',
                                sourceChain: 'Stargaze',
                                displayDenom: nft.name,
                                baseDenom: `${nft.collectionAddr}:${nft.tokenId}`,
                                technicalDenom: `nft:${nft.collectionAddr}:${nft.tokenId}`,
                                amount: '1',
                                decimals: 0,
                                ibcTrace: '',
                                verificationStatus: 'unverified',
                                verificationReason: 'NFT from Stargaze — verify collection contract before accepting',
                                metadata: JSON.stringify({ collectionAddr: nft.collectionAddr, tokenId: nft.tokenId, imageUrl: nft.imageUrl }),
                              };
                              actions.addOffer(nftAsset);
                            }}
                            disabled={!roomData || roomData.state !== 'active' || !!myLock}
                            className="w-full text-[10px] py-1 rounded-md bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-400 font-semibold transition-colors disabled:opacity-30"
                          >
                            + Add NFT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#111]/50 to-transparent pointer-events-none"></div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar z-10">
                {logs.filter(l => l.type === 'chat').length === 0 ? (
                  <div className="text-center text-white/30 text-xs mt-10 font-medium">No messages yet.</div>
                ) : (
                  logs.filter(l => l.type === 'chat').map((msg, i) => {
                    const isMe = msg.message.startsWith(walletAddress); // Hacky check since logs are raw strings
                    return (
                      <div key={i} className={`text-sm p-3.5 rounded-2xl max-w-[85%] shadow-sm leading-relaxed ${isMe ? 'bg-[#0a1e14] text-emerald-50 self-end border border-emerald-500/20 rounded-br-sm' : 'bg-[#151515] text-white/90 self-start border border-white/5 rounded-bl-sm'}`}>
                        {msg.message.split(':').slice(1).join(':').trim()}
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/5 bg-[#050505] flex gap-2 z-10">
                <Input 
                  value={chatMsg} 
                  onChange={e => setChatMsg(e.target.value)} 
                  placeholder="Type a message..." 
                  className="bg-[#111] border-white/10 text-sm py-5 rounded-lg focus-visible:ring-emerald-500/50"
                  disabled={!roomData}
                />
                <Button type="submit" size="icon" disabled={!roomData || !chatMsg.trim()} className="bg-emerald-500 hover:bg-emerald-400 text-black shrink-0 h-auto w-12 rounded-lg"><Send size={16}/></Button>
              </form>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="flex flex-col h-full bg-[#050505] border border-white/5 rounded-xl overflow-hidden shadow-inner">
              <div className="p-3 border-b border-white/5 bg-[#0a0a0a] flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span className="text-xs font-semibold text-white/60 tracking-wider uppercase">System Log</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 font-mono text-xs flex flex-col gap-3 custom-scrollbar">
                {logs.filter(l => l.type !== 'chat').map((log, i) => {
                  let colorClass = "text-white/60";
                  if (log.type === 'error') colorClass = "text-rose-400 font-medium";
                  else if (log.message.includes('locked') || log.message.includes('established') || log.message.includes('countdown') || log.message.includes('generated')) colorClass = "text-emerald-400";
                  else if (log.message.includes('reset')) colorClass = "text-amber-400";
                  return (
                    <div key={i} className={`${colorClass} break-words leading-relaxed`}>
                      <span className="opacity-30 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span> 
                      <span className="opacity-50 font-bold mr-1">{'>'}</span> {log.message}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transfer Tab */}
          {activeTab === 'transfer' && (
            <GnoTestnetTransfer />
          )}

        </div>
      </div>
    </div>
  );
}

// ── Stargaze NFT types & fetch ──────────────────────────────────────────────

/** Real Bad Kids NFTs from Stargaze mainnet (IPFS gateway confirmed). */
const BAD_KIDS_CONTRACT = 'stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420';
const IPFS_GW = 'https://ipfs.io/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/';

const SAMPLE_STARGAZE_NFTS: StargazeNFT[] = [
  { tokenId: '42',   name: 'Bad Kid #42',   imageUrl: IPFS_GW + '42.jpg',   collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '100',  name: 'Bad Kid #100',  imageUrl: IPFS_GW + '100.jpg',  collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '500',  name: 'Bad Kid #500',  imageUrl: IPFS_GW + '500.jpg',  collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '777',  name: 'Bad Kid #777',  imageUrl: IPFS_GW + '777.jpg',  collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '1000', name: 'Bad Kid #1000', imageUrl: IPFS_GW + '1000.jpg', collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '1234', name: 'Bad Kid #1234', imageUrl: IPFS_GW + '1234.jpg', collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '2048', name: 'Bad Kid #2048', imageUrl: IPFS_GW + '2048.jpg', collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '5000', name: 'Bad Kid #5000', imageUrl: IPFS_GW + '5000.jpg', collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
  { tokenId: '9000', name: 'Bad Kid #9000', imageUrl: IPFS_GW + '9000.jpg', collectionAddr: BAD_KIDS_CONTRACT, collectionName: 'Bad Kids' },
];

interface StargazeNFT {
  tokenId: string;
  name: string;
  imageUrl: string;
  collectionAddr: string;
  collectionName: string;
}

async function fetchStargazeNFTs(ownerAddr: string): Promise<StargazeNFT[]> {
  const query = `
    query NftsByOwner($ownerAddr: String!) {
      tokens(ownerAddr: $ownerAddr, limit: 24) {
        tokens {
          tokenId
          name
          imageUrl
          collection { contractAddress name }
        }
      }
    }
  `;
  const res = await fetch('https://graphql.mainnet.stargaze-apis.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { ownerAddr } }),
  });
  if (!res.ok) throw new Error(`Stargaze API error: ${res.status}`);
  const json = await res.json();
  const tokens = json?.data?.tokens?.tokens ?? [];
  return tokens.map((t: { tokenId: string; name: string; imageUrl: string; collection: { contractAddress: string; name: string } }) => ({
    tokenId: t.tokenId,
    name: t.name ?? `#${t.tokenId}`,
    imageUrl: t.imageUrl ?? '',
    collectionAddr: t.collection?.contractAddress ?? '',
    collectionName: t.collection?.name ?? 'Unknown Collection',
  }));
}

// ── Token logo map ───────────────────────────────────────────────────────────
const ASSET_LOGO_MAP: Record<string, string> = {
  ATONE: '/assets/logos/atomone.svg',
  GNOT: '/assets/logos/gnot-icon.svg',
  PHOTON: '/assets/logos/photon.svg',
  ATOM: '/assets/logos/cosmos.svg',
  USDC: '/assets/logos/usdc.svg',
};

function AssetCard({ asset }: { asset: TradeAsset }) {
  const isSuspicious = asset.verificationStatus === 'suspicious';
  const isVerified = asset.verificationStatus === 'verified';
  const logo = ASSET_LOGO_MAP[asset.displayDenom.toUpperCase()] ?? null;

  return (
    <div className={`p-4 rounded-xl border bg-[#0a0a0a] flex flex-col gap-2 group relative overflow-hidden shadow-inner ${isSuspicious ? 'border-rose-500/30' : 'border-white/10'}`}>
      {isSuspicious && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 pl-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden relative p-1.5 shrink-0 ${isSuspicious ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/10'}`}>
            {logo ? (
              <Image src={logo} alt={asset.displayDenom} width={24} height={24} className="object-contain" />
            ) : (
              <span className="font-bold text-[10px] text-white/60">{asset.displayDenom.slice(0,3)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-base font-bold text-white tracking-wide">
              {asset.amount} <span className="text-white/50 text-sm font-normal">{asset.displayDenom}</span>
            </div>
            <div className="text-[10px] text-white/30">{asset.sourceChain}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 mt-1">
          {isVerified && <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Info size={10} /> Verified</span>}
          {isSuspicious && <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium"><ShieldAlert size={10} /> Suspicious</div>}
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded p-2 text-[9px] font-mono text-white/40 break-all mt-1">
        {asset.technicalDenom}
      </div>
    </div>
  );
}
