'use client';

import { useState } from 'react';
import { useTradeRoom } from '@/hooks/use-trade-room';
import { TradeAsset, DEMO_ASSETS } from '@/lib/trade/assets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Info, AlertTriangle, RefreshCw, Copy, CheckCircle2, XCircle, Hexagon, User, Globe, Send, Terminal, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useWalletStore } from '@/lib/wallet/wallet-store';
import { buildCommitIntentCall } from '@/lib/gno/commitment-call';

export default function TradeRoomWrapper() {
  const { account, connect, disconnect, adapters, isConnecting, activeProvider } = useWalletStore();
  
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 flex flex-col">
      {/* Top Navigation */}
      <header className="w-full h-16 flex justify-between items-center px-6 border-b border-white/5 bg-[#0a0a0a] z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-trade.svg" alt="TradeWindow" width={120} height={24} className="object-contain" priority />
          </Link>
          <div className="w-px h-4 bg-white/10 mx-2"></div>
          <span className="text-sm font-medium text-white/80">Trade Window Demo</span>
          <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 border-emerald-500/30 bg-emerald-500/10 ml-2">Mocked MVP</Badge>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/board/new" className="px-4 py-1.5 rounded-full border border-white/10 text-white/80 hover:bg-white/5 transition-colors text-xs font-semibold">
              Post OTC Listing
            </Link>
            <Link href="/request" className="px-4 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-xs font-semibold">
              Request OTC Deal
            </Link>
          </div>
          {account ? (
            <div className="flex items-center gap-3 bg-black/50 border border-white/5 rounded-full px-4 py-1.5">
              <span className="text-emerald-400 flex items-center gap-1.5 text-xs"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div> Active: {account.displayAddress}</span>
              <div className="w-px h-3 bg-white/10"></div>
              <span className="text-white/40 font-mono text-xs">{account.address.slice(0, 10)}...</span>
              <button onClick={() => disconnect()} className="ml-2 text-white/40 hover:text-white transition-colors"><XCircle size={14}/></button>
            </div>
          ) : (
            <span className="text-white/40 text-xs">No wallet selected</span>
          )}
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 flex overflow-hidden">
        {!account ? (
          <div className="w-full h-full flex items-center justify-center p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 text-center shadow-2xl">
              <div className="mx-auto mb-6 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse"></div>
                <Hexagon className="text-emerald-400 animate-spin relative z-10" size={24} style={{ animationDuration: '4s' }} />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-4 text-white">
                OTC Trade Room for AtomOne & Gno.land
              </h1>
              
              <div className="text-white/50 text-sm mb-8 leading-relaxed font-light flex flex-col gap-2">
                <p>Current demo uses backend-authoritative mock rooms.</p>
                <p className="text-emerald-400/80 font-medium">The Gno.land protocol layer (Gno commitment layer) is currently in progress. Future finalized commitments are planned for Gno smart contracts.</p>
              </div>
              
              <div className="text-left w-full mb-3 px-1">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Step 1 — Choose wallet provider</span>
              </div>
              
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
                            <Image src="/assets/logos/adena.png" alt="Adena" width={16} height={16} className="w-4 h-4 rounded-full bg-white/10 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
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
                        <p className="text-[10px] text-emerald-400/80 mb-3 leading-relaxed border-l border-emerald-500/30 pl-2">
                          Adena is the first real wallet path for the Gno.land smart-contract layer. This phase only checks availability / read-only connection. Real signing and settlement are not implemented yet.
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

                {/* Later AtomOne */}
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-1 border-l-2 border-white/20 pl-2">Later AtomOne</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="w-full flex flex-col items-start p-3 rounded-xl border border-white/5 bg-transparent opacity-60 relative overflow-hidden">
                      <div className="flex justify-between items-start w-full">
                        <span className="text-sm font-medium text-white/60">Keplr</span>
                        <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 bg-white/5">Planned later</Badge>
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-start p-3 rounded-xl border border-white/5 bg-transparent opacity-60 relative overflow-hidden">
                      <div className="flex justify-between items-start w-full">
                        <span className="text-sm font-medium text-white/60">Cosmostation</span>
                        <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 bg-white/5">Planned later</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TradeRoom walletAddress={account.address} />
        )}
      </main>
    </div>
  );
}

