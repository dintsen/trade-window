import React from 'react';
import { PlusSquare, LockKeyhole, RotateCcw, Timer, Fingerprint, Hash } from 'lucide-react';

const mechanics = [
  {
    icon: <PlusSquare size={18} />,
    title: "Append-only offers",
    description: "Assets can only be added to a bundle, never silently removed or swapped out."
  },
  {
    icon: <LockKeyhole size={18} />,
    title: "Double lock",
    description: "Both parties must explicitly lock their side of the trade before moving forward."
  },
  {
    icon: <RotateCcw size={18} />,
    title: "Lock reset on change",
    description: "Any modification to either offer instantly invalidates both locks."
  },
  {
    icon: <Timer size={18} />,
    title: "10-second review",
    description: "A mandatory countdown prevents rushed executions after both sides lock."
  },
  {
    icon: <Fingerprint size={18} />,
    title: "Technical denoms",
    description: "Users must verify the underlying IBC trace, not just the easily-faked display name."
  },
  {
    icon: <Hash size={18} />,
    title: "Deterministic intent hash",
    description: "Generates a final, readable hash of the exact trade parameters before signing."
  }
];

const STEPS = ['Add Assets', 'Inspect', 'Lock', 'Countdown', 'Review Intent'];

export function SafetyMechanicsSection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] border-t border-[#1c1c1c]">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Safety Mechanics</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            Designed around review, not blind signing.
          </h2>
          <p className="text-base text-white/40 leading-relaxed">
            Every step in the workflow forces users to inspect what they are actually trading.
          </p>
        </div>

        {/* Step flow */}
        <div className="hidden md:flex items-center justify-between mb-14 relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-[#1c1c1c]" />
          {STEPS.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-3 bg-[#050505] px-4">
              <div className="w-8 h-8 rounded-md border border-[#2b2b2b] bg-[#111111] flex items-center justify-center text-[#3ECF8E] text-xs font-mono font-semibold">
                {i + 1}
              </div>
              <span className="text-xs font-medium text-white/50 whitespace-nowrap">{step}</span>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mechanics.map((item, i) => (
            <div
              key={i}
              className="bg-[#0f0f0f] border border-[#1c1c1c] hover:border-[#2b2b2b] rounded-lg p-5 flex items-start gap-4 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-[#3ECF8E] shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
