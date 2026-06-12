# Trade Window: Starknet Pitch Deck Outline

This document provides a slide-by-slide outline and script for pitching Trade Window to the Starknet Foundation and potential investors.

---

## Slide 1: Title Slide
**Visuals:** Dark premium background (#050807), neon green Trade Window geometric hexagon symbol.
**Title:** Trade Window
**Subtitle:** The Institutional OTC Trade Room for Starknet
**Presenter:** Dmytro Dintsen

---

## Slide 2: The Problem
**Visuals:** Fragmented logos of Telegram, Discord, and AMMs with high slippage charts.
**Key Points:**
- **Fragmentation:** OTC deals in Web3 happen in chaotic Telegram groups.
- **Trust Issues:** Counterparty risk is high; users rely on trusted centralized escrow agents.
- **Slippage:** Large swaps on standard AMMs incur massive slippage and MEV sandwich attacks.
**Script:** "Today, if a treasury or a whale wants to swap $500k of STRK for USDC, they either accept massive AMM slippage, or they trust a stranger in a Telegram group to act as an escrow. This is fundamentally broken."

---

## Slide 3: The Trade Window Solution
**Visuals:** Screenshot of the premium Trade Window UI (dark mode, clean deal room).
**Key Points:**
- **Structured Deal Rooms:** A secure, off-chain negotiated environment for P2P trading.
- **Trustless Settlement:** Cairo smart contracts act as the escrow. Code is the law.
- **Zero Slippage:** Peer-to-peer negotiated swaps mean exactly 0% slippage and 0 MEV exposure.
**Script:** "Trade Window solves this. We provide a premium, structured deal room where parties negotiate off-chain, and settle trustlessly on-chain using Starknet."

---

## Slide 4: Why Starknet?
**Visuals:** Starknet Logo + Account Abstraction icons + Cairo code snippet.
**Key Points:**
- **High Throughput / Low Cost:** ZK-rollups make complex escrow logic incredibly cheap.
- **Cairo:** Highly optimized, provable smart contract execution.
- **Account Abstraction (AA):** Seamless UX using session keys. Users can sign multiple actions without constant pop-ups.
**Script:** "We chose Starknet because of Account Abstraction and Cairo. In an institutional OTC trade, UX matters. With native AA, we can use session keys to make complex multi-step escrows feel as seamless as Web2."

---

## Slide 5: Product Walkthrough
**Visuals:** Flowchart: `Public Intent Board -> Private Deal Room -> Cairo Contract Settlement`
**Key Points:**
1. **Discover:** Find counterparties on the public intent board.
2. **Negotiate:** Agree on terms in real-time via WebSockets.
3. **Commit:** Both parties lock funds into the Cairo Escrow Contract.
4. **Settle:** The contract verifies conditions and automatically swaps the assets.
**Script:** "The flow is simple. You post an intent. You negotiate in real-time. Once agreed, Starknet handles the trustless settlement."

---

## Slide 6: Go-to-Market & Target Audience
**Visuals:** Icons representing DAOs, Treasuries, VC Funds, and High Net Worth Individuals.
**Key Points:**
- **Target:** Web3 Treasuries, Token Foundations, VCs, Whales.
- **Strategy:** Partner with Starknet ecosystem DAOs to handle their treasury diversification needs.
**Script:** "Our primary customers are DAOs and Treasuries looking to diversify without wrecking the chart. We will onboard them by offering sponsored gas and white-glove onboarding via Starknet AA."

---

## Slide 7: Roadmap & Grant Funding
**Visuals:** Timeline chart (Month 1 -> Month 3 -> Month 4).
**Key Points:**
- **Month 1:** Cairo Contract MVP & Testing.
- **Month 2-3:** Starknet integration, Argent/Braavos wallet support, Testnet Alpha.
- **Month 4:** Audit and Mainnet Launch.
- **Funding Request:** $50,000 to accelerate development and auditing.
**Script:** "We are asking for a $50k grant to build out the Cairo contracts, integrate native Starknet wallets, and complete a security audit before our Mainnet launch."

---

## Slide 8: Team & Vision
**Visuals:** Presenter photo/avatar and contact links.
**Key Points:**
- Strong background in protocol design, Go, Next.js, and smart contracts.
- **Vision:** To become the standard settlement layer for all P2P deals on Starknet.
**Script:** "Thank you. Trade Window is ready to bring institutional-grade OTC trading to Starknet."
