package ws

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/tradewindow/backend-go/internal/config"
	"github.com/tradewindow/backend-go/internal/protocol"
	"github.com/tradewindow/backend-go/internal/rooms"
)

type Hub struct {
	mu          sync.Mutex
	Rooms       map[string]*rooms.Room
	Clients     map[*Client]bool
	RoomClients map[string]map[*Client]bool
	Register    chan *Client
	Unregister  chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Rooms:       make(map[string]*rooms.Room),
		Clients:     make(map[*Client]bool),
		RoomClients: make(map[string]map[*Client]bool),
		Register:    make(chan *Client),
		Unregister:  make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client] = true
			h.mu.Unlock()
		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				if client.Send != nil {
					close(client.Send)
				}
				if client.RoomID != "" {
					if rc, exists := h.RoomClients[client.RoomID]; exists {
						delete(rc, client)
					}
					h.broadcastLogNoLock(client.RoomID, fmt.Sprintf("%s disconnected", client.Address))
				}
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) RunCleanup() {
	interval := time.Duration(60) * time.Second
	if config.AppConfig != nil {
		interval = time.Duration(config.AppConfig.RoomCleanupIntervalSeconds) * time.Second
	}
	ticker := time.NewTicker(interval)
	for range ticker.C {
		h.cleanupRooms()
	}
}

func (h *Hub) cleanupRooms() {
	h.mu.Lock()
	defer h.mu.Unlock()

	expiryMinutes := 60
	if config.AppConfig != nil {
		expiryMinutes = config.AppConfig.RoomExpiryMinutes
	}

	for id, room := range h.Rooms {
		if room.IsExpired(expiryMinutes) {
			room.MarkExpired()
			delete(h.Rooms, id)
			delete(h.RoomClients, id)
			continue
		}
		
		state := room.GetState()
		if state == rooms.StateCancelled || state == rooms.StateCompleted || state == rooms.StateExpired {
			// Room is dead, clean it up after a brief grace period or instantly
			// For MVP, if it was already marked as cancelled/completed, we clean it up on next tick
			delete(h.Rooms, id)
			delete(h.RoomClients, id)
		}
	}
}

func (h *Hub) GetRoom(roomID string) (*rooms.Room, bool) {
	h.mu.Lock()
	defer h.mu.Unlock()
	r, exists := h.Rooms[roomID]
	return r, exists
}

func (h *Hub) BroadcastRoomState(roomID string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	room, ok := h.Rooms[roomID]
	if !ok {
		return
	}
	clients := h.RoomClients[roomID]
	for c := range clients {
		c.SendJSON("room:state", room)
	}
}

func (h *Hub) broadcastLogNoLock(roomID, msg string) {
	clients := h.RoomClients[roomID]
	for c := range clients {
		c.SendJSON("system:log", protocol.LogPayload{Message: msg})
	}
}

func (h *Hub) broadcastLog(roomID, msg string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.broadcastLogNoLock(roomID, msg)
}

