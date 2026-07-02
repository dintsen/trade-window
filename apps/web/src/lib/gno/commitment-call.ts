import { GnoTransactionPayload } from "../wallet/gno-transaction";

export interface GnoCommitmentCallPreview {
  realmPath: string;
  method: string;
  args: string[];
  intentHash: string;
  roomId: string;
  parties: string[];
  chainId?: string;
}

export function buildRoomCommitmentPayload(
  preview: GnoCommitmentCallPreview,
  callerAddress: string
): GnoTransactionPayload {
  return {
    messages: [
      {
        type: "/vm.m_call",
        value: {
          caller: callerAddress,
          send: "",
          pkg_path: preview.realmPath,
          func: preview.method,
          args: preview.args,
        },
      },
    ],
    gasFee: 1000000,
    gasWanted: 2000000,
    memo: `Trade Window Room: ${preview.roomId}`,
  };
}
