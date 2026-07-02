# PR Summary — Technical Audit Fixes

## Branch
codex/technical-audit-fixes

## Goal
Prepare Trade Window for the next Gno.land implementation phase by fixing P0/P1 technical blockers.

## Fixed
- Removed frontend localhost hardcoding.
- Added environment-based API/WebSocket config.
- Added safety feature flags.
- Kept mainnet transfers disabled by default.
- Added/cleaned Gno/Adena wallet foundation.
- Hardened backend WebSocket origin handling.
- Added message size and payload validation.
- Made intent hash deterministic.
- Fixed lint/build blockers.
- Rewrote unsafe settlement copy.

## Still blocked
- Gno CLI tooling is not installed locally.
- Gno tests cannot run until `gno` is installed.
- Production backend deployment is still required.
- Vercel production env variables still need API/WS URLs.

## Validation
- Frontend lint: Passed
- Frontend build: Passed
- Go backend tests: Passed
- Gno tooling: Blocked (gno, gnokey, gnodev missing locally)
- Gno tests: Blocked (cannot run until tooling is installed)

## Safety
Mainnet transfers remain disabled.
No private keys are stored.
No backend signing is implemented.
No custody is implemented.
No production settlement is claimed.
