# Production Deployment Checklist

## Supabase/Postgres
- create production Postgres database;
- copy `DATABASE_URL`;
- run migration:
```txt
services/backend-go/migrations/001_create_trade_window_tables.sql
```

## Backend hosting
Deploy Go backend with env:
```env
PORT=8080
ALLOWED_ORIGINS=https://tradewindow.xyz,https://www.tradewindow.xyz
MAX_WS_MESSAGE_BYTES=16384
STORAGE_DRIVER=postgres
DATABASE_URL=<set in hosting provider>
GNO_CHAIN_ID=gno-testnet
GNO_RPC_URL=<local-or-testnet-gno-rpc-when-approved>
GNO_ESCROW_REALM_PATH=gno.land/r/tradewindow/escrow
GNO_DEPLOYMENT_MODE=testnet
GNO_SETTLEMENT_ENABLED=false
```

## Frontend Vercel env
```env
NEXT_PUBLIC_API_URL=https://api.tradewindow.xyz
NEXT_PUBLIC_WS_URL=wss://api.tradewindow.xyz/ws
NEXT_PUBLIC_ENABLE_ADENA=true
NEXT_PUBLIC_ENABLE_GNO_TX_PREVIEW=true
NEXT_PUBLIC_ENABLE_GNO_TESTNET_TRANSFERS=false
NEXT_PUBLIC_ENABLE_GNO_MAINNET_TRANSFERS=false
```

## Gno status check
After backend deploy, verify:
```txt
GET https://api.tradewindow.xyz/api/gno/status
```

Expected before testnet realm deployment:
```json
{
  "status": "disabled",
  "backend_role": "coordination_only",
  "settlement_enabled": false
}
```

## DNS
Configure:
```txt
api.tradewindow.xyz -> backend hosting target
```
