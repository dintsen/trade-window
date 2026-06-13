"use client";

import React, { useState, useEffect } from 'react';

const LABELS = [
  "Safety-first OTC protocol",
  "AtomOne / Gno.land native",
  "Non-custodial coordination",
  "Interchain asset bundles",
];

export function AnimatedTag() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LABELS.length);
        setFading(false);
      }, 250);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 mb-6">
      <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] shrink-0" />
      <span
        className={`text-xs font-mono text-[#3ECF8E] transition-all duration-250 whitespace-nowrap ${
          fading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}
        style={{ minWidth: '200px' }}
      >
        {LABELS[index]}
      </span>
    </div>
  );
}
