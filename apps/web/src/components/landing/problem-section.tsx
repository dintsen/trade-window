'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, ShieldAlert, Clock, FileWarning } from 'lucide-react';
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/animate';

const problems = [
  { icon: Send, title: 'Send-first risk', description: 'One party always has to send their assets first, risking loss of funds without guarantee of return.' },
  { icon: ShieldAlert, title: 'Fake display names', description: 'Scammers create malicious tokens with identical display names to trick users into accepting worthless assets.' },
  { icon: Clock, title: 'Last-second changes', description: 'Counterparties can swap out assets or change amounts right before execution in traditional atomic swaps.' },
  { icon: FileWarning, title: 'No clear final intent', description: 'Complex bundles lack a deterministic, readable hash that both parties can inspect before signing.' },
];

export function ProblemSection() {
  return (
    <section className="relative w-full py-24 bg-[#050505] border-t border-[#1c1c1c]">
      <div className="max-w-[1200px] mx-auto px-6">

        <FadeUp className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Why Trade Window</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            OTC deals should not depend on screenshots and trust.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.08}>
          {problems.map(({ icon: Icon, title, description }, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-lg p-6 flex flex-col gap-4 h-full cursor-default"
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(62,207,142,0.25)',
                  boxShadow: '0 8px 32px rgba(62,207,142,0.06)',
                  transition: { duration: 0.2, ease: 'easeOut' },
                }}
              >
                <motion.div
                  className="w-9 h-9 rounded-md bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-white/40 shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5, color: 'rgba(62,207,142,0.8)', transition: { type: 'spring', stiffness: 350, damping: 14 } }}
                >
                  <Icon size={18} />
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
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
