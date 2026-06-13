import Link from "next/link";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 selection:bg-[#3ECF8E]/20">

      <div className="max-w-lg w-full text-center space-y-8">

        {/* Icon */}
        <div className="w-16 h-16 rounded-xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-[#3ECF8E]" />
        </div>

        {/* Text */}
        <div>
          <p className="text-[10px] font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-3">
            Request Submitted
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            Inquiry Draft Ready
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Thank you for providing your deal request details. We will review
            your inquiry and contact you for manual coordination if there is a match.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl p-5 text-left">
          <p className="text-xs text-white/30 leading-relaxed">
            Trade Window is currently an MVP/research prototype. Submitting an inquiry does not
            execute a trade, reserve liquidity, provide custody, or guarantee settlement.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="h-11 px-6 flex items-center justify-center gap-2 rounded-lg border border-[#2b2b2b] hover:border-[#3b3b3b] text-white/60 hover:text-white/80 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/trade"
            className="h-11 px-6 flex items-center justify-center gap-2 rounded-lg bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black transition-colors text-sm font-semibold"
          >
            Go to Trade Room
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
