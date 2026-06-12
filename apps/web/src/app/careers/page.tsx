import { Header } from '@/components/layout/header';
import { Lock, Users, Briefcase } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <Header />

      <main className="max-w-3xl w-full mx-auto px-6 flex flex-col items-center text-center relative z-10 py-32">
        
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
          <Briefcase className="text-emerald-400" size={32} />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Careers at Trade Window
        </h1>
        
        <p className="text-lg text-white/50 font-light max-w-xl mx-auto mb-16 leading-relaxed">
          We are a focused, lean team building the native OTC protocol for the Cosmos and Gno.land ecosystems. 
        </p>

        <div className="w-full max-w-lg bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
          
          <Lock size={48} strokeWidth={1} className="text-white/20 mx-auto mb-6" />
          
          <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">No Open Positions</h2>
          
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Our core protocol development team is currently fully staffed. We are heads down building the next phase of the Gno.land integration. 
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/50">
            <Users size={14} className="text-emerald-400" /> Waitlist Closed
          </div>
        </div>

      </main>
    </div>
  );
}
