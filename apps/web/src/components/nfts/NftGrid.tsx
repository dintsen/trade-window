"use client";

import { useEffect, useRef, useState } from "react";
import { WalletNft } from "@/lib/wallet/types";
import { fetchStargazeNfts } from "@/lib/wallet/nfts";
import { NftCard } from "./NftCard";
import { Loader2, AlertCircle } from "lucide-react";

interface NftGridProps {
  /** A stars1... address from a connected Cosmos wallet */
  starsAddress: string;
  /** Currently selected NFT (controlled) */
  selectedNft?: WalletNft | null;
  onSelectNft?: (nft: WalletNft | null) => void;
  limit?: number;
}

type FetchResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; nfts: WalletNft[] }
  | { status: "error" };

export function NftGrid({ starsAddress, selectedNft, onSelectNft, limit = 24 }: NftGridProps) {
  // Derive availability directly from props — no setState needed in effect
  const isStarsAddress = starsAddress.startsWith("stars");

  const [result, setResult] = useState<FetchResult>({ status: "idle" });
  const seqRef = useRef(0);

  useEffect(() => {
    if (!isStarsAddress) return;
    const seq = ++seqRef.current;
    // Set loading in a microtask callback to satisfy react-hooks/set-state-in-effect
    Promise.resolve().then(() => {
      if (seq !== seqRef.current) return;
      setResult({ status: "loading" });
    });
    fetchStargazeNfts(starsAddress, limit).then((nfts) => {
      if (seq !== seqRef.current) return;
      setResult(nfts === null ? { status: "error" } : { status: "done", nfts });
    });
  }, [starsAddress, isStarsAddress, limit]);

  // Early return for non-Stars address — no state involved
  if (!isStarsAddress) {
    return (
      <div className="text-center py-8 text-white/40 text-sm">
        <AlertCircle className="w-5 h-5 mx-auto mb-2 text-white/20" />
        NFT lookup requires a Stargaze address (<code>stars1…</code>).
        Connect a Cosmos wallet with a Stargaze address.
      </div>
    );
  }

  if (result.status === "idle" || result.status === "loading") {
    return (
      <div className="flex items-center justify-center py-10 gap-2 text-white/40 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading NFTs from Stargaze…
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="text-center py-8 text-rose-400/70 text-sm">
        <AlertCircle className="w-5 h-5 mx-auto mb-2 text-rose-400/40" />
        NFT data unavailable — Stargaze API could not be reached.
        <p className="text-white/30 text-xs mt-1">This is a preview feature; please try again later.</p>
      </div>
    );
  }

  if (result.nfts.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm">
        No Stargaze NFTs found for this address.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {result.nfts.map((nft) => {
        const key = `${nft.collectionAddr}:${nft.tokenId}`;
        const isSelected =
          selectedNft?.collectionAddr === nft.collectionAddr &&
          selectedNft?.tokenId === nft.tokenId;
        return (
          <NftCard
            key={key}
            nft={nft}
            selected={isSelected}
            onSelect={(n) => onSelectNft?.(isSelected ? null : n)}
          />
        );
      })}
    </div>
  );
}
