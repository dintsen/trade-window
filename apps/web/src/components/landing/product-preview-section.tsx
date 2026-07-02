import React from 'react';
import { MessageSquare, Terminal, ShieldAlert, ArrowRightLeft, FileCheck, Plus } from 'lucide-react';
import Image from 'next/image';

export function ProductPreviewSection() {
  return (
    <section className="relative w-full py-24 border-t border-white/5 overflow-hidden bg-[#030303]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-white">
            Experience the workflow.
          </h2>
          <p className="text-white/40 text-lg font-light">
            A secure environment where every action is logged and verified.
          </p>
        </div>

        {/* Large Product Mockup */}
        <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_100px_rgba(16,185,129,0.05)] overflow-hidden flex flex-col font-sans">
          
          {/* App Header */}
          <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-black/50">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded text-xs text-white/40 font-mono">Room: a7b9c2...</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-xs text-emerald-400 font-medium">Connected</span>
            </div>
          </div>

          {/* App Body */}
          <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
            
            {/* Left: Trade Room */}
            <div className="flex-1 flex flex-col p-6 gap-6 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                
                {/* User Panel */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80 font-medium text-sm">You</span>
                    <span className="text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">Locked</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {/* Slot 1: ATONE */}
                    <div className="aspect-square rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-950/5 relative flex items-center justify-center p-2 cursor-pointer group/item hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 overflow-hidden">
                        <Image src="/assets/logos/atomone.svg" alt="ATONE" width={20} height={20} className="object-contain" />
                      </div>
                      <span className="absolute bottom-1 right-1.5 px-1 bg-black/85 text-[9px] font-bold font-mono text-white/70 rounded border border-white/5 py-0.5 leading-none">1.5k</span>

                      {/* Tooltip mockup */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0a0a0c]/95 backdrop-blur-md border border-white/15 rounded-xl p-3 shadow-2xl opacity-0 pointer-events-none group-hover/item:opacity-100 transition-all duration-200 scale-95 group-hover/item:scale-100 origin-bottom z-30 text-left">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="font-bold text-xs text-emerald-400">ATONE</span>
                          <span className="text-[8px] font-mono text-white/40 px-1 bg-white/5 rounded border border-white/5 uppercase">COIN</span>
                        </div>
                        <div className="space-y-1 text-[9px] text-white/60 font-sans">
                          <div><span className="text-white/30 font-medium">Amount:</span> <span className="font-mono">1,500.00</span></div>
                          <div><span className="text-white/30 font-medium">Chain:</span> AtomOne</div>
                          <div className="pt-1.5 border-t border-white/5 mt-1.5 text-[8px] font-mono text-white/30 truncate">uatone</div>
                        </div>
                      </div>
                    </div>
                    {/* Slot 2: Empty */}
                    <div className="aspect-square bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex items-center justify-center text-white/5">
                      <Plus size={12} className="opacity-30" />
                    </div>
                    {/* Slot 3: Empty */}
                    <div className="aspect-square bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex items-center justify-center text-white/5">
                      <Plus size={12} className="opacity-30" />
                    </div>
                    {/* Slot 4: Empty */}
                    <div className="aspect-square bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex items-center justify-center text-white/5">
                      <Plus size={12} className="opacity-30" />
                    </div>
                  </div>
                </div>

                {/* Counterparty Panel */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80 font-medium text-sm">Counterparty</span>
                    <span className="text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">Locked</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {/* Slot 1: USDC */}
                    <div className="aspect-square rounded-xl border border-rose-500/25 hover:border-rose-500/50 bg-rose-950/5 relative flex items-center justify-center p-2 cursor-pointer group/item hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all duration-200">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 overflow-hidden">
                        <Image src="/assets/logos/usdc.svg" alt="USDC" width={20} height={20} className="object-contain" />
                      </div>
                      <span className="absolute bottom-1 right-1.5 px-1 bg-black/85 text-[9px] font-bold font-mono text-white/70 rounded border border-white/5 py-0.5 leading-none">5.0k</span>

                      {/* Tooltip mockup */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0a0a0c]/95 backdrop-blur-md border border-white/15 rounded-xl p-3 shadow-2xl opacity-0 pointer-events-none group-hover/item:opacity-100 transition-all duration-200 scale-95 group-hover/item:scale-100 origin-bottom z-30 text-left">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="font-bold text-xs text-rose-400">USDC</span>
                          <span className="text-[8px] font-mono text-white/40 px-1 bg-white/5 rounded border border-white/5 uppercase">COIN</span>
                        </div>
                        <div className="space-y-1 text-[9px] text-white/60 font-sans">
                          <div><span className="text-white/30 font-medium">Amount:</span> <span className="font-mono">5,000.00</span></div>
                          <div><span className="text-white/30 font-medium">Chain:</span> Gno.land</div>
                          <div className="pt-1.5 border-t border-white/5 mt-1.5 text-[8px] font-mono text-white/30 truncate">usdc</div>
                          <div className="text-rose-400 font-semibold flex items-center gap-1 mt-1 text-[8px] bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded leading-none">
                            <ShieldAlert size={8} /> Suspicious token!
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Slot 2: Empty */}
                    <div className="aspect-square bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex items-center justify-center text-white/5">
                      <Plus size={12} className="opacity-30" />
                    </div>
                    {/* Slot 3: Empty */}
                    <div className="aspect-square bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex items-center justify-center text-white/5">
                      <Plus size={12} className="opacity-30" />
                    </div>
                    {/* Slot 4: Empty */}
                    <div className="aspect-square bg-white/[0.01] border border-white/5 border-dashed rounded-xl flex items-center justify-center text-white/5">
                      <Plus size={12} className="opacity-30" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0a0a0a] border border-white/5 shadow-inner rounded-xl px-5 py-4 gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck size={20} className="text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-white/90">Final Intent Hash</div>
                      <div className="text-xs text-white/40 mt-0.5">Review this deterministic intent hash before any future signing step.</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-inner">
                    0x8f2a7b9...9c4e21
                  </span>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl py-4 text-base transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  Review Signature Step (Disabled in Demo)
                  <ArrowRightLeft size={18} />
                </button>
              </div>

            </div>

            {/* Right: Sidebar (Chat & Logs) */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/5 bg-[#0a0a0a] flex flex-col">
              
              {/* Chat */}
              <div className="flex-1 min-h-[220px] flex flex-col border-b border-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#111]/50 to-transparent pointer-events-none"></div>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 text-xs font-semibold text-white/60 tracking-wider uppercase z-10">
                  <MessageSquare size={14} /> Chat
                </div>
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden z-10">
                  <div className="bg-[#151515] text-white/90 rounded-2xl rounded-bl-sm p-3.5 text-sm self-start max-w-[85%] border border-white/5 shadow-sm leading-relaxed">
                    Hey, adding the USDC now.
                  </div>
                  <div className="bg-[#0a1e14] text-emerald-50 rounded-2xl rounded-br-sm p-3.5 text-sm self-end max-w-[85%] border border-emerald-500/20 shadow-sm leading-relaxed">
                    Wait, that trace looks wrong. It&apos;s not Noble USDC.
                  </div>
                  <div className="bg-[#151515] text-white/90 rounded-2xl rounded-bl-sm p-3.5 text-sm self-start max-w-[85%] border border-white/5 shadow-sm leading-relaxed">
                    Ah my bad, let me fix it.
                  </div>
                </div>
              </div>

              {/* System Log */}
              <div className="h-64 flex flex-col bg-[#050505]">
                <div className="px-4 py-3 border-b border-white/5 bg-[#0a0a0a] flex items-center gap-2 text-xs font-semibold text-white/60 tracking-wider uppercase">
                  <Terminal size={14} className="text-emerald-400" /> System Log
                </div>
                <div className="flex-1 p-5 font-mono text-xs flex flex-col gap-3 overflow-hidden">
                  <div className="text-emerald-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> connection established</div>
                  <div className="text-emerald-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> user_a locked</div>
                  <div className="text-white/60 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> user_b cancelled room after mistake</div>
                  <div className="text-amber-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> locks reset!</div>
                  <div className="text-white/60 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> user_b added asset (USDC)</div>
                  <div className="text-emerald-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> user_b locked</div>
                  <div className="text-emerald-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> user_a locked</div>
                  <div className="text-emerald-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> countdown triggered: 10s</div>
                  <div className="text-emerald-400 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> hash generated: 0x8f2a...</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
