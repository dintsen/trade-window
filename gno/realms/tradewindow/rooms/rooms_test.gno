package rooms

import "testing"

func TestCreateRoom(t *testing.T) {
	res := CreateRoom("room1", "partyA", "partyB", "hash1", 100, 200)
	if res != "created" {
		t.Errorf("Expected 'created', got %s", res)
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on duplicate room")
		}
	}()
	CreateRoom("room1", "partyA", "partyB", "hash1", 100, 200)
}

func TestRejectEmptyRoomID(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty room ID")
		}
	}()
	CreateRoom("", "partyA", "partyB", "hash", 100, 200)
}

func TestRejectEmptyParty(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty party")
		}
	}()
	CreateRoom("room2", "", "partyB", "hash", 100, 200)
}

func TestRejectEmptyIntentHash(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty intent hash")
		}
	}()
	CreateRoom("room3", "partyA", "partyB", "", 100, 200)
}

func TestCancelAndExpireRoom(t *testing.T) {
	CreateRoom("room4", "partyA", "partyB", "hash", 100, 200)
	CancelRoom("room4")
	if GetRoom("room4").Status != "cancelled" {
		t.Errorf("Expected room to be cancelled")
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic when cancelling cancelled room")
		}
	}()
	CancelRoom("room4") // should panic
}

func TestCannotCancelCompleted(t *testing.T) {
	CreateRoom("room5", "partyA", "partyB", "hash", 100, 200)
	GetRoom("room5").Status = "completed"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic when cancelling a completed room")
		}
	}()
	CancelRoom("room5")
}
