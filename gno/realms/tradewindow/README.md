# Trade Window Gno.land Realm

This directory contains the smart contract layer (Realms) for the Trade Window protocol on Gno.land.

## Components
- `rooms`: Manages room lifecycles and metadata.
- `intents`: Handles trade intent commitments and finalizing intent hashes.
- `fees`: Fee accounting and logic.
- `registry`: Placeholder for a verified asset registry.
- `board`: Placeholder for an OTC board (public listings).
- `token`: Placeholder for future utility tokens.

## Important Note on Environment
The `gno` and `gno-mcp` tools are currently unavailable in the environment. These contracts are constructed as standard Go/Gno stubs to establish the architecture and on-chain boundary. They must be validated against `gno` tooling once it is accessible.
