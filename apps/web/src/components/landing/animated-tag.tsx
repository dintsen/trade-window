"use client";

import React, { useState, useEffect } from 'react';

const TEXTS = [
  "Mocked MVP",
  "Gno.land Native",
  "Programmable Escrow",
  "Interchain OTC"
];

export function AnimatedTag() {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TEXTS.length);
        setIsFading(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center justify-start w-[240px] h-[32px] text-emerald-400 text-sm md:text-base font-mono tracking-wide relative overflow-hidden">
      <span 
        className={`absolute inset-0 flex items-center justify-start w-full h-full transition-all duration-300 ${
          isFading ? 'opacity-0 translate-y-3 blur-[2px]' : 'opacity-100 translate-y-0 blur-0'
        }`}
      >
        {TEXTS[index]}
      </span>
    </span>
  );
}
