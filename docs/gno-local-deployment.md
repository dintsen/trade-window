# Gno Local Deployment / Commitment Prototype

## 1. Current Gno package structure
The Trade Window Gno contracts are organized into three sub-packages inside `gno/realms/tradewindow/`:
* `rooms`: Manages room creation, locking, and escrow lifecycle.
* `intents`: Handles the generation and storage of deterministic trade intent hashes.
* `registry`: Stub for future verified asset placeholders on-chain.

## 2. Testing Gno Contracts Locally
To run the local Gno tests, ensure the `gno` CLI is in your `PATH`.
```bash
export PATH="$HOME/go/bin:$PATH"
cd gno/realms/tradewindow/rooms && gno test . -v
cd gno/realms/tradewindow/intents && gno test . -v
cd gno/realms/tradewindow/registry && gno test . -v
```

## 3. Local Deployment Overview
Currently, the Gno contracts function purely as a local commitment scaffold. Real deployment to a public Gno testnet/mainnet is strictly not implemented yet. The current prototype only demonstrates that the Go backend and Next.js frontend can safely prepare an intent hash for future commitment.

## 4. Tooling
* `gno`: Available locally (`master.3148+c775354dd`). Used for testing (`gno test`).
* `gnokey`: Available locally (`master.3148+c775354dd`). Future tool for account management and transaction signing.
* `gno.land dev node`: Requires running `gnoland` locally to fully deploy and test the realm locally, which is not configured in this prototype phase.

## 5. What is implemented
* The Gno commitment scaffold (smart contracts).
* Gno package tests.
* Frontend preview of the future Gno commitment call.

## 6. What is not implemented
* Production deployment to Gno.land.
* Signing the commitment transaction through Adena or gnokey.
* Real asset settlement (token/NFT transfers).
* Local `gnoland` dev node spin-up.

## 7. Exact Commands Attempted
The system successfully tested the availability of:
```bash
gno version
gnokey version
gno test .
```

## 8. Current Blockers
* Fully deploying to a local chain requires spinning up a local `gnoland` instance and funding test accounts with `gnokey`, which is out of scope for the current read-only commitment call preview phase. We simulate the intent call generation strictly in the frontend.

## 9. Local Node / gnokey Dry Run

### Tooling Checked
The system was inspected for local Gno node/dev tooling:
* `gno`: Present.
* `gnokey`: Present.
* `gnoland`: **Not Found**.
* `gnodev`: **Not Found**.

### Commands Discovered / Attempted
* Checked `which gnoland` and `which gnodev`.
* Checked `gnoland version` and `gnodev version`.

### What Failed
The system does not have `gnoland` or `gnodev` installed locally or in PATH. As a result, starting a local dev node is impossible.

### Exact Blockers
1. A local Gno node (`gnoland`) is required to perform actual local deployment and execute queries/mutations. Without it, `gnokey` has no local RPC to communicate with.
2. We cannot proceed to local deployment until the `gnoland` binary is compiled and installed into the environment's `PATH`.

### Next Commands After Blocker is Resolved
Once `gnoland` is installed, the following steps will be executed:
1. `gnoland start` (or equivalent) to boot the local chain.
2. `gnokey generate` to create a local test key.
3. `gnokey maketx addpkg` to compose the deployment transaction.
4. `gnokey broadcast` to push the package to the local chain.
