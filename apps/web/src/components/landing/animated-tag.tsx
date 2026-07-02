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
    <div className="h-5 mb-6 overflow-hidden">
      <p
        className={`text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] transition-all duration-250 ${
          fading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}
      >
        {LABELS[index]}
      </p>
    </div>
  );
}
