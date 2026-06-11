import React from 'react';
import { MessageSquare, Terminal, ShieldAlert, ArrowRightLeft, FileCheck, Info } from 'lucide-react';
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
              <div className="grid grid-cols-2 gap-6 h-full">
                
                {/* User Panel */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80 font-medium">You</span>
                    <span className="text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">Locked</span>
                  </div>
                  
                  <div className="bg-[#0a0a0a] border border-white/5 shadow-inner rounded-xl p-4 flex flex-col gap-2 group relative overflow-hidden cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 pl-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 relative p-1.5">
                          <Image src="/assets/logos/atomone.svg" alt="ATONE" width={24} height={24} className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="text-base font-bold text-white tracking-wide">1,500.00</div>
                          <div className="text-[10px] text-white/40 font-mono">uatomone</div>
                        </div>
                      </div>
                      <Info size={16} className="text-white/20 group-hover:text-white/40 transition-colors mt-1" />
                    </div>
                    
                    {/* Tooltip Mockup */}
                    <div className="absolute bottom-2 left-2 right-2 bg-[#1a1a1a] border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl">
                      <div className="text-[10px] text-white/40 mb-1">Trace</div>
                      <div className="text-xs font-mono text-emerald-400 break-all">ibc/27394FB092D2ECCD56123C74F36E4C...</div>
                    </div>
                  </div>
                </div>

                {/* Counterparty Panel */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80 font-medium">Counterparty</span>
                    <span className="text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">Locked</span>
                  </div>
                  
                  <div className="bg-[#0a0a0a] border border-rose-500/30 shadow-inner rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-rose-500"></div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 pl-1">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 relative p-1.5">
                          <Image src="/assets/logos/usdc.svg" alt="USDC" width={24} height={24} className="object-contain drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="text-base font-bold text-white tracking-wide">5,000.00</div>
                          <div className="text-[10px] text-white/40 font-mono">usdc</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 mt-1">
                        <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium"><ShieldAlert size={10} /> Suspicious denom</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/5 shadow-inner rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <FileCheck size={20} className="text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-white/90">Final Intent Hash</div>
                      <div className="text-xs text-white/40 mt-0.5">Sign this deterministic hash to execute the swap.</div>
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
            <div className="w-full md:w-80 border-l border-white/5 bg-[#0a0a0a] flex flex-col">
              
              {/* Chat */}
              <div className="flex-1 flex flex-col border-b border-white/5 relative">
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
                  <div className="text-white/60 leading-relaxed"><span className="opacity-50 font-bold mr-1">{'>'}</span> user_b removed asset</div>
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
