import { Header } from '@/components/layout/header';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Globe, Shield, Zap, Layers } from 'lucide-react';

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <Header />

      <main className="max-w-6xl w-full mx-auto px-6 flex flex-col relative z-10 py-32">
        <div className="max-w-3xl mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-white">
            The Sovereign <br/> <span className="text-white/40">Ecosystem</span>
          </h1>
          <p className="text-xl text-white/60 font-light max-w-xl leading-relaxed">
            TradeWindow is engineered specifically for the AtomOne and Gno.land ecosystems, leveraging the Interchain architecture for unparalleled security and decentralization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {/* AtomOne Card */}
          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition-colors">
            <Shield className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">AtomOne</h3>
            <p className="text-white/40 leading-relaxed text-sm">
              A highly secure fork of the Cosmos Hub, designed to provide the ultimate settlement layer. TradeWindow utilizes AtomOne for rock-solid deterministic OTC settlements.
            </p>
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 text-xs font-mono text-emerald-400/50 uppercase tracking-widest">
              <span>Settlement</span>
              <span>Security</span>
            </div>
          </div>

          {/* Gno.land Card */}
          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition-colors">
            <Zap className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">Gno.land</h3>
            <p className="text-white/40 leading-relaxed text-sm">
              A smart contract platform running on Gno, a deterministic version of Go. TradeWindow leverages Gno.land for complex, transparent logic and future RWA integration.
            </p>
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 text-xs font-mono text-emerald-400/50 uppercase tracking-widest">
              <span>Logic</span>
              <span>Contracts</span>
            </div>
          </div>

          {/* IBC Card */}
          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:bg-white/[0.02] transition-colors">
            <Layers className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">Interchain</h3>
            <p className="text-white/40 leading-relaxed text-sm">
              Built on the IBC protocol, enabling trustless cross-chain asset transfers. Move liquidity seamlessly between sovereign networks with full technical traceability.
            </p>
            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4 text-xs font-mono text-emerald-400/50 uppercase tracking-widest">
              <span>Transport</span>
              <span>Bridgeless</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
