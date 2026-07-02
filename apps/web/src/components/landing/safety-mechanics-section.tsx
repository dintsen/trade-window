'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusSquare, LockKeyhole, RotateCcw, Timer, Fingerprint, Hash } from 'lucide-react';
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/animate';

const mechanics = [
  { icon: PlusSquare, title: 'Append-only offers', description: 'Assets can only be added to a bundle, never silently removed or swapped out.' },
  { icon: LockKeyhole, title: 'Double lock', description: 'Both parties must explicitly lock their side of the trade before moving forward.' },
  { icon: RotateCcw, title: 'Lock reset on change', description: 'Any modification to either offer instantly invalidates both locks.' },
  { icon: Timer, title: '10-second review', description: 'A mandatory countdown prevents rushed executions after both sides lock.' },
  { icon: Fingerprint, title: 'Technical denoms', description: 'Users must verify the underlying IBC trace, not just the easily-faked display name.' },
  { icon: Hash, title: 'Deterministic intent hash', description: 'Generates a final, readable hash of the exact trade parameters before signing.' },
];

const STEPS = ['Add Assets', 'Inspect', 'Lock', 'Countdown', 'Review Intent'];

export function SafetyMechanicsSection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] border-t border-[#1c1c1c]">
      <div className="max-w-[1200px] mx-auto px-6">

        <FadeUp className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Safety Mechanics</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            Designed around review, not blind signing.
          </h2>
          <p className="text-base text-white/40 leading-relaxed">
            Every step in the workflow forces users to inspect what they are actually trading.
          </p>
        </FadeUp>

        {/* Step flow with animated connector */}
        <FadeUp delay={0.1} className="hidden md:flex items-center justify-between mb-14 relative">
          {/* Animated progress line */}
          <div className="absolute top-4 left-0 right-0 h-px bg-[#1c1c1c]" />
          <motion.div
            className="absolute top-4 left-0 h-px bg-gradient-to-r from-[#3ECF8E]/60 to-transparent"
            initial={{ width: '0%' }}
            whileInView={{ width: '80%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="relative z-10 flex flex-col items-center gap-3 bg-[#050505] px-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
            >
              <motion.div
                className="w-8 h-8 rounded-md border border-[#2b2b2b] bg-[#111111] flex items-center justify-center text-[#3ECF8E] text-xs font-mono font-semibold"
                whileHover={{
                  borderColor: 'rgba(62,207,142,0.5)',
                  backgroundColor: 'rgba(62,207,142,0.08)',
                  scale: 1.1,
                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                }}
              >
                {i + 1}
              </motion.div>
              <span className="text-xs font-medium text-white/40 whitespace-nowrap">{step}</span>
            </motion.div>
          ))}
        </FadeUp>

        {/* Feature cards */}
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-4" stagger={0.07} delay={0.05}>
          {mechanics.map(({ icon: Icon, title, description }, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-lg p-5 flex items-start gap-4 cursor-default"
                whileHover={{
                  y: -3,
                  borderColor: 'rgba(62,207,142,0.2)',
                  transition: { duration: 0.18, ease: 'easeOut' },
                }}
              >
                <motion.div
                  className="w-9 h-9 rounded-md bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-[#3ECF8E] shrink-0"
                  whileHover={{
                    scale: 1.12,
                    rotate: -5,
                    transition: { type: 'spring', stiffness: 350, damping: 14 },
                  }}
                >
                  <Icon size={18} />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