func (h *Hub) ProcessMessage(c *Client, msg protocol.WSMessage) {
	h.mu.Lock()
	room := h.Rooms[c.RoomID]
	h.mu.Unlock()

	switch msg.Type {
	case "room:create":
		h.mu.Lock()
		id := fmt.Sprintf("room-%d", len(h.Rooms)+1)
		r := rooms.NewRoom(id)
		h.Rooms[id] = r
		h.RoomClients[id] = make(map[*Client]bool)
		h.RoomClients[id][c] = true
		h.mu.Unlock()
		c.RoomID = id

		r.Join(c.Address)
		h.broadcastLog(id, fmt.Sprintf("Room %s created by %s", id, c.Address))
		h.BroadcastRoomState(id)

	case "room:join":
		var p protocol.RoomJoinPayload
		if err := json.Unmarshal(msg.Payload, &p); err != nil {
			c.SendError(protocol.ErrInvalidPayload, "Invalid room join payload")
			return
		}
		
		h.mu.Lock()
		r, exists := h.Rooms[p.RoomID]
		h.mu.Unlock()
		if !exists {
			c.SendError(protocol.ErrRoomNotFound, "Room not found")
			return
		}
		
		err := r.Join(c.Address)
		if err != nil {
			c.SendError(protocol.ErrStateRejected, err.Error())
			return
		}
		
		c.RoomID = p.RoomID
		h.mu.Lock()
		h.RoomClients[p.RoomID][c] = true
		h.mu.Unlock()
		
		h.broadcastLog(p.RoomID, fmt.Sprintf("%s joined the room", c.Address))
		h.BroadcastRoomState(p.RoomID)

	case "offer:add":
		if room == nil {
			c.SendError(protocol.ErrMissingRoom, "Not in a room")
			return
		}
		var p struct {
			Asset rooms.TradeAsset `json:"asset"`
		}
		if err := json.Unmarshal(msg.Payload, &p); err != nil {
			c.SendError(protocol.ErrInvalidPayload, "Invalid asset payload")
			return
		}
		
		wasLocked := room.LockA || room.LockB
		err := room.AddAsset(c.Address, p.Asset)
		if err != nil {
			c.SendError(protocol.ErrStateRejected, err.Error())
			return
		}
		
		if wasLocked && (!room.LockA && !room.LockB) {
			h.broadcastLog(room.ID, "WARNING: Offer changed. Locks reset.")
		}
		h.broadcastLog(room.ID, fmt.Sprintf("%s added asset: %s %s", c.Address, p.Asset.Amount, p.Asset.DisplayDenom))
		h.BroadcastRoomState(room.ID)

	case "trade:lock":
		if room == nil {
			c.SendError(protocol.ErrMissingRoom, "Not in a room")
			return
		}
		err := room.ToggleLock(c.Address, true)
		if err != nil {
			c.SendError(protocol.ErrStateRejected, err.Error())
			return
		}
		h.broadcastLog(room.ID, fmt.Sprintf("%s locked their offer", c.Address))
		h.BroadcastRoomState(room.ID)
		
		if room.StartCountdown() {
			h.broadcastLog(room.ID, "Both parties locked. Safety countdown started.")
			go h.runCountdown(room)
		}

	case "trade:cancel":
		if room == nil {
			c.SendError(protocol.ErrMissingRoom, "Not in a room")
			return
		}
		room.Cancel()
		h.broadcastLog(room.ID, fmt.Sprintf("Trade cancelled by %s.", c.Address))
		h.BroadcastRoomState(room.ID)

	case "chat:message":
		if room == nil {
			c.SendError(protocol.ErrMissingRoom, "Not in a room")
			return
		}
		var p protocol.ChatPayload
		if err := json.Unmarshal(msg.Payload, &p); err != nil {
			c.SendError(protocol.ErrInvalidPayload, "Invalid chat payload")
			return
		}
		
		if len(p.Message) > 500 {
			c.SendError(protocol.ErrMessageTooLong, "Message exceeds 500 character limit")
			return
		}
		
		h.mu.Lock()
		clients := h.RoomClients[room.ID]
		h.mu.Unlock()
		for rc := range clients {
			rc.SendJSON("chat:message", map[string]string{"sender": c.Address, "message": p.Message})
		}
		
	default:
		c.SendError(protocol.ErrInvalidEvent, fmt.Sprintf("Unknown event type: %s", msg.Type))
	}
}

func (h *Hub) runCountdown(room *rooms.Room) {
	seconds := 10
	if config.AppConfig != nil {
		seconds = config.AppConfig.CountdownSeconds
	}
	
	for i := seconds; i > 0; i-- {
		if room.GetState() != rooms.StateLockedCountdown {
			return
		}
		
		h.mu.Lock()
		clients := h.RoomClients[room.ID]
		h.mu.Unlock()
		for c := range clients {
			c.SendJSON("countdown:tick", map[string]int{"seconds": i})
		}
		
		time.Sleep(1 * time.Second)
	}
	
	room.CheckCountdown()
	if room.GetState() == rooms.StateReadyToSign {
		h.broadcastLog(room.ID, "Countdown complete. Ready for final intent review and signing.")
		h.BroadcastRoomState(room.ID)
		
		intent := room.GenerateIntent()
		hash := rooms.ComputeIntentHash(intent)
		h.mu.Lock()
		clients := h.RoomClients[room.ID]
		h.mu.Unlock()
		for c := range clients {
			c.SendJSON("trade:ready_to_sign", map[string]string{"intentHash": hash})
		}
	}
}
