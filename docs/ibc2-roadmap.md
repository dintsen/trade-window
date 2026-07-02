# IBC 2.0 / Eureka Roadmap

Status: research/roadmap document. No IBC settlement is implemented or claimed.

## Phases (from PROJECT_CONTEXT)

- Phase A — metadata and inspection: IBC denom tracing, source-chain display,
  channel/path display, verified route registry.
- Phase B — interchain-aware intent model (source/destination chain per asset,
  route metadata, settlement status).
- Phase C — route discovery (routing APIs, Eureka route availability,
  AtomOne + Gno.land integration paths).
- Phase D — interchain settlement (only after chain support is confirmed;
  no partial-settlement risk; audit required).
- Phase E — cross-ecosystem expansion.

## Update 2026-07-02

Phase A is now partially implemented in-product: `ibc/<HASH>` denoms are
resolved via LCD `/ibc/apps/transfer/v1/denom_traces/<hash>`
(`apps/web/src/lib/wallet/ibc.ts`); resolved path + base denom are shown in
asset tooltips and carried into the trade intent. A resolved trace is
intentionally NOT treated as verification — channel allowlisting (realm
`registry`) is the next step. `SettlementRoute` in the shared model already
reserves per-asset route metadata for Phase B.

Do not claim production IBC 2.0 settlement until routes, chain support and
wallet UX are verified (unchanged).
