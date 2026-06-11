# Trade Window Backend (Go)

MVP Backend implementing the Trade Window Room State Machine and WebSocket protocol.

## Features (Hardened MVP)
- Real-time bipartite trade state synchronization.
- **Configurable Constraints:** Timeouts and logic bounded by env configs.
- **Structured Error Payloads:** Clean `trade:error` events matching standard error codes.
- **Authoritative State Machine:** Backend strictly governs lock flow, expiry limits, and countdown timers.
- **Safe Rendering:** Reject payloads lacking required parameters.

## Environment Variables
The backend consumes the following variables:
- `PORT` (Default: `8080`): The port the HTTP server binds to.
- `ALLOWED_ORIGINS` (Default: `http://localhost:3000,http://localhost:3001`): Comma-separated list of accepted CORS origins for the WebSocket upgrader.
- `COUNTDOWN_SECONDS` (Default: `10`): How long the safety countdown runs once both parties lock.
- `ROOM_EXPIRY_MINUTES` (Default: `60`): TTL for inactive rooms before the cleanup goroutine deletes them.
- `ROOM_CLEANUP_INTERVAL_SECONDS` (Default: `60`): How often the cleanup routine polls memory for expired/completed rooms.

## Running Locally

Requires Go 1.21+.

```bash
cd services/backend-go
go run cmd/server/main.go
```

The WebSocket server listens on `ws://localhost:8080/ws?wallet=<address>`.

## HTTP Endpoints
- `GET /health`: Returns JSON `{ "status": "ok", "service": "trade-window-backend" }`
- `GET /rooms/:id`: Returns JSON state of a specific room, or `{"error":"room_not_found"}`.

## In-Memory Constraints
All room state is currently stored in application memory. Rooms disappear if the process crashes or restarts. For multi-instance horizontal scaling, a distributed memory store (e.g. Redis pub/sub) must be implemented.
