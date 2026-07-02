package rooms

import "testing"

const (
	partyA   = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5"
	partyB   = "g1d24j8fwnc0w5q427fauyey4gdd30qgu69k6n0x"
	stranger = "g16jpf0puufcpcjkph5nxueec8etpcldz7zwgydq"
)

func resetRoomsForTest() {
	activeRooms = make(map[string]*TradeRoom)
	testing.SetOriginCaller(address(partyA))
}

func TestCreateRoom(t *testing.T) {
	resetRoomsForTest()

	res := CreateRoom("room1", partyA, partyB, "hash1", 100, 200)
	if res != "created" {
		t.Errorf("Expected 'created', got %s", res)
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on duplicate room")
		}
	}()
	CreateRoom("room1", partyA, partyB, "hash1", 100, 200)
}

func TestRejectEmptyRoomID(t *testing.T) {
	resetRoomsForTest()

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty room ID")
		}
	}()
	CreateRoom("", partyA, partyB, "hash", 100, 200)
}

func TestRejectEmptyParty(t *testing.T) {
	resetRoomsForTest()

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty party")
		}
	}()
	CreateRoom("room2", "", partyB, "hash", 100, 200)
}

func TestRejectEmptyIntentHash(t *testing.T) {
	resetRoomsForTest()

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty intent hash")
		}
	}()
	CreateRoom("room3", partyA, partyB, "", 100, 200)
}

func TestCancelAndExpireRoom(t *testing.T) {
	resetRoomsForTest()

	CreateRoom("room4", partyA, partyB, "hash", 100, 200)
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
	resetRoomsForTest()

	CreateRoom("room5", partyA, partyB, "hash", 100, 200)
	GetRoom("room5").Status = "completed"

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic when cancelling a completed room")
		}
	}()
	CancelRoom("room5")
}

func TestRejectUnauthorizedCreateAndCancel(t *testing.T) {
	resetRoomsForTest()
	testing.SetOriginCaller(address(stranger))

	func() {
		defer func() {
			if r := recover(); r == nil {
				t.Errorf("Did not panic on unauthorized create")
			}
		}()
		CreateRoom("room6", partyA, partyB, "hash", 100, 200)
	}()

	testing.SetOriginCaller(address(partyA))
	CreateRoom("room6", partyA, partyB, "hash", 100, 200)

	testing.SetOriginCaller(address(stranger))
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on unauthorized cancel")
		}
	}()
	CancelRoom("room6")
}
