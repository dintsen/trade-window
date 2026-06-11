import React from 'react';
import { Send, ShieldAlert, Clock, FileWarning } from 'lucide-react';

const problems = [
  {
    icon: <Send size={24} />,
    title: "Send-first risk",
    description: "One party always has to send their assets first, risking loss of funds without guarantee of return."
  },
  {
    icon: <ShieldAlert size={24} />,
    title: "Fake display names",
    description: "Scammers create malicious tokens with identical display names to trick users into accepting worthless assets."
  },
  {
    icon: <Clock size={24} />,
    title: "Last-second changes",
    description: "Counterparties can swap out assets or change amounts right before execution in traditional atomic swaps."
  },
  {
    icon: <FileWarning size={24} />,
    title: "No clear final intent",
    description: "Complex bundles lack a deterministic, readable hash that both parties can inspect before signing."
  }
];

export function ProblemSection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-6 text-white">
            OTC deals should not depend on screenshots and trust.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <div 
              key={i}
              className="bg-[#0a0a0a] border border-white/5 hover:border-emerald-500/30 rounded-2xl p-8 flex flex-col gap-4 transition-all group hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden"
            >
              {/* Subtle top glow on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5">
                {problem.icon}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{problem.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
