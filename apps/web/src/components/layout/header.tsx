"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full px-6 py-5 z-50 sticky top-0 left-0 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 transition-all text-white">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left Nav (Desktop) */}
        <nav className="hidden md:flex flex-1 items-center gap-8 text-[13px] font-medium text-white/60">
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-white transition-colors py-2">
              Products <ChevronDown size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-full left-0 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 shadow-xl z-50">
              <Link href="/board" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Board</Link>
              <Link href="/trade" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">OTC Trading</Link>
              <Link href="/escrow" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Escrow Service</Link>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-white transition-colors py-2">
              About us <ChevronDown size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-full left-0 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 shadow-xl z-50">
              <Link href="/company" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Company</Link>
              <Link href="/careers" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Careers</Link>
            </div>
          </div>
          <Link href="/ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
          <Link href="/whitepaper" className="hover:text-white transition-colors">Whitepaper</Link>
        </nav>

        {/* Center Logo */}
        <div className="flex justify-center md:flex-1">
          <Link href="/" className="flex items-center">
            <Image src="/logo-trade.svg" alt="TradeWindow" width={140} height={30} className="object-contain" priority />
          </Link>
        </div>

        {/* Right Nav (Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-6 text-[13px] font-medium text-white/60">
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            EN
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <Link href="/request" className="px-6 py-2.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-white transition-all text-xs tracking-wide">
            Request a Deal
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/80 hover:text-white transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex flex-col gap-4 shadow-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">Products</span>
            <Link href="/board" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg">Board</Link>
            <Link href="/trade" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg">OTC Trading</Link>
            <Link href="/escrow" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg">Escrow Service</Link>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">About Us</span>
            <Link href="/company" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg">Company</Link>
            <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg">Careers</Link>
          </div>
          <Link href="/ecosystem" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/80 hover:text-white">Ecosystem</Link>
          <Link href="/whitepaper" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/80 hover:text-white">Whitepaper</Link>
          <Link href="/request" onClick={() => setMobileMenuOpen(false)} className="py-2 text-white/80 hover:text-white">Request a Deal</Link>
        </div>
      )}
    </header>
  );
}
