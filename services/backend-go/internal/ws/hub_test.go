package ws

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/tradewindow/backend-go/internal/protocol"
	"github.com/tradewindow/backend-go/internal/rooms"
)

func TestHubProcessMessage(t *testing.T) {
	hub := NewHub()

	clientA := &Client{Hub: hub, Address: "atone1mockA", ClientID: "client-a", Send: make(chan []byte, 10)}
	clientB := &Client{Hub: hub, Address: "atone1mockB", ClientID: "client-b", Send: make(chan []byte, 10)}

	hub.Clients[clientA] = true
	hub.Clients[clientB] = true

	// Test create room
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "room:create"})
	if clientA.RoomID == "" {
		t.Fatal("expected RoomID to be set on clientA")
	}

	roomID := clientA.RoomID
	r := hub.Rooms[roomID]
	if r.State != rooms.StateActive {
		t.Fatalf("expected state active (partyA joined), got %s", r.State)
	}

	// Test join room
	payloadBytes, _ := json.Marshal(protocol.RoomJoinPayload{RoomID: roomID})
	hub.ProcessMessage(clientB, protocol.WSMessage{Type: "room:join", Payload: payloadBytes})
	if clientB.RoomID != roomID {
		t.Fatal("expected clientB to join room")
	}
	if r.PartyB != "atone1mockB" {
		t.Fatal("expected PartyB to be atone1mockB")
	}

	// Test append-only add asset
	assetBytes, _ := json.Marshal(map[string]interface{}{
		"asset": rooms.TradeAsset{ID: "asset-1", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", TechnicalDenom: "uatone", BaseDenom: "uatone", Amount: "100", DisplayDenom: "ATONE", Decimals: 6, VerificationStatus: rooms.VerifyVerified},
	})
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "offer:add", Payload: assetBytes})
	if len(r.OfferA) != 1 {
		t.Fatal("expected OfferA to have 1 asset")
	}

	// Test lock
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "trade:lock"})
	if !r.LockA {
		t.Fatal("expected LockA to be true")
	}

	// Test lock reset
	assetBytes2, _ := json.Marshal(map[string]interface{}{
		"asset": rooms.TradeAsset{ID: "asset-2", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", TechnicalDenom: "uphoton", BaseDenom: "uphoton", Amount: "50", DisplayDenom: "PHOTON", Decimals: 6, VerificationStatus: rooms.VerifyVerified},
	})
	hub.ProcessMessage(clientB, protocol.WSMessage{Type: "offer:add", Payload: assetBytes2})
	if r.LockA {
		t.Fatal("expected LockA to reset to false after B added asset")
	}

	// Test double lock starts countdown
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "trade:lock"})
	hub.ProcessMessage(clientB, protocol.WSMessage{Type: "trade:lock"})
	if r.State != rooms.StateLockedCountdown {
		t.Fatalf("expected locked_countdown state, got %s", r.State)
	}

	// We sleep briefly to let the countdown goroutine start, then cancel
	time.Sleep(100 * time.Millisecond)

	// Test cancel during countdown
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "trade:cancel"})
	if r.State != rooms.StateCancelled {
		t.Fatalf("expected cancelled state, got %s", r.State)
	}

	// Test invalid party rejected
	clientC := &Client{Hub: hub, Address: "atone1mockC", ClientID: "client-c", RoomID: roomID, Send: make(chan []byte, 10)}
	hub.RoomClients[roomID] = make(map[*Client]bool)
	hub.RoomClients[roomID][clientC] = true
	hub.ProcessMessage(clientC, protocol.WSMessage{Type: "offer:add", Payload: assetBytes})
	if len(r.OfferA) != 1 {
		t.Fatal("offer count should not change")
	}

	// Test invalid event type
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "unknown:event"})

	// Test message too long
	longMsg := make([]byte, 600)
	for i := range longMsg {
		longMsg[i] = 'a'
	}
	chatPayload, _ := json.Marshal(protocol.ChatPayload{Message: string(longMsg)})
	hub.ProcessMessage(clientA, protocol.WSMessage{Type: "chat:message", Payload: chatPayload})

	// Ensure these bad messages didn't crash us and we still have the room
	if hub.Rooms[roomID] == nil {
		t.Fatal("hub should still have room after invalid messages")
	}

	// Drain send channels to avoid deadlock in cleanup
	close(clientA.Send)
	close(clientB.Send)
	close(clientC.Send)
}

func TestHubCleanup(t *testing.T) {
	hub := NewHub()
	r1 := rooms.NewRoom("r1")
	r1.State = rooms.StateCancelled

	r2 := rooms.NewRoom("r2")
	r2.State = rooms.StateActive

	r3 := rooms.NewRoom("r3")
	r3.LastActivityAt = time.Now().Add(-120 * time.Minute)

	hub.Rooms["r1"] = r1
	hub.Rooms["r2"] = r2
	hub.Rooms["r3"] = r3

	hub.cleanupRooms()

	if hub.Rooms["r1"] != nil {
		t.Fatal("expected r1 to be cleaned up (cancelled)")
	}
	if hub.Rooms["r2"] == nil {
		t.Fatal("expected r2 to remain (active)")
	}
	if hub.Rooms["r3"] != nil {
		t.Fatal("expected r3 to be cleaned up (expired)")
	}
}
