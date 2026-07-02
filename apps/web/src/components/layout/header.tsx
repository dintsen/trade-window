"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, LayoutGrid, ArrowLeftRight, History, Lock } from 'lucide-react';

// Product definitions — icon, label, href, accent color
const PRODUCTS = [
  {
    href: '/board',
    label: 'OTC Board',
    icon: LayoutGrid,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    description: 'Public deal listings',
  },
  {
    href: '/trade',
    label: 'OTC Trading',
    icon: ArrowLeftRight,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    description: 'P2P trade room',
  },
  {
    href: '/escrow',
    label: 'Escrow Service',
    icon: Lock,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    description: 'Programmable escrow',
  },
  {
    href: '/history',
    label: 'My Trades',
    icon: History,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    description: 'Trade history',
  },
];

function ProductLogo({ product }: { product: typeof PRODUCTS[0] }) {
  const Icon = product.icon;
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-md ${product.bg} flex items-center justify-center shrink-0`}>
        <Icon size={13} className={product.color} />
      </div>
      <span className={`font-bold tracking-tight text-base leading-none ${product.color}`}>
        {product.label}
      </span>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Detect current product page
  const activeProduct = PRODUCTS.find(p => pathname?.startsWith(p.href));

  return (
    <header className="w-full px-6 py-5 z-50 sticky top-0 left-0 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 transition-all text-white">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">

        {/* Left Nav (Desktop) */}
        <nav className="hidden md:flex flex-1 items-center gap-8 text-[13px] font-medium text-white/60">
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-1 hover:text-white transition-colors py-2">
              Products <ChevronDown size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-full left-0 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 shadow-xl z-50">
              {PRODUCTS.map(p => {
                const Icon = p.icon;
                const isActive = pathname?.startsWith(p.href);
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group/item ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-7 h-7 rounded-md ${p.bg} flex items-center justify-center shrink-0 border border-white/5`}>
                      <Icon size={13} className={p.color} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-semibold ${isActive ? p.color : 'text-white/80 group-hover/item:text-white'} transition-colors`}>
                        {p.label}
                      </span>
                      <span className="text-[10px] text-white/30 truncate">{p.description}</span>
                    </div>
                  </Link>
                );
              })}
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

        {/* Center Logo — product-specific when on a product page */}
        <div className="flex justify-center md:flex-1">
          <Link href={activeProduct ? activeProduct.href : '/'} className="flex items-center">
            {activeProduct ? (
              <ProductLogo product={activeProduct} />
            ) : (
              <Image src="/logo-trade.svg" alt="TradeWindow" width={140} height={30} className="object-contain" priority />
            )}
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
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Products</span>
            {PRODUCTS.map(p => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 pl-2 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className={`w-7 h-7 rounded-md ${p.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={13} className={p.color} />
                  </div>
                  <span className="text-sm font-medium">{p.label}</span>
                </Link>
              );
            })}
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
