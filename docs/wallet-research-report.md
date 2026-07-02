# Wallet Research Report

## Adena / GnoConnect Read-only Prototype

### Detection Approach
The primary way to interact with the Adena wallet from a web application is through the injected `window.adena` object. Since Adena is a browser extension, it makes this object globally available when installed. 

Detection is safely implemented by verifying `typeof window !== 'undefined' && !!window.adena`. 
We do not use an explicit package manager import or heavy dependency, relying solely on checking the global `window` scope. This ensures that the application does not break if Adena is missing.

### Connection Approach
To connect and request account information, the application utilizes two primary methods exposed by the `window.adena` API:
1. `window.adena.AddEstablish("Trade Window")`: Prompts the user to authorize the connection between the dApp and the wallet.
2. `window.adena.GetAccount()`: Once established, fetches the current account details (including the user's `address`).

### Known API Uncertainties
- While `AddEstablish` and `GetAccount` are stable for basic connection, the exact API structure for broadcasting complex transactions (especially using the newer GnoConnect URL-based paradigm) is still evolving.
- It is unclear if specific meta-tags (`gnoconnect:rpc`, `gnoconnect:chainid`) must be strictly present for basic connection, though official documentation indicates they are highly recommended for broader compatibility.
- GnoConnect currently emphasizes URL-based intent sharing, which diverges from the classic Cosmos `window.keplr` direct-signing paradigm.

### Safe Implementation Bound (Current Scope)
What is safe to implement now:
- **Detection**: Verifying if `window.adena` is present.
- **Connection**: Executing `AddEstablish()` to link the dApp.
- **Read-only State**: Executing `GetAccount()` to retrieve the user's address and display it in the UI.

### Future Work
What remains future work:
- Constructing and formatting transaction messages for Gno realms.
- Triggering the wallet to sign real transactions.
- Finalizing the atomic swap settlement on the live Gno chain.
- Implementing the URL-based GnoConnect standard for deeper ecosystem interoperability.

### Adena Prototype Live
The read-only connection prototype with Adena has been successfully integrated. It establishes connection on user click, retrieves the account address, and prepares the UI for a future signing phase.
