import { TradeAsset } from "../trade/assets";
import { GnoTransactionPayload } from "../wallet/gno-transaction";

export interface GnoEscrowCallPreview {
  realmPath: string;
  method: string;
  args: string[];
  intentHash: string;
  roomId: string;
  parties: string[];
  offerADigest: string;
  offerBDigest: string;
}

export interface BuildEscrowPayloadParams {
  callerAddress: string;
  roomId: string;
  intentHash: string;
  partyA: string;
  partyB: string;
  offerA: TradeAsset[];
  offerB: TradeAsset[];
  guarantor?: string;
}

const ESCROW_REALM_PATH = "gno.land/r/tradewindow/escrow";

export function canBuildVerifiedExchange(offerA: TradeAsset[], offerB: TradeAsset[]): boolean {
  return (
    offerA.length === 1 &&
    offerB.length === 1 &&
    hasCompleteSettlement(offerA[0]) &&
    hasCompleteSettlement(offerB[0])
  );
}

export function buildVerifiedExchangePayload(
  params: BuildEscrowPayloadParams
): GnoTransactionPayload {
  if (!canBuildVerifiedExchange(params.offerA, params.offerB)) {
    throw new Error("Verified exchange requires exactly one settled asset on each side.");
  }

  const assetA = params.offerA[0];
  const assetB = params.offerB[0];

  return {
    messages: [
      {
        type: "/vm.m_call",
        value: {
          caller: params.callerAddress,
          send: "",
          pkg_path: ESCROW_REALM_PATH,
          func: "CreateVerifiedExchange",
          args: [
            `${params.roomId}-exchange`,
            params.intentHash,
            params.partyA,
            params.partyB,
            assetA.type,
            assetA.displayDenom,
            assetA.technicalDenom,
            contractAmount(assetA),
            assetA.chainId,
            assetA.verificationStatus,
            assetA.settlement?.sender.address ?? "",
            assetA.settlement?.receiver?.address ?? "",
            assetA.settlement?.fee?.denom ?? "",
            assetA.settlement?.fee?.amount ?? "0",
            assetB.type,
            assetB.displayDenom,
            assetB.technicalDenom,
            contractAmount(assetB),
            assetB.chainId,
            assetB.verificationStatus,
            assetB.settlement?.sender.address ?? "",
            assetB.settlement?.receiver?.address ?? "",
            assetB.settlement?.fee?.denom ?? "",
            assetB.settlement?.fee?.amount ?? "0",
            params.guarantor ?? "",
          ],
        },
      },
    ],
    gasFee: 1000000,
    gasWanted: 3000000,
    memo: `Trade Window Verified Exchange: ${params.roomId}`,
  };
}

export function buildBundleEscrowPayload(
  params: BuildEscrowPayloadParams
): GnoTransactionPayload {
  const preview = buildBundleEscrowPreview(params);

  return {
    messages: [
      {
        type: "/vm.m_call",
        value: {
          caller: params.callerAddress,
          send: "",
          pkg_path: preview.realmPath,
          func: preview.method,
          args: preview.args,
        },
      },
    ],
    gasFee: 1000000,
    gasWanted: 2500000,
    memo: `Trade Window Escrow: ${params.roomId}`,
  };
}

function hasCompleteSettlement(asset: TradeAsset): boolean {
  return Boolean(
    asset.settlement?.sender.address &&
    asset.settlement?.receiver?.address &&
    asset.settlement?.fee?.denom
  );
}

function contractAmount(asset: TradeAsset): string {
  if (asset.type === "nft") return "1";
  if (!/^\d+(\.\d+)?$/.test(asset.amount)) return "0";
  const [whole, frac = ""] = asset.amount.split(".");
  const decimals = asset.decimals ?? 0;
  const normalizedFrac = frac.slice(0, decimals).padEnd(decimals, "0");
  const base = `${whole}${normalizedFrac}`.replace(/^0+(?=\d)/, "");
  return base || "0";
}

export function buildBundleEscrowPreview(
  params: BuildEscrowPayloadParams
): GnoEscrowCallPreview {
  const offerADigest = canonicalOfferDigest(params.offerA);
  const offerBDigest = canonicalOfferDigest(params.offerB);

  return {
    realmPath: ESCROW_REALM_PATH,
    method: "CreateBundleEscrow",
    args: [
      `${params.roomId}-escrow`,
      params.intentHash,
      params.partyA,
      params.partyB,
      offerADigest,
      offerBDigest,
      String(params.offerA.length),
      String(params.offerB.length),
      params.guarantor ?? "",
    ],
    intentHash: params.intentHash,
    roomId: params.roomId,
    parties: [params.partyA, params.partyB],
    offerADigest,
    offerBDigest,
  };
}

export function canonicalOfferDigest(assets: TradeAsset[]): string {
  return [...assets]
    .sort((a, b) => assetKey(a).localeCompare(assetKey(b)))
    .map(assetKey)
    .join("||");
}

function assetKey(asset: TradeAsset): string {
  return [
    asset.chainId,
    asset.type,
    asset.technicalDenom,
    asset.baseDenom,
    asset.amount,
    asset.id,
    settlementKey(asset),
  ].join("|");
}

function settlementKey(asset: TradeAsset): string {
  const route = asset.settlement;
  if (!route) return "";
  return [
    route.network,
    route.sender.chainId,
    route.sender.address,
    route.receiver?.chainId ?? "",
    route.receiver?.address ?? "",
    route.fee?.denom ?? "",
    route.fee?.amount ?? "",
    route.support,
  ].join(":");
}
