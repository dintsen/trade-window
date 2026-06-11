package protocol

import "encoding/json"

type WSMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload,omitempty"`
}

type RoomJoinPayload struct {
	RoomID string `json:"roomId"`
}

type ChatPayload struct {
	Message string `json:"message"`
}

type LogPayload struct {
	Message string `json:"message"`
}

type ErrorPayload struct {
	Code        string `json:"code"`
	Message     string `json:"message"`
	Recoverable bool   `json:"recoverable"`
}

const (
	ErrInvalidJSON   = "invalid_json"
	ErrInvalidEvent  = "invalid_event"
	ErrMissingWallet = "missing_wallet"
	ErrInvalidWallet = "invalid_wallet"
	ErrMissingRoom   = "missing_room"
	ErrRoomNotFound  = "room_not_found"
	ErrInvalidParty  = "invalid_party"
	ErrInvalidPayload = "invalid_payload"
	ErrInvalidAsset  = "invalid_asset"
	ErrStateRejected = "state_rejected"
	ErrMessageTooLong = "message_too_long"
	ErrInternalError = "internal_error"
)
