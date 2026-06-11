import React from 'react';
import { PlusSquare, LockKeyhole, RotateCcw, Timer, Fingerprint, Hash } from 'lucide-react';

const mechanics = [
  {
    icon: <PlusSquare size={20} />,
    title: "Append-only offers",
    description: "Assets can only be added to a bundle, never silently removed or swapped out."
  },
  {
    icon: <LockKeyhole size={20} />,
    title: "Double lock",
    description: "Both parties must explicitly lock their side of the trade before moving forward."
  },
  {
    icon: <RotateCcw size={20} />,
    title: "Lock reset on change",
    description: "Any modification to either offer instantly invalidates both locks."
  },
  {
    icon: <Timer size={20} />,
    title: "10-second review",
    description: "A mandatory countdown prevents rushed executions after both sides lock."
  },
  {
    icon: <Fingerprint size={20} />,
    title: "Technical denoms",
    description: "Users must verify the underlying IBC trace, not just the easily-faked display name."
  },
  {
    icon: <Hash size={20} />,
    title: "Deterministic intent hash",
    description: "Generates a final, readable hash of the exact trade parameters before signing."
  }
];

export function SafetyMechanicsSection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-6 text-white">
            Designed around review, not blind signing.
          </h2>
          <p className="text-lg text-white/40 font-light">
            Every step in the mocked workflow forces users to inspect what they are actually trading.
          </p>
        </div>

        {/* Horizontal Flow Visual */}
        <div className="hidden md:flex justify-between items-center mb-16 relative px-8">
          <div className="absolute top-1/2 left-16 right-16 h-px bg-white/10 -translate-y-1/2"></div>
          
          {['Add Assets', 'Inspect', 'Lock', 'Countdown', 'Review Intent'].map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-3 bg-[#050505] px-4">
              <div className="w-8 h-8 rounded-full border border-emerald-500/30 bg-black flex items-center justify-center text-emerald-400 text-xs font-mono">
                {i + 1}
              </div>
              <span className="text-sm font-medium text-white/80">{step}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mechanics.map((item, i) => (
            <div 
              key={i}
              className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex items-start gap-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                {item.icon}
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