function TradeRoom({ walletAddress }: { walletAddress: string }) {
  const { connected, isOfflineMode, roomData, logs, countdown, intentHash, error, actions } = useTradeRoom(walletAddress);
  const [joinId, setJoinId] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'setup'|'assets'|'chat'|'logs'>('setup');
  const [forceOfflineView, setForceOfflineView] = useState(false);

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

  if (isOfflineMode && !forceOfflineView) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#030303]">
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
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 animate-pulse">
              <RefreshCw className="text-emerald-400 animate-spin" size={24} style={{ animationDuration: '3s' }} />
            </div>
            <h2 className="text-2xl font-medium text-white mb-3">Waiting for counterparty...</h2>
            <p className="text-white/50 text-sm mb-6 max-w-md">
              Your room is ready. Open a second browser window, select the other User identity, and join using this Room ID:
            </p>
            <div className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
              <span className="text-xl font-mono text-emerald-400">{roomData.id}</span>
              <button onClick={copyRoomId} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 transition-colors">Copy ID</button>
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
              <div className="bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl p-6 mt-auto flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white">Final Intent Hash</h3>
                      <p className="text-xs text-white/50">Sign this deterministic hash to execute the swap.</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#030303] border border-emerald-500/30 rounded-xl px-4 py-3 flex-1 md:max-w-md shadow-inner">
                    <div className="font-mono text-emerald-400 break-all text-sm font-medium tracking-wide">{intentHash}</div>
                  </div>
                </div>

                <div className="z-10 mt-2 flex flex-col gap-4">
                  <div className="bg-[#111] border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-white/80">Future Gno commitment call preview</h4>
                      <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-white/50">Preview only</Badge>
                    </div>
                    <pre className="text-xs text-emerald-400/70 font-mono bg-black rounded-lg p-3 overflow-x-auto">
                      {JSON.stringify(buildCommitIntentCall(intentHash || '', roomData.id, roomData.partyA, roomData.partyB), null, 2)}
                    </pre>
                    <div className="mt-3 flex gap-2 text-[10px] text-white/40">
                      <span className="flex items-center gap-1"><XCircle size={10}/> Signing not implemented</span>
                      <span className="flex items-center gap-1"><XCircle size={10}/> Broadcast not implemented</span>
                      <span className="flex items-center gap-1"><XCircle size={10}/> Settlement not implemented</span>
                    </div>
                  </div>
                  
                  <Button disabled className="w-full py-7 text-lg bg-emerald-500 text-black font-semibold tracking-wide hover:bg-emerald-400 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    Preview Gno Commitment
                  </Button>
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
        <div className="flex items-center border-b border-white/5">
          <button onClick={() => setActiveTab('setup')} className={`flex-1 py-4 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'setup' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Setup</button>
          <button onClick={() => setActiveTab('assets')} className={`flex-1 py-4 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'assets' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Assets</button>
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'chat' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Chat</button>
          <button onClick={() => setActiveTab('logs')} className={`flex-1 py-4 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'logs' ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'}`}>Logs</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#111] border border-white/5 rounded-xl p-4">
                <h3 className="text-sm font-medium text-white mb-2">Create New Trade</h3>
                <p className="text-xs text-white/40 mb-4 leading-relaxed">Start a new P2P exchange room. You will get a Room ID to share with your counterparty.</p>
                <Button onClick={actions.createRoom} disabled={!!roomData} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold disabled:opacity-50">Create Room</Button>
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
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg mb-2">
                <strong>Demo Rule:</strong> Planned ecosystem assets and balances are mocked for demo purposes. Technical denom-first display ensures safety against spoofed names.
              </div>
              
              {DEMO_ASSETS.map((asset, i) => {
                const isSuspicious = asset.verificationStatus === 'suspicious';
                const isVerified = asset.verificationStatus === 'verified';
                return (
                  <div key={i} className={`bg-[#0a0a0a] border rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden shadow-inner ${isSuspicious ? 'border-rose-500/30' : 'border-white/5'}`}>
                    {isSuspicious && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 pl-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden relative p-1.5 ${isSuspicious ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                          {asset.displayDenom === 'ATONE' && <Image src="/assets/logos/atomone.svg" alt="ATONE" width={24} height={24} className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                          {asset.displayDenom === 'GNOT' && <Image src="/assets/logos/gno.svg" alt="GNOT" width={24} height={24} className="object-contain" />}
                          {asset.displayDenom === 'PHOTON' && <Image src="/assets/logos/photon.svg" alt="PHOTON" width={24} height={24} className="object-contain text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />}
                          {!['ATONE', 'GNOT', 'PHOTON'].includes(asset.displayDenom) && (
                            <span className="font-bold text-[10px]">{asset.displayDenom.slice(0,3)}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="text-base font-bold text-white tracking-wide">{asset.amount}</div>
                          <div className="text-[10px] text-white/40 font-mono">{asset.displayDenom}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 mt-1">
                        {isVerified && <Info size={14} className="text-white/20 hover:text-white/40 transition-colors cursor-help" />}
                        {isSuspicious && <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium"><ShieldAlert size={10} /> Suspicious</div>}
                      </div>
                    </div>
                    
                    <div className="bg-[#111] border border-white/5 rounded p-2 text-[9px] font-mono text-white/40 break-all mt-1">
                      {asset.technicalDenom}
                    </div>
                    
                    <Button 
                      onClick={() => actions.addOffer(asset)}
                      disabled={!roomData || roomData.state !== 'active' || myLock}
                      size="sm"
                      className="w-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 mt-1"
                    >
                      Add to Offer
                    </Button>
                  </div>
                );
              })}
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

        </div>
      </div>
    </div>
  );
}

function AssetCard({ asset }: { asset: TradeAsset }) {
  const isSuspicious = asset.verificationStatus === 'suspicious';
  const isVerified = asset.verificationStatus === 'verified';
  
  return (
    <div className={`p-4 rounded-xl border bg-[#0a0a0a] flex flex-col gap-2 group relative overflow-hidden shadow-inner ${isSuspicious ? 'border-rose-500/30' : 'border-white/10'}`}>
      {isSuspicious && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 pl-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden relative p-1.5 ${isSuspicious ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            {asset.displayDenom === 'ATONE' && <Image src="/assets/logos/atomone.svg" alt="ATONE" width={24} height={24} className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
            {asset.displayDenom === 'GNOT' && <Image src="/assets/logos/gno.svg" alt="GNOT" width={24} height={24} className="object-contain" />}
            {asset.displayDenom === 'PHOTON' && <Image src="/assets/logos/photon.svg" alt="PHOTON" width={24} height={24} className="object-contain text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />}
            {!['ATONE', 'GNOT', 'PHOTON'].includes(asset.displayDenom) && (
              <span className="font-bold text-[10px]">{asset.displayDenom.slice(0,3)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-base font-bold text-white tracking-wide">{asset.amount}</div>
            <div className="text-[10px] text-white/40 font-mono">{asset.displayDenom}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 mt-1">
          {isVerified && <Info size={14} className="text-white/20 hover:text-white/40 transition-colors cursor-help" />}
          {isSuspicious && <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium"><ShieldAlert size={10} /> Suspicious denom</div>}
        </div>
      </div>
      
      <div className="bg-[#111] border border-white/5 rounded p-2 text-[9px] font-mono text-white/40 break-all mt-1">
        {asset.technicalDenom}
      </div>
    </div>
  );
}
