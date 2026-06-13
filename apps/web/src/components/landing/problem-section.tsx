import React from 'react';
import { Send, ShieldAlert, Clock, FileWarning } from 'lucide-react';

const problems = [
  {
    icon: <Send size={18} />,
    title: "Send-first risk",
    description: "One party always has to send their assets first, risking loss of funds without guarantee of return."
  },
  {
    icon: <ShieldAlert size={18} />,
    title: "Fake display names",
    description: "Scammers create malicious tokens with identical display names to trick users into accepting worthless assets."
  },
  {
    icon: <Clock size={18} />,
    title: "Last-second changes",
    description: "Counterparties can swap out assets or change amounts right before execution in traditional atomic swaps."
  },
  {
    icon: <FileWarning size={18} />,
    title: "No clear final intent",
    description: "Complex bundles lack a deterministic, readable hash that both parties can inspect before signing."
  }
];

export function ProblemSection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] border-t border-[#1c1c1c]">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Why Trade Window</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            OTC deals should not depend on screenshots and trust.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((problem, i) => (
            <div
              key={i}
              className="bg-[#0f0f0f] border border-[#1c1c1c] hover:border-[#2b2b2b] rounded-lg p-6 flex flex-col gap-4 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-white/50 shrink-0">
                {problem.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">{problem.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
