import { Header } from '@/components/layout/header';
import { LockKeyhole, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EscrowPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 flex flex-col relative">
      
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <Header />

      <main className="max-w-4xl w-full mx-auto px-6 flex-1 flex flex-col md:flex-row items-center justify-center gap-16 relative z-10 py-20">
        
        <div className="flex-1">
          <span className="inline-flex items-center justify-start text-emerald-400 text-[11px] font-mono tracking-wide relative overflow-hidden mb-6">
            In Development
          </span>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
            Programmable <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Escrow.</span>
          </h1>
          
          <p className="text-lg text-white/50 font-light mb-8 leading-relaxed">
            A future Gno.land escrow research track for complex multi-party deals. Mainnet custody and automated settlement are not live.
          </p>

          <ul className="space-y-4 mb-10">
            {['Multi-signature fund release', 'Time-locked transactions', 'Dispute resolution oracle hooks'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 size={18} className="text-emerald-400" /> {feature}
              </li>
            ))}
          </ul>

          <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center gap-2 group">
            Read Whitepaper <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex-1 w-full max-w-sm relative group perspective-[1000px]">
          {/* Outer glow sphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"></div>
          
          {/* Main Card */}
          <div className="relative bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 hover:border-emerald-500/30 rounded-[2rem] p-1 shadow-2xl transform transition-all duration-700 hover:-translate-y-4 hover:rotate-y-[-5deg] hover:rotate-x-[5deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Animated border line effect removed per user request */}
            
            <div className="relative bg-[#050507] rounded-[1.8rem] p-10 h-full w-full flex flex-col items-center justify-center text-center overflow-hidden">
              {/* Internal ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px]"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[40px]"></div>

              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500 relative">
                <div className="absolute inset-0 rounded-[2rem] bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <LockKeyhole size={40} className="text-white relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Escrow Smart Contract</h3>
              
              <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="text-[11px] font-mono text-white/50 uppercase tracking-widest">Under Auditing</span>
              </div>
              
              <div className="w-full">
                <div className="w-full flex justify-between text-[11px] font-mono text-white/50 mb-3 uppercase tracking-wider">
                  <span>Phase 2/3</span>
                  <span className="text-emerald-400">65%</span>
                </div>
                <div className="w-full h-2 bg-[#111] rounded-full overflow-hidden border border-white/5 relative">
                  <div className="absolute top-0 left-0 h-full w-[65%] bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    {/* Shimmer effect inside progress bar */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
