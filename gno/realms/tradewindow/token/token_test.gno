package token

import "testing"

func TestDepositAndLock(t *testing.T) {
	Deposit("user1", 100)
	esc := escrows["user1"]
	if esc.Amount != 100 {
		t.Errorf("Expected Amount 100, got %d", esc.Amount)
	}
	Lock("user1")
	if esc.Locked != true {
		t.Errorf("Expected Locked true")
	}
}
