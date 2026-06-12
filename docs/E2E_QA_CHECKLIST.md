# E2E QA Checklist

Run after every production deploy. Production URLs: frontend `https://tradewindow.xyz`, backend `https://trade-window-production.up.railway.app`.

## Smoke (HTTP 200 expected)

- [ ] `GET /` (frontend)
- [ ] `GET /board`
- [ ] `GET /board/new`
- [ ] `GET /request`
- [ ] `GET /trade`
- [ ] `GET /history`
- [ ] `GET /trades` (redirects to `/history`)
- [ ] `GET <backend>/health`
- [ ] `GET <backend>/api/board/listings`
- [ ] `GET <backend>/api/me/trades?wallet=g1testwalletaddress` (200 + `[]`, no missing-column error)

## Privacy

- [ ] `privacy-regression.sh` passes: no `email`, `telegram`, `privateNote`, `secret`, etc. in public API JSON.
- [ ] Board listing detail shows public contact only.

## Wallet UX

- [ ] No wallet popup on page load (connect only after click).
- [ ] Adena not installed → "Not detected" state, Mock Wallet still usable.
- [ ] Adena installed → Detected badge; connect shows shortened address.
- [ ] Rejected connection handled without crash.
- [ ] Disconnect/reset works.
- [ ] Transaction preview shows structured + raw payload.
- [ ] Mainnet transfer flag off: no mainnet send possible anywhere.

## Trade Room

- [ ] Create room, join from second window.
- [ ] Append-only offers; no silent removal.
- [ ] Lock both sides → 10s countdown; cancel works during countdown.
- [ ] Offer change resets counterparty lock and changes intent hash.
- [ ] Unknown/suspicious denom warning visible.
- [ ] System log records all key actions.

## My Trades

- [ ] Disconnected → "Connect Wallet" empty state.
- [ ] Connected, no data → "No Trades Found" empty state with CTAs.
- [ ] With data → role, asset pair, status badge, date, room link render.
- [ ] MVP auth limitation notice visible.
- [ ] No private contact fields in rendered data.

## Honest Language

- [ ] No "guaranteed settlement", "instant trustless swap", "funds are safe", "live mainnet execution" anywhere.
- [ ] Mainnet-disabled notice present on landing and trade room.
