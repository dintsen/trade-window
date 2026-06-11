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
* `gno-mcp` purpose: Not present locally, but generally provides MCP/Language Server Protocol features for Gno.
* Which tools are installed: `gno` and `gnokey` have been built from source and are installed in `$HOME/go/bin`.
* Which tools are missing: `gno-mcp` and `gnodev`.
* Exact command required to validate contracts:
```bash
export PATH="$HOME/go/bin:$PATH"
cd gno/realms/tradewindow/rooms
gno test . -v
```

### Gno.land Architecture Note
* **Gno.land Protocol Layer**: Gno smart contracts / realms are the planned authoritative protocol layer.
* **Go Backend**: Coordinates realtime state and acts as a mock room for the current demo.
* **Frontend**: Next.js UI that renders state and will later call wallet/contract APIs directly.
* **Current State**: The Gno layer currently stores commitments and registry placeholders.
* **Validation State**: Gno tests passing.
* **Limitations**: Real settlement is not implemented yet. No actual token, NFT, or RWA transfers are claimed to work in this MVP.


---
### Current Architectural Positioning
* **Core Definition**: Trade Window = Gno.land smart-contract commitment layer + Go coordination backend + Next.js trade UI.
* **Adena Priority**: Adena is the priority wallet path. The current implementation is a read-only/detection prototype only.
* **Limitations**: There is no real signing and no real settlement implemented yet.
* **Gno Contracts**: The Gno contracts are a local validated commitment scaffold. Deployment is not implemented.

### Gno Contracts Status
The Gno contracts in this repository currently function as a local commitment scaffold. They are fully tested locally with `gno test`, but real deployment and live signing with Adena are not implemented.
