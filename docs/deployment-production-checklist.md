# Production Deployment Checklist

## Frontend Vercel env
NEXT_PUBLIC_API_URL=https://api.tradewindow.xyz
NEXT_PUBLIC_WS_URL=wss://api.tradewindow.xyz/ws
NEXT_PUBLIC_ENABLE_ADENA=true
NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW=true
NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS=false
NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS=false

## Backend env
PORT=8080
ALLOWED_ORIGINS=https://tradewindow.xyz,https://www.tradewindow.xyz
MAX_WS_MESSAGE_BYTES=16384

## Required next infrastructure
- Deploy Go backend.
- Configure api.tradewindow.xyz DNS.
- Add persistent storage later if board/request data must survive restarts.
- Install Gno tooling locally and/or in CI.
