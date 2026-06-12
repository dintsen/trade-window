"use client";

import React, { useState } from "react";
import { GnoTransactionPreview } from "./GnoTransactionPreview";
import { GnoTransactionPayload } from "@/lib/wallet/gno-transaction";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import { config, TRANSFERS_DISABLED_MESSAGE } from "@/lib/config";
import { Send, AlertTriangle } from "lucide-react";

export function GnoTestnetTransfer() {
  const { account } = useWalletStore();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [denom, setDenom] = useState("ugnot");
  const [showPreview, setShowPreview] = useState(false);

  if (!account || account.provider !== "adena") {
    return null; // Only show if connected with a real wallet (not mock)
  }

  const buildPayload = (): GnoTransactionPayload => {
    return {
      messages: [
        {
          type: "/bank.MsgSend",
          value: {
            from_address: account.address,
            to_address: recipient,
            amount: `${amount}${denom}`,
          },
        },
      ],
      gasFee: 1000000,
      gasWanted: 1000000,
      memo: "Trade Window Testnet Transfer Prototype",
    };
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;
    setShowPreview(true);
  };

  const handleSign = async () => {
    if (!config.enableGnoTestnetTransfers || config.enableGnoMainnetTransfers) return;
    try {
      const payload = buildPayload();
      const adena = window.adena;
      if (adena?.DoContract) {
        await adena.DoContract({
          messages: payload.messages,
          gasFee: payload.gasFee,
          gasWanted: payload.gasWanted,
          memo: payload.memo,
        });
        alert("Transaction submitted (Testnet/Local prototype)!");
        setShowPreview(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit transaction.");
    }
  };

  const getDisabledReason = () => {
    if (config.enableGnoMainnetTransfers) {
      return `${TRANSFERS_DISABLED_MESSAGE} Mainnet transfers remain disabled.`;
    }
    if (!config.enableGnoTestnetTransfers) {
      return TRANSFERS_DISABLED_MESSAGE;
    }
    return undefined;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mt-6">
      <div className="p-4 bg-zinc-800/50 border-b border-zinc-800">
        <h3 className="text-zinc-100 font-medium flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-500" />
          Testnet/Local Transfer Prototype
        </h3>
        <p className="text-zinc-400 text-xs mt-1">
          Preview a testnet/local Adena transfer. Real mainnet token transfers are disabled.
        </p>
      </div>

      <div className="p-4">
        {!showPreview ? (
          <form onSubmit={handlePreview} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="gno1..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Denom</label>
                <select
                  value={denom}
                  onChange={(e) => setDenom(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="ugnot">ugnot (Testnet GNOT)</option>
                  <option value="atone">ATONE (Demo Asset)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded flex items-start gap-2 text-amber-500 text-xs mt-4">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>This is a testnet/local prototype. Do not use real funds.</p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded font-medium transition-colors text-sm"
            >
              Preview Transaction
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <GnoTransactionPreview 
              payload={buildPayload()}
              disabledReason={getDisabledReason()}
              onSign={handleSign}
              isMainnet={config.enableGnoMainnetTransfers}
            />
            <button
              onClick={() => setShowPreview(false)}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium transition-colors text-sm"
            >
              Back to Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
