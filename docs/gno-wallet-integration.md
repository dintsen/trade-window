# Gno.land Wallet Integration

## Adena Wallet API
Adena is the flagship non-custodial browser extension wallet designed for the Gno.land ecosystem. It operates via the `window.adena` object injected into the browser.

### Key Methods
*   **Connection**: `await window.adena.AddEstablish("AppName")` prompts the user to allow connection.
*   **Account**: `await window.adena.GetAccount()` returns the current account information.

### Transaction Payload
Gno.land utilizes `vm.m_call` for calling smart contract (realm) methods. The payload shape via Adena typically looks like:

```javascript
const tx = {
  messages: [
    {
      type: "/vm.m_call",
      value: {
        caller: "gno1...",
        send: "10000ugnot", // optional funds sent with the call
        pkg_path: "gno.land/r/demo/realm",
        func: "MethodName",
        args: ["arg1", "arg2"]
      }
    }
  ],
  gasFee: 1000000,
  gasWanted: 1000000
};

// Call via DoContract
await window.adena.DoContract({
    messages: tx.messages,
    gasFee: tx.gasFee,
    gasWanted: tx.gasWanted
});
```
Token transfers are done via the `bank.MsgSend` message type:
```javascript
const transferTx = {
  messages: [
    {
      type: "/bank.MsgSend",
      value: {
        from_address: "gno1...",
        to_address: "gno1...",
        amount: "1000000ugnot"
      }
    }
  ]
};
```

## GnoConnect Standard
Gno.land uses the GnoConnect standard for interaction. While Adena has `window.adena`, GnoConnect is standardizing around this.

## Local / Testnet Considerations
*   Adena supports network switching. The application should handle testnet vs mainnet logic gracefully.
*   The `gno` and `gnokey` CLIs remain as fallbacks for raw offline transaction generation if `gnodev` is unavailable or for testing.
*   Trade Window will strictly disable mainnet transfers via a feature flag until explicitly enabled.
