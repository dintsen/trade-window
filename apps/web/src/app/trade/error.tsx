'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TradeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#030303] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 max-w-md w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-10 shadow-2xl">
        <AlertTriangle className="text-rose-400 mx-auto mb-6" size={48} />
        <h2 className="text-2xl font-medium mb-3">Trade demo failed to render.</h2>
        <p className="text-white/50 text-sm mb-8">
          A runtime error occurred in the trade interface.
        </p>
        
        <div className="flex flex-col gap-4">
          <Button onClick={() => reset()} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 gap-2">
            <RefreshCw size={16} /> Please refresh
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent hover:bg-emerald-500/10 hover:text-emerald-400 border-white/10 gap-2">
              <Home size={16} /> Return to landing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
