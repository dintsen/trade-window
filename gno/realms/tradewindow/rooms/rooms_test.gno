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

func TestCreateRoom(cur realm, t *testing.T) {
	resetRoomsForTest()

	res := CreateRoom(cross(cur), "room1", partyA, partyB, "hash1", 100, 200)
	if res != "created" {
		t.Errorf("Expected 'created', got %s", res)
	}

	if r := revive(func() { CreateRoom(cross(cur), "room1", partyA, partyB, "hash1", 100, 200) }); r == nil {
		t.Errorf("Did not panic on duplicate room")
	}
}

func TestRejectEmptyRoomID(cur realm, t *testing.T) {
	resetRoomsForTest()

	if r := revive(func() { CreateRoom(cross(cur), "", partyA, partyB, "hash", 100, 200) }); r == nil {
		t.Errorf("Did not panic on empty room ID")
	}
}

func TestRejectEmptyParty(cur realm, t *testing.T) {
	resetRoomsForTest()

	if r := revive(func() { CreateRoom(cross(cur), "room2", "", partyB, "hash", 100, 200) }); r == nil {
		t.Errorf("Did not panic on empty party")
	}
}

func TestRejectEmptyIntentHash(cur realm, t *testing.T) {
	resetRoomsForTest()

	if r := revive(func() { CreateRoom(cross(cur), "room3", partyA, partyB, "", 100, 200) }); r == nil {
		t.Errorf("Did not panic on empty intent hash")
	}
}

func TestCancelAndExpireRoom(cur realm, t *testing.T) {
	resetRoomsForTest()

	CreateRoom(cross(cur), "room4", partyA, partyB, "hash", 100, 200)
	CancelRoom(cross(cur), "room4")
	if GetRoom("room4").Status != "cancelled" {
		t.Errorf("Expected room to be cancelled")
	}

	if r := revive(func() { CancelRoom(cross(cur), "room4") }); r == nil {
		t.Errorf("Did not panic when cancelling cancelled room")
	}
}

func TestCannotCancelCompleted(cur realm, t *testing.T) {
	resetRoomsForTest()

	CreateRoom(cross(cur), "room5", partyA, partyB, "hash", 100, 200)
	GetRoom("room5").Status = "completed"

	if r := revive(func() { CancelRoom(cross(cur), "room5") }); r == nil {
		t.Errorf("Did not panic when cancelling a completed room")
	}
}

func TestRejectUnauthorizedCreateAndCancel(cur realm, t *testing.T) {
	resetRoomsForTest()
	testing.SetOriginCaller(address(stranger))

	if r := revive(func() { CreateRoom(cross(cur), "room6", partyA, partyB, "hash", 100, 200) }); r == nil {
		t.Errorf("Did not panic on unauthorized create")
	}

	testing.SetOriginCaller(address(partyA))
	CreateRoom(cross(cur), "room6", partyA, partyB, "hash", 100, 200)

	testing.SetOriginCaller(address(stranger))
	if r := revive(func() { CancelRoom(cross(cur), "room6") }); r == nil {
		t.Errorf("Did not panic on unauthorized cancel")
	}
}
