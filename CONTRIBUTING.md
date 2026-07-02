# Contributing to Trade Window

Welcome! To contribute, please follow these guidelines.

## Running Locally

Frontend:
```bash
cd apps/web
npm install
npm run dev
```

Go Backend:
```bash
export PATH="$HOME/.local/go/bin:$PATH"
cd services/backend-go
go run cmd/server/main.go
```

Gno Tests:
```bash
export PATH="$HOME/go/bin:$PATH"
cd gno/realms/tradewindow/rooms && gno test . -v
```

## Guidelines

- All protocol changes require tests.
- Documentation must be updated when behavior changes.
- **Do not** add real signing without explicit approval.
- **Do not** add settlement claims without implementation and tests.
- **Do not** add EVM/Solidity/wagmi/viem/RainbowKit dependencies.
- **Always** preserve attribution and license notices in `NOTICE` and `LICENSE`.

Thank you for your contributions!
