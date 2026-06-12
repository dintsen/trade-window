import { Header } from '@/components/layout/header';
import { Shield, Globe, Cpu } from 'lucide-react';

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <Header />

      <main className="max-w-4xl w-full px-6 flex flex-col relative z-10 py-32">
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-white">
          Building the standard for Web3 OTC.
        </h1>
        
        <p className="text-xl text-white/60 font-light max-w-2xl mb-24 leading-relaxed">
          Trade Window was founded to improve high-value, peer-to-peer OTC coordination without relying on centralized custody.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors">
            <Shield className="text-emerald-400 mb-6" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Security First</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              We are building toward Gno.land commitment logic for deterministic intent review at the protocol layer.
            </p>
          </div>

          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors">
            <Globe className="text-emerald-400 mb-6" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Cosmos Native</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Designed for IBC-aware asset identity from day one, with transfer paths validated only after wallet and protocol research.
            </p>
          </div>

          <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-white/[0.02] transition-colors">
            <Cpu className="text-emerald-400 mb-6" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Open Source</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Our smart contracts and Go backend are transparent, verifiable, and open for community contribution.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}
