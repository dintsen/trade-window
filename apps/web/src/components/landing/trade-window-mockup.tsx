import React from 'react';
import Image from 'next/image';
import { ShieldCheck, AlertTriangle, Lock, ArrowRight, Zap } from 'lucide-react';

export function TradeWindowMockup() {
  return (
    <div className="relative w-full max-w-3xl mx-auto transform rotate-1 md:rotate-2 hover:rotate-0 transition-all duration-700 ease-out group perspective-[2000px]">
      
      {/* Dynamic ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 blur-[120px] rounded-full scale-110 -z-10 group-hover:bg-emerald-500/30 transition-colors duration-1000"></div>
      
      {/* Main Glass Container */}
      <div className="bg-[#020202]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col font-sans shadow-[0_20px_80px_-20px_rgba(16,185,129,0.3)] relative preserve-3d">
        
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-rose-500 transition-colors duration-300"></div>
              <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-amber-500 transition-colors duration-300 delay-75"></div>
              <div className="w-3 h-3 rounded-full bg-white/10 group-hover:bg-emerald-500 transition-colors duration-300 delay-150 shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            </div>
            <div className="w-px h-4 bg-white/10 mx-2"></div>
            <div className="text-xs font-mono text-white/40 tracking-wider">room://<span className="text-white/80">a7b9...3f21</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        {/* Trade Columns */}
        <div className="p-6 grid grid-cols-2 gap-6 relative">
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          {/* User A Panel */}
          <div className="relative group/panel">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover/panel:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative z-10 transition-transform duration-500 hover:-translate-y-1">
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 p-[1px]">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-full border border-white/10"></div>
                  </div>
                  <span className="text-sm font-semibold text-white/90">Your Offer</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Lock size={12} /> Locked
                </div>
              </div>
              
              {/* Asset Card */}
              <div className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all rounded-xl p-4 flex items-center gap-4 group/card cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner group-hover/card:border-emerald-500/30 transition-colors">
                  <Image src="/assets/logos/atomone.svg" alt="AtomOne" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white tracking-tight flex items-baseline gap-1.5">
                    1,500.00 <span className="text-xs text-white/40 font-mono font-normal">ATOM1</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5 flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified Native
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* User B Panel */}
          <div className="relative group/panel">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover/panel:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative z-10 transition-transform duration-500 hover:-translate-y-1">
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-white/20 to-white/5 p-[1px]">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-full border border-white/10"></div>
                  </div>
                  <span className="text-sm font-semibold text-white/90">Counterparty</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Lock size={12} /> Locked
                </div>
              </div>
              
              {/* Asset Card */}
              <div className="bg-gradient-to-r from-rose-500/[0.03] to-transparent border border-rose-500/10 hover:border-rose-500/30 transition-all rounded-xl p-4 flex items-center gap-4 group/card cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/50 group-hover/card:bg-rose-500 transition-colors"></div>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover/card:scale-105 transition-transform">
                  <Image src="/assets/logos/usdc.svg" alt="USDC" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white tracking-tight flex items-baseline gap-1.5">
                    5,000.00 <span className="text-xs text-white/40 font-mono font-normal">USDC</span>
                  </div>
                  <div className="text-[10px] text-rose-400/90 font-mono mt-0.5 flex items-center gap-1">
                    <AlertTriangle size={10} /> Suspicious Denom
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Action Footer overlay (Glassmorphic) */}
        <div className="mx-6 mb-6 mt-2 relative z-20">
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-2xl"></div>
          <div className="bg-black/80 backdrop-blur-3xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors rounded-2xl p-5 flex items-center justify-between shadow-[0_15px_40px_-10px_rgba(16,185,129,0.2)]">
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={12} className="text-emerald-400" /> Final Intent Hash
              </span>
              <span className="font-mono text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 inline-block w-fit shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
                0x8f2a7b931dc240...9c4e21
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className="text-xl font-black text-white tracking-tighter tabular-nums">08<span className="text-sm font-medium text-white/50">s</span></div>
                <div className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mt-0.5">Remaining</div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <button className="bg-white text-black hover:bg-emerald-400 font-bold rounded-xl px-6 py-3.5 text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 transform hover:scale-105 active:scale-95 group/btn">
                Sign & Settle
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
