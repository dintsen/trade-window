'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FadeUp } from '@/components/ui/animate';

export function FinalCtaSection() {
  return (
    <section className="relative w-full py-32 bg-[#050505] border-t border-[#1c1c1c] overflow-hidden">

      {/* Animated glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-[100%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(62,207,142,0.07) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-[760px] mx-auto px-6 text-center z-10">

        <FadeUp>
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-6">Demo</p>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 text-white">
            Open the mocked<br className="hidden md:block" /> trade-room demo.
          </h2>

          <p className="text-base md:text-lg text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Try the two-window flow: create a room, add assets, lock both sides, trigger the countdown and inspect the final intent hash.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <motion.div
            className="relative overflow-hidden rounded-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/trade"
              className="relative z-10 px-8 py-3.5 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              Open Trade Room
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <ArrowRight size={15} />
              </motion.span>
            </Link>
            {/* shimmer */}
            <motion.div
              className="absolute inset-0 -skew-x-12 bg-white/20 pointer-events-none z-20"
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link
              href="/board"
              className="px-8 py-3.5 bg-transparent border border-[#2b2b2b] hover:border-[#3b3b3b] hover:bg-white/[0.03] text-white font-medium rounded-lg text-sm transition-all flex items-center justify-center"
            >
              Browse OTC Board
            </Link>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.25}>
          <p className="text-xs font-mono text-white/20">
            Mocked local MVP. Real wallet signing and settlement are not implemented yet.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
