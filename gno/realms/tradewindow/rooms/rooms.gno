package rooms

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

func CreateRoom(id, partyA, partyB, intentHash string, createdAt, expiresAt int64) string {
	if id == "" {
		panic("empty room ID")
	}
	if partyA == "" || partyB == "" {
		panic("empty party")
	}
	if intentHash == "" {
		panic("empty intent hash")
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

func CancelRoom(id string) string {
	room, exists := activeRooms[id]
	if !exists {
		panic("room not found")
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

func ExpireRoom(id string) string {
	room, exists := activeRooms[id]
	if !exists {
		panic("room not found")
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

func GetRoom(id string) *TradeRoom {
	return activeRooms[id]
}
