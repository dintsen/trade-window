import { GnoTransactionPayload } from "../wallet/gno-transaction";

export interface TransactionPreviewSummary {
  actionType: string;
  target?: string;
  amount?: string;
  memo?: string;
}

export function summarizeGnoTransaction(
  payload: GnoTransactionPayload
): TransactionPreviewSummary {
  const message = payload.messages[0];
  if (!message) {
    return { actionType: "No transaction message", memo: payload.memo };
  }

  if (message.type === "/bank.MsgSend") {
    return {
      actionType: "Token Transfer",
      target: message.value.to_address,
      amount: message.value.amount,
      memo: payload.memo,
    };
  }

  if (message.type === "/vm.m_call") {
    return {
      actionType: "Gno Realm Call",
      target: `${message.value.pkg_path}.${message.value.func}`,
      amount: message.value.send || "None",
      memo: payload.memo,
    };
  }

  return { actionType: "Unknown transaction", memo: payload.memo };
}
