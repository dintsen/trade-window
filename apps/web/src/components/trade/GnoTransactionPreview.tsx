import React, { useState } from "react";
import { GnoTransactionPayload } from "@/lib/wallet/gno-transaction";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface GnoTransactionPreviewProps {
  payload: GnoTransactionPayload;
  disabledReason?: string;
  onSign?: () => void;
  isMainnet?: boolean;
}

export function GnoTransactionPreview({ payload, disabledReason, onSign, isMainnet }: GnoTransactionPreviewProps) {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  const getPrimaryActionDetails = () => {
    if (!payload.messages || payload.messages.length === 0) return null;
    const msg = payload.messages[0];
    
    if (msg.type === "/bank.MsgSend") {
      return {
        actionType: "Token Transfer",
        from: msg.value.from_address,
        to: msg.value.to_address,
        amount: msg.value.amount,
      };
    } else if (msg.type === "/vm.m_call") {
      return {
        actionType: "Smart Contract Call",
        from: msg.value.caller,
        to: msg.value.pkg_path,
        method: msg.value.func,
        args: msg.value.args.join(", "),
        amount: msg.value.send || "None",
      };
    }
    return { actionType: "Unknown" };
  };

  const details = getPrimaryActionDetails();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden text-sm">
      <div className="p-4 bg-zinc-800/50 border-b border-zinc-800">
        <h3 className="text-zinc-100 font-medium flex items-center gap-2">
          Transaction Preview
          {isMainnet && (
            <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full ml-auto">
              <AlertTriangle className="w-3 h-3" />
              Mainnet detected
            </span>
          )}
        </h3>
        <p className="text-zinc-400 text-xs mt-1">Review the transaction details before signing.</p>
      </div>
      
      <div className="p-4 space-y-4">
        {details && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Action</span>
              <span className="text-zinc-200 font-medium">{details.actionType}</span>
            </div>
            {details.from && (
              <div className="flex justify-between">
                <span className="text-zinc-500">From</span>
                <span className="text-zinc-300 truncate max-w-[200px]">{details.from}</span>
              </div>
            )}
            {details.to && (
              <div className="flex justify-between">
                <span className="text-zinc-500">To</span>
                <span className="text-zinc-300 truncate max-w-[200px]">{details.to}</span>
              </div>
            )}
            {details.method && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Method</span>
                <span className="text-zinc-300">{details.method}</span>
              </div>
            )}
            {details.amount && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount/Send</span>
                <span className="text-emerald-400 font-medium">{details.amount}</span>
              </div>
            )}
            {payload.memo && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Memo</span>
                <span className="text-zinc-300">{payload.memo}</span>
              </div>
            )}
          </div>
        )}

        <div className="border border-zinc-800 rounded-md">
          <button 
            className="w-full flex items-center justify-between p-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            onClick={() => setIsRawExpanded(!isRawExpanded)}
          >
            <span className="text-xs font-medium uppercase tracking-wider">Raw Payload Data</span>
            {isRawExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isRawExpanded && (
            <div className="p-3 bg-black/40 border-t border-zinc-800 overflow-x-auto">
              <pre className="text-xs text-zinc-400 font-mono">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        {disabledReason ? (
          <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{disabledReason}</p>
          </div>
        ) : (
          <button 
            onClick={onSign}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-medium transition-colors"
          >
            Sign Testnet/Local Transaction
          </button>
        )}
      </div>
    </div>
  );
}
