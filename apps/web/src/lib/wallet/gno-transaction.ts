export interface GnoMessageCall {
  type: "/vm.m_call";
  value: {
    caller: string;
    send: string;
    pkg_path: string;
    func: string;
    args: string[];
  };
}

export interface GnoMessageSend {
  type: "/bank.MsgSend";
  value: {
    from_address: string;
    to_address: string;
    amount: string;
  };
}

export type GnoMessage = GnoMessageCall | GnoMessageSend;

export interface GnoTransactionPayload {
  messages: GnoMessage[];
  gasFee?: number;
  gasWanted?: number;
  memo?: string;
}
