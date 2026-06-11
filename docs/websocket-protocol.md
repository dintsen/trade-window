# Trade Window WebSocket Protocol

## Connection
`ws://<host>/ws?wallet=<address>`
- `wallet` is required.
- Requires valid CORS origin for the upgrade.

## Core Flow
1. User connects (`wallet` param binds to `Address`).
2. `room:create` or `room:join`.
3. Receive `room:state` broadcasts continuously.
4. `offer:add` -> modifies assets.
5. `trade:lock` -> locks state. Both locked = 10s countdown.
6. `countdown:tick` -> visual timer.
7. `trade:ready_to_sign` -> final intent hash.

## Error Handling
Any invalid payload or state-forbidden action returns:
```json
{
  "type": "trade:error",
  "payload": {
    "code": "invalid_payload",
    "message": "Detailed reason",
    "recoverable": true
  }
}
```

### Known Error Codes
- `invalid_json`
- `invalid_event`
- `missing_wallet`
- `invalid_wallet`
- `missing_room`
- `room_not_found`
- `invalid_party`
- `invalid_payload`
- `invalid_asset`
- `state_rejected`
- `message_too_long`
- `internal_error`

## Payloads
- `chat:message` max length is 500 characters.
- Assets must contain valid string `amount` and `displayDenom`.
