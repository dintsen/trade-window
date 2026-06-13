"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, LayoutGrid, Send, Layers, ImageIcon, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/board/api";
import { getAllAssets, getAsset } from "@/lib/assets/asset-registry";
import { fetchBalances, formatBaseAmount, parseHumanAmount } from "@/lib/wallet/balances";
import { WalletBalance, WalletNft } from "@/lib/wallet/types";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import { NftGrid } from "@/components/nfts/NftGrid";

const inputCls =
  "w-full bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#3ECF8E]/40 transition-colors text-sm";

const selectCls =
  "w-full bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3ECF8E]/40 transition-colors appearance-none text-sm";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] shrink-0">
        {children}
      </p>
      <div className="flex-1 h-px bg-[#1c1c1c]" />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs text-white/40 font-medium mb-1.5">{children}</label>
  );
}

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
    const err = validateAmount(offerAmountStr);
    if (err) { setAmountError(err); return; }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#3ECF8E]/20">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1c1c1c] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/board" className="text-white/30 hover:text-white/60 transition-colors p-1">
              <ChevronLeft size={16} />
            </Link>
            <div className="w-px h-4 bg-[#1c1c1c]" />
            <Link href="/board" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center shrink-0">
                <LayoutGrid size={12} className="text-[#3ECF8E]" />
              </div>
              <span className="font-semibold text-sm text-white/80">OTC Board</span>
            </Link>
            <span className="text-white/15 text-sm">/</span>
            <span className="text-sm text-white/40">Post Listing</span>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-24 px-6">
        <div className="max-w-2xl mx-auto pt-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-[10px] font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-3">
              OTC Board
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Post an OTC Deal
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              Publish your deal intent to the public board. Your private email will not be shown publicly.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Deal Intent */}
              <div>
                <SectionLabel>Deal Intent</SectionLabel>

                <div className="mb-4">
                  <FieldLabel>Listing Title *</FieldLabel>
                  <input
                    required
                    name="title"
                    type="text"
                    placeholder="e.g. Looking to swap large volume of ATONE"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Request Type *</FieldLabel>
                    <select required name="requestType" defaultValue="" className={selectCls}>
                      <option value="" disabled hidden>Select type...</option>
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                      <option value="swap">Swap</option>
                      <option value="otc_bundle">OTC bundle</option>
                      <option value="nft_game_rwa">NFT / Game / RWA</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Ecosystem *</FieldLabel>
                    <select required name="chain" defaultValue="" className={selectCls}>
                      <option value="" disabled hidden>Select chain...</option>
                      <option value="gno">Gno.land</option>
                      <option value="atomone">AtomOne</option>
                      <option value="cosmos_ibc">Cosmos / IBC</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Asset you offer — token or NFT tab */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <FieldLabel>Asset you offer *</FieldLabel>
                    <div className="flex rounded-lg overflow-hidden border border-[#2b2b2b]">
                      <button
                        type="button"
                        onClick={() => { setOfferTab("token"); setSelectedNft(null); }}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors
                          ${offerTab === "token"
                            ? "bg-white/8 text-white"
                            : "text-white/30 hover:text-white/50"}`}
                      >
                        <Layers className="w-3 h-3" /> Token
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferTab("nft")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors border-l border-[#2b2b2b]
                          ${offerTab === "nft"
                            ? "bg-white/8 text-white"
                            : "text-white/30 hover:text-white/50"}`}
                      >
                        <ImageIcon className="w-3 h-3" /> NFT
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
                        className={selectCls}
                      >
                        <option value="" disabled hidden>Select asset...</option>
                        {getAllAssets().map(a => (
                          <option key={a.technicalDenom} value={a.technicalDenom}>
                            {a.symbol}{a.isDemo ? ' (Demo)' : ''}
                          </option>
                        ))}
                      </select>

                      {selectedOfferDenom && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/40">Offer Amount</span>
                            <span className="text-white/30 flex items-center gap-1">
                              <Wallet className="w-3 h-3" />
                              {!account
                                ? <span>Connect wallet to see balance</span>
                                : balanceFetching
                                ? <span>Fetching...</span>
                                : balanceHuman !== null
                                ? <span>Balance: <span className="text-[#3ECF8E] font-mono">{balanceHuman} {selectedAsset?.symbol}</span></span>
                                : <span>Balance unavailable</span>
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
                              className={`flex-1 bg-[#0a0a0a] border rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none transition-colors font-mono text-sm
                                ${amountError
                                  ? "border-rose-500/40 focus:border-rose-500/60"
                                  : "border-[#1c1c1c] focus:border-[#3ECF8E]/40"
                                }`}
                            />
                            {balanceHuman !== null && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOfferAmountStr(balanceHuman);
                                  setAmountError(validateAmount(balanceHuman));
                                }}
                                className="px-4 py-3 rounded-lg border border-[#3ECF8E]/25 text-[#3ECF8E] text-xs font-semibold hover:bg-[#3ECF8E]/8 transition-colors whitespace-nowrap"
                              >
                                Max
                              </button>
                            )}
                          </div>
                          {amountError && (
                            <p className="text-xs text-rose-400">{amountError}</p>
                          )}
                          {!amountError && offerAmountStr && (
                            <p className="text-xs text-white/20 font-mono">
                              Technical denom: {selectedOfferDenom} · {selectedAsset?.chainId}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input type="hidden" name="offerAsset" value={selectedNft ? `nft:${selectedNft.collectionAddr}:${selectedNft.tokenId}` : ""} />
                      <input type="hidden" name="offerAssetType" value="nft" />
                      <input type="hidden" name="offerAssetChain" value="stargaze-1" />
                      <input type="hidden" name="offerAssetContract" value={selectedNft?.collectionAddr ?? ""} />
                      <input type="hidden" name="offerAssetTokenId" value={selectedNft?.tokenId ?? ""} />

                      {selectedNft && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-[#3ECF8E]/20 bg-[#3ECF8E]/5 text-sm">
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
                        <div className="py-6 text-center text-white/30 text-sm border border-[#1c1c1c] rounded-lg bg-[#0a0a0a]">
                          Connect a Cosmos wallet with a Stargaze address (<code className="text-white/20">stars1…</code>) to browse NFTs.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <FieldLabel>Asset you want *</FieldLabel>
                  <select required name="wantAsset" defaultValue="" className={selectCls}>
                    <option value="" disabled hidden>Select asset...</option>
                    {getAllAssets().map(a => (
                      <option key={a.technicalDenom} value={a.technicalDenom}>{a.symbol}{a.isDemo ? ' (Demo)' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Public Message</FieldLabel>
                  <textarea
                    name="publicMessage"
                    rows={3}
                    placeholder="Add any public details about the trade..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <SectionLabel>Contact Information</SectionLabel>

                <div className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-4 mb-4">
                  <p className="text-xs text-white/40 leading-relaxed">
                    Only your <span className="text-[#3ECF8E]">public contact handle</span> may be shown on the board.
                    Your <span className="text-[#3ECF8E]">private email</span> is stored securely and will not be displayed publicly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Private Email *</FieldLabel>
                    <input required name="privateEmail" type="email" placeholder="Hidden from public" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>Private Name / Nickname</FieldLabel>
                    <input name="privateName" type="text" placeholder="Hidden from public" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>Public Contact Handle</FieldLabel>
                    <input name="publicContact" type="text" placeholder="e.g. @username" className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>Public Contact Platform</FieldLabel>
                    <select name="contactMethod" defaultValue="" className={selectCls}>
                      <option value="" disabled hidden>Select platform...</option>
                      <option value="telegram">Telegram</option>
                      <option value="discord">Discord</option>
                      <option value="x">X (Twitter)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    required
                    name="consentAccepted"
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-[#3ECF8E]"
                  />
                  <p className="text-xs text-white/40 leading-relaxed">
                    I understand that this is a public OTC listing. Trade Window does not provide custody,
                    financial advice, guaranteed execution or real settlement.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? "Posting..." : <><Send size={16} /> Post to Board</>}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
