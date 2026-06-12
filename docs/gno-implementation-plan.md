# Gno.land Implementation Plan

This document outlines the next milestones for the Gno.land implementation phase of Trade Window.

## Phase 1 — Gno realm hardening
- Refine and harden the `rooms`, `intents`, and `registry` realms.
- Implement a robust deterministic commitment model.
- Solidify the status lifecycle for a deal (created, committed, cancelled, expired, completed).
- Expand test coverage for all edge cases in the Gno tests.

## Phase 2 — Gno local deployment research
- Define local chain requirements for running Trade Window.
- Document `gnokey` setup procedures for local keys.
- Address the `gnodev`/`gnoland` blocker (the local dev node daemon is currently missing from tooling).
- Create "deploy dry-run" docs that document the exact transaction commands.

## Phase 3 — frontend transaction preview
- Build a transaction payload preview in the Next.js UI.
- Crucially, **do not broadcast** and **do not sign automatically**.
- Provide a clear, transparent view of exactly what will be sent to the Gno network for user inspection.

## Phase 4 — Adena signing path
- Trigger wallet connection *only* after explicit user action.
- Ensure no auto-wallet prompts appear on load.
- Establish a read-only connection first to detect accounts.
- Implement the actual transaction signing flow safely later.

## Phase 5 — production protocol roadmap
- Outline the deployment of a public Gno realm.
- Finalize the commitment registry.
- Establish the relationship between the OTC board listings and the Gno realm.
- Create event indexing strategies for off-chain querying.
- Document all safety limitations for the production protocol.
