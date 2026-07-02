package token

import "testing"

func TestDepositAndLock(cur realm, t *testing.T) {
	Deposit(cross(cur), "user1", 100)
	esc := escrows["user1"]
	if esc.Amount != 100 {
		t.Errorf("Expected Amount 100, got %d", esc.Amount)
	}
	Lock(cross(cur), "user1")
	if esc.Locked != true {
		t.Errorf("Expected Locked true")
	}
}
