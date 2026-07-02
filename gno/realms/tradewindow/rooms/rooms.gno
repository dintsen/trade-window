package rooms

import "chain/runtime/unsafe"

// TradeRoom records the on-chain commitment for a P2P trade session.
// Room status can only be mutated by declared parties.
type TradeRoom struct {
	ID         string
	PartyA     string
	PartyB     string
	IntentHash string
	Status     string
	CreatedAt  int64
	ExpiresAt  int64
}

var activeRooms map[string]*TradeRoom

func init() {
	activeRooms = make(map[string]*TradeRoom)
}

// CreateRoom registers a new trade room on-chain.
// Caller MUST be partyA — the room initiator.
func CreateRoom(id, partyA, partyB, intentHash string, createdAt, expiresAt int64) string {
	caller := string(unsafe.OriginCaller())

	if id == "" {
		panic("empty room ID")
	}
	if partyA == "" || partyB == "" {
		panic("empty party")
	}
	if intentHash == "" {
		panic("empty intent hash")
	}
	// Only partyA can register the room they initiated
	if caller != partyA {
		panic("only partyA can create the room")
	}
	if _, exists := activeRooms[id]; exists {
		panic("duplicate room ID")
	}

	activeRooms[id] = &TradeRoom{
		ID:         id,
		PartyA:     partyA,
		PartyB:     partyB,
		IntentHash: intentHash,
		Status:     "created",
		CreatedAt:  createdAt,
		ExpiresAt:  expiresAt,
	}
	return "created"
}

// CancelRoom cancels a room. Only partyA or partyB can cancel.
func CancelRoom(id string) string {
	caller := string(unsafe.OriginCaller())

	room, exists := activeRooms[id]
	if !exists {
		panic("room not found")
	}
	if caller != room.PartyA && caller != room.PartyB {
		panic("only a party to the trade can cancel the room")
	}
	if room.Status == "completed" {
		panic("cannot cancel completed room")
	}
	if room.Status == "cancelled" || room.Status == "expired" {
		panic("cannot mutate cancelled/expired room")
	}
	room.Status = "cancelled"
	return "cancelled"
}

// ExpireRoom expires a room. Only partyA or partyB can expire.
func ExpireRoom(id string) string {
	caller := string(unsafe.OriginCaller())

	room, exists := activeRooms[id]
	if !exists {
		panic("room not found")
	}
	if caller != room.PartyA && caller != room.PartyB {
		panic("only a party to the trade can expire the room")
	}
	if room.Status == "completed" {
		panic("cannot expire completed room")
	}
	if room.Status == "cancelled" || room.Status == "expired" {
		panic("cannot mutate cancelled/expired room")
	}
	room.Status = "expired"
	return "expired"
}

// GetRoom returns a room by ID (nil if not found).
func GetRoom(id string) *TradeRoom {
	return activeRooms[id]
}
