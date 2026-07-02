# Gno Smart Contracts

## Testing and Package Structure Findings

Based on standard Gno.land conventions:
1. **Realm/Package Structure**: Each logical component (e.g., `rooms`, `intents`, `registry`) should be in its own directory representing a package. If it holds state and exposes public endpoints, it acts as a realm.
2. **`gnomod.toml`**: Yes, a `gnomod.toml` is required in the root of each package/realm to define its module path (e.g., `module = "gno.land/r/tradewindow/rooms"`) and any dependencies.
3. **Running Tests**: Tests are written in files ending in `_test.gno` using standard Go testing conventions (`import "testing"`, `func TestXxx(t *testing.T)`).
4. **Expected Command**: To run tests for a specific package, navigate to the directory and run `gno test .` (or `gno test -v .` for verbose output). To run tests recursively, use `gno test ./...`.

## Gno Toolchain
* `gno` CLI purpose: Compiling and executing Gno smart contracts natively.
* `gno test` purpose: Executing the unit tests for Gno packages and realms.
* `gnokey` purpose: Key management, signing transactions, and deploying/calling contracts on a live Gno chain.
* `gno-mcp` purpose: Not available in the current Codex MCP tool registry. Gno validation in this repo is done with official docs/source review plus local `gno` CLI tests.
* Which tools are installed: `gno`, `gnokey`, and `gnodev` are available in `$HOME/go/bin`.
* Which tools are missing/unavailable in this Codex session: Gno MCP server integration; `gnoland` binary; live local RPC binding for `gnodev` is blocked by the current sandbox.
* Exact command required to validate contracts:
```bash
export PATH="$HOME/go/bin:$PATH"
scripts/gno/test-contracts.sh
```

### Gno.land Architecture Note
* **Gno.land Protocol Layer**: Gno smart contracts / realms are the planned authoritative protocol layer.
* **Go Backend**: Coordinates realtime state and acts as a mock room for the current demo.
* **Frontend**: Next.js UI that renders state and will later call wallet/contract APIs directly.
* **Current State**: The Gno layer stores room commitments, dual-signed intent commitments, registry placeholders, fees, board listings, token placeholder logic, and a tested escrow state-machine prototype.
* **Validation State**: Gno tests passing.
* **Limitations**: The escrow realm is locally tested but not deployed. Mainnet custody, NFT transfer, cross-chain settlement, and production fee collection are not live.
* **Backend Status Endpoint**: The Go backend exposes `GET /api/gno/status` so operators can verify whether Gno local/testnet wiring is configured without enabling settlement.


---
### Current Architectural Positioning
* **Core Definition**: Trade Window = Gno.land smart-contract commitment layer + Go coordination backend + Next.js trade UI.
* **Adena Priority**: Adena is the priority wallet path. The current implementation is a read-only/detection prototype only.
* **Limitations**: Real signing is testnet/local-gated. Mainnet settlement is disabled.
* **Gno Contracts**: The Gno contracts are a local validated protocol scaffold. Deployment is not implemented.

### Gno Contracts Status
The Gno contracts in this repository currently function as a local protocol scaffold. They are fully tested locally with `scripts/gno/test-contracts.sh`, but real deployment is not implemented.

### Escrow Realm

`gno/realms/tradewindow/escrow` provides a local Gno state machine for settlement intent:

- `CreateBundleEscrow` records the final intent hash and canonical offer digests for both parties.
- `MarkFunded` records each party's funding acknowledgement.
- `ApproveRelease` requires both parties to approve a normal release.
- `OpenDispute` moves a funded escrow into dispute.
- `Release` and `Refund` support guarantor resolution for disputed escrows.

The realm does not claim deployed mainnet custody. It is a tested local prototype and must be deployed/audited before production settlement.

### Verified Exchange Function

`CreateVerifiedExchange` extends the escrow prototype beyond a digest-only record for simple one-asset-per-side exchanges.

It stores:

- party A and party B assets
- display denom and technical denom
- chain ID
- verification status
- sender address
- receiver address
- fee denom and fee amount
- guarantor

It rejects fake verified tokens:

- a known ticker on the wrong `chainId/technicalDenom` cannot be marked `verified`
- unknown assets cannot be marked `verified`
- known ticker mismatches must be explicitly marked `suspicious`

`MarkFundedWithProof` records each party's funding proof or transaction reference before release approval. The realm still does not execute cross-chain bank sends; it records and enforces the exchange state machine around deterministic settlement intent.
