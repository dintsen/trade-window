"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Layers, ImageIcon, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/board/api";
import { getAllAssets, getAsset } from "@/lib/assets/asset-registry";
import { fetchBalances, formatBaseAmount, parseHumanAmount } from "@/lib/wallet/balances";
import { WalletBalance, WalletNft } from "@/lib/wallet/types";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import { NftGrid } from "@/components/nfts/NftGrid";

export default function NewListingPage() {
  const router = useRouter();
  const { account } = useWalletStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerTab, setOfferTab] = useState<"token" | "nft">("token");
  const [selectedNft, setSelectedNft] = useState<WalletNft | null>(null);

  // Balance state for token offer
  const [selectedOfferDenom, setSelectedOfferDenom] = useState<string>("");
  const [offerAmountStr, setOfferAmountStr] = useState<string>("");
  const [balances, setBalances] = useState<WalletBalance[] | null>(null);
  const [balanceFetching, setBalanceFetching] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  // Fetch balances when offer denom + connected account changes.
  // setState calls are wrapped in microtasks to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    const asset = selectedOfferDenom ? getAsset(selectedOfferDenom) : null;
    if (!selectedOfferDenom || !account?.address || !asset?.chainId) {
      Promise.resolve().then(() => { setBalances(null); setBalanceFetching(false); });
      return;
    }
    let cancelled = false;
    const chainId = asset.chainId;
    const address = account.address;
    Promise.resolve().then(() => { if (!cancelled) setBalanceFetching(true); });
    fetchBalances(address, chainId).then((result) => {
      if (cancelled) return;
      setBalances(result);
      setBalanceFetching(false);
    });
    return () => { cancelled = true; };
  }, [selectedOfferDenom, account?.address]);

  const selectedAsset = selectedOfferDenom ? getAsset(selectedOfferDenom) : null;
  const tokenBalance = balances?.find((b) => b.denom === selectedOfferDenom) ?? null;
  const decimals = tokenBalance?.decimals ?? selectedAsset?.decimals ?? 6;
  const balanceHuman = tokenBalance ? formatBaseAmount(tokenBalance.amount, decimals) : null;

  const validateAmount = (value: string): string | null => {
    if (!value.trim()) return null;
    const parsed = parseHumanAmount(value, decimals);
    if (parsed === null) return "Invalid amount — use digits and one decimal point";
    if (parsed <= BigInt(0)) return "Amount must be greater than zero";
    if (tokenBalance && parsed > BigInt(tokenBalance.amount)) {
      return `Exceeds available balance (${balanceHuman} ${selectedAsset?.symbol ?? ""})`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Final amount validation before submit
    const err = validateAmount(offerAmountStr);
    if (err) { setAmountError(err); return; }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Use offerAmountStr as amountRange when the token tab is active
    const resolvedAmountRange =
      offerTab === "token" && offerAmountStr.trim()
        ? `${offerAmountStr.trim()} ${selectedAsset?.symbol ?? ""}`.trim()
        : (data.amountRange as string) || "";

    try {
      const listing = await createListing({
        title: data.title as string,
        requestType: data.requestType as string,
        offerAsset: data.offerAsset as string,
        wantAsset: data.wantAsset as string,
        amountRange: resolvedAmountRange,
        chain: data.chain as string,
        publicMessage: data.publicMessage as string,
        publicContact: data.publicContact as string,
        contactMethod: data.contactMethod as string,
        privateEmail: data.privateEmail as string,
        privateName: data.privateName as string,
        creatorWallet: account?.address,
        consentAccepted: data.consentAccepted === "on",
      });
      router.push(`/board?created=${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post listing");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30">
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/board" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-white/40 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-white/60 group-hover:text-white transition-colors">
              Back to Board
            </span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-white">Trade</span>
            <span className="text-emerald-500">Window</span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Post an OTC Deal
          </h1>
          <p className="text-xl text-white/40 max-w-xl mx-auto">
            Publish your deal intent to the public board.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
          <div className="bg-[#111] rounded-[22px] p-6 md:p-10 border border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-white/10">
                  Deal Intent
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Listing Title *</label>
                  <input required name="title" type="text" placeholder="e.g. Looking to swap large volume of ATONE" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Request Type *</label>
                    <select required name="requestType" defaultValue="" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                      <option value="" disabled hidden>Select type...</option>
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                      <option value="swap">Swap</option>
                      <option value="otc_bundle">OTC bundle</option>
                      <option value="nft_game_rwa">NFT / Game / RWA</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Ecosystem *</label>
                    <select required name="chain" defaultValue="" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                      <option value="" disabled hidden>Select chain...</option>
                      <option value="gno">Gno.land</option>
                      <option value="atomone">AtomOne</option>
                      <option value="cosmos_ibc">Cosmos / IBC</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Asset you offer — token or NFT tab */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white/60">Asset you offer *</label>
                    <div className="flex rounded-lg overflow-hidden border border-white/10">
                      <button
                        type="button"
                        onClick={() => { setOfferTab("token"); setSelectedNft(null); }}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors
                          ${offerTab === "token" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
                      >
                        <Layers className="w-3 h-3" /> Token
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferTab("nft")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors border-l border-white/10
                          ${offerTab === "nft" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}
                      >
                        <ImageIcon className="w-3 h-3" /> NFT
                        <span className="text-[9px] text-pink-400/80 ml-0.5">Preview</span>
                      </button>
                    </div>
                  </div>

                  {offerTab === "token" ? (
                    <div className="space-y-3">
                      <select
                        required
                        name="offerAsset"
                        value={selectedOfferDenom}
                        onChange={(e) => {
                          setSelectedOfferDenom(e.target.value);
                          setOfferAmountStr("");
                          setAmountError(null);
                        }}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none"
                      >
                        <option value="" disabled hidden>Select asset...</option>
                        {getAllAssets().map(a => (
                          <option key={a.technicalDenom} value={a.technicalDenom}>
                            {a.symbol}{a.isDemo ? ' (Demo)' : ''}
                          </option>
                        ))}
                      </select>

                      {/* Amount + balance row — shown once an asset is picked */}
                      {selectedOfferDenom && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Offer Amount</span>
                            <span className="text-white/40 flex items-center gap-1">
                              <Wallet className="w-3 h-3" />
                              {!account
                                ? <span className="text-white/30">Connect wallet to see balance</span>
                                : balanceFetching
                                ? <span className="text-white/30">Fetching balance…</span>
                                : balanceHuman !== null
                                ? <span>Balance: <span className="text-emerald-400 font-mono">{balanceHuman} {selectedAsset?.symbol}</span></span>
                                : <span className="text-white/30">Balance unavailable</span>
                              }
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder={`0.00${selectedAsset?.symbol ? ` ${selectedAsset.symbol}` : ""}`}
                              value={offerAmountStr}
                              onChange={(e) => {
                                setOfferAmountStr(e.target.value);
                                setAmountError(validateAmount(e.target.value));
                              }}
                              className={`flex-1 bg-black/50 border rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 outline-none font-mono
                                ${amountError
                                  ? "border-rose-500/40 focus:ring-rose-500/30"
                                  : "border-white/10 focus:ring-emerald-500/50"
                                }`}
                            />
                            {balanceHuman !== null && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOfferAmountStr(balanceHuman);
                                  setAmountError(validateAmount(balanceHuman));
                                }}
                                className="px-4 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors whitespace-nowrap"
                              >
                                Max
                              </button>
                            )}
                          </div>
                          {amountError && (
                            <p className="text-xs text-rose-400">{amountError}</p>
                          )}
                          {!amountError && offerAmountStr && (
                            <p className="text-xs text-white/30 font-mono">
                              Technical denom: {selectedOfferDenom} · {selectedAsset?.chainId}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Hidden fields for NFT data */}
                      <input type="hidden" name="offerAsset" value={selectedNft ? `nft:${selectedNft.collectionAddr}:${selectedNft.tokenId}` : ""} />
                      <input type="hidden" name="offerAssetType" value="nft" />
                      <input type="hidden" name="offerAssetChain" value="stargaze-1" />
                      <input type="hidden" name="offerAssetContract" value={selectedNft?.collectionAddr ?? ""} />
                      <input type="hidden" name="offerAssetTokenId" value={selectedNft?.tokenId ?? ""} />

                      {selectedNft && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm">
                          {selectedNft.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={selectedNft.imageUrl} alt={selectedNft.name ?? ""} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white/80 font-medium truncate">{selectedNft.name ?? `#${selectedNft.tokenId}`}</p>
                            <p className="text-white/40 text-xs truncate">{selectedNft.collectionName}</p>
                          </div>
                          <button type="button" onClick={() => setSelectedNft(null)} className="text-white/30 hover:text-white/60 text-xs">Clear</button>
                        </div>
                      )}

                      {account?.address?.startsWith("stars") ? (
                        <NftGrid
                          starsAddress={account.address}
                          selectedNft={selectedNft}
                          onSelectNft={setSelectedNft}
                        />
                      ) : (
                        <div className="py-6 text-center text-white/40 text-sm border border-white/5 rounded-xl bg-white/[0.02]">
                          Connect a Cosmos wallet with a Stargaze address (<code className="text-white/30">stars1…</code>) to browse NFTs.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Asset you want *</label>
                  <select required name="wantAsset" defaultValue="" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                    <option value="" disabled hidden>Select asset...</option>
                    {getAllAssets().map(a => (
                      <option key={a.technicalDenom} value={a.technicalDenom}>{a.symbol} {a.isDemo ? '(Demo)' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Public Message</label>
                  <textarea name="publicMessage" rows={3} placeholder="Add any public details about the trade..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none" />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-white/10">
                  Contact Information
                </h2>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 text-xs text-white/60 leading-relaxed">
                  Only your <strong className="text-emerald-400 font-medium">public contact handle</strong> may be shown on the board. Your <strong className="text-emerald-400 font-medium">private email</strong> is stored securely for manual follow-up and will not be displayed publicly.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Private Email *</label>
                    <input required name="privateEmail" type="email" placeholder="Hidden from public" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Private Name / Nickname</label>
                    <input name="privateName" type="text" placeholder="Hidden from public" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Public Contact Handle</label>
                    <input name="publicContact" type="text" placeholder="e.g. @username" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Public Contact Platform</label>
                    <select name="contactMethod" defaultValue="" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none">
                      <option value="" disabled hidden>Select platform...</option>
                      <option value="telegram">Telegram</option>
                      <option value="discord">Discord</option>
                      <option value="x">X (Twitter)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <input required name="consentAccepted" type="checkbox" className="mt-1 w-5 h-5 rounded border-white/20 bg-black/50 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer shrink-0" />
                  <div className="text-sm text-white/40 leading-relaxed">
                    I understand that this is a public OTC listing. Trade Window does not provide custody, financial advice, guaranteed execution or real settlement.
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {isSubmitting ? "Posting..." : <><Send size={18} /> Post to Board</>}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
