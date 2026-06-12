# Wallet Signature Authentication Plan & Audit Note

This document outlines the cryptographic signature authentication design for Trade Window and documents the blockers preventing safe production implementation in this environment.

---

## 1. Authentication Design & Architecture

To replace the spoofable query parameter wallet filtering (`GET /api/me/trades?wallet=<address>`), Trade Window requires a nonce-based cryptographic authentication flow.

### A. Nonce Generation Flow
1. The user clicks **"Sign In with Wallet"** in the frontend (without auto-popup on page load).
2. The frontend requests a one-time nonce from the backend:
   ```http
   POST /api/auth/nonce
   Content-Type: application/json

   {
     "wallet": "g1jg8mtu5upuzwepzth9kvl6nv970n5v42k0t7t3",
     "network": "gno-testnet"
   }
   ```
3. The backend generates a random UUID/nonce, stores it in `auth_nonces` table with an expiration (e.g., 5 minutes), and returns the formatted sign-in message:
   ```json
   {
     "nonce": "c0fb6e02-4d26-444c-9f89-c454e99f1da0",
     "message": "Trade Window Sign-In\n\nDomain: tradewindow.xyz\nWallet: g1jg8mtu5upuzwepzth9kvl6nv970n5v42k0t7t3\nNetwork: gno-testnet\nNonce: c0fb6e02-4d26-444c-9f89-c454e99f1da0\nIssued At: 2026-06-12T18:40:00Z\nExpires At: 2026-06-12T18:45:00Z\n\nThis signature proves wallet ownership. It does not authorize a transaction or transfer.",
     "expiresAt": "2026-06-12T18:45:00Z"
   }
   ```

### B. Signature Verification Flow
1. The user signs the exact message with their wallet.
2. The frontend sends the signature to the backend:
   ```http
   POST /api/auth/verify
   Content-Type: application/json

   {
     "wallet": "g1jg8mtu5upuzwepzth9kvl6nv970n5v42k0t7t3",
     "publicKey": "025a7f9b8c...",
     "signature": "r_s_compact_bytes_hex_or_base64",
     "message": "...",
     "nonce": "c0fb6e02-4d26-444c-9f89-c454e99f1da0"
   }
   ```
3. The backend verifies:
   * Nonce exists, is not expired, and has not been used.
   * Nonce is marked as used immediately (preventing replay attacks).
   * Message is verified to match the generated format.
   * Public key is hashed (`ripemd160(sha256(pubkey))`) and Bech32 decoded to verify it derives the wallet address.
   * Signature is cryptographically verified against the SHA256 of the message and the public key using secp256k1.
   * Network matches expected settings.

### C. Session & Cookie Model
* **Session Generation**: If signature verification succeeds, the backend generates a cryptographically secure random session token (e.g., 32 bytes).
* **Security Model**: The backend stores ONLY the SHA-256 hash of the session token in the `auth_sessions` table (with an expiry, e.g., 24 hours), avoiding database leak risks.
* **Cross-Site Cookies**: The backend returns the session token in a secure HttpOnly cookie:
  * `HttpOnly` (prevents XSS retrieval)
  * `Secure` (requires HTTPS)
  * `SameSite=None` (allows cross-site cookies, since frontend is on `tradewindow.xyz` and backend is on `trade-window-production.up.railway.app`)
  * `Path=/`
* **CORS Settings**: Wildcard `Access-Control-Allow-Origin: *` must be disabled on all authenticated endpoints. CORS must explicitly allow credentials (`Access-Control-Allow-Credentials: true`) only for:
  * `https://tradewindow.xyz`
  * `https://www.tradewindow.xyz`

---

## 2. Technical Audit & Blocker Report

We have stopped the implementation phase due to the following critical blockers:

### Blocker 1: Absence of Adena Message Signing API
* **Finding**: The Adena wallet extension does not expose a standard off-chain message-signing API (such as Cosmos' ADR-036 `signArbitrary` or Ethereum's `signMessage`). 
* **Impact**: The only signature method supported by Adena is `adena.Sign(tx)`, which requires constructing a mock Gno.land transaction object. Asking users to sign a full mock transaction to sign-in displays a scary warning to users that they are authorizing a blockchain transaction, which violates the security principles of signature-based authentication.
* **Resolution Required**: Wait for Adena/Gno.land to implement standard off-chain message signing or establish a formal GnoConnect sign-in specification.

### Blocker 2: Missing Go/Docker Compiler in Agent Environment
* **Finding**: The agent environment lacks the Go compiler (`go` command) and the Docker daemon (`docker` command).
* **Impact**: Adding a cryptographic signature verification implementation (secp256k1 and Bech32 decoding) cannot be compiled, run, or tested locally to verify mathematical correctness or logic flow.
* **Risk**: Pushing uncompiled signature verification code directly to production introduces high risks of compilation failure in CI or runtime mathematical bugs that could compromise the authentication layer.

---

## 3. Recommended Remediation & Next Steps

1. **Keep Wallet History Disabled/Insecure in Dev**: Document that query-param filtering is strictly for development and mock mode.
2. **Standardize the Gno Toolchain**: Once Gno.land provides a standardized message signing library for browser extensions, proceed to implement the backend database migrations and endpoints.
3. **Provision Go compiler in the Agent Environment**: Enable local compilation checks to verify the security and arithmetic validity of the cryptographic backend libraries.
