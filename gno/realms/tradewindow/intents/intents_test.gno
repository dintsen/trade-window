package intents

import "testing"

func TestCreateCommitment(t *testing.T) {
	res := CreateCommitment("intent1", "hashXYZ", "partyA", "partyB")
	if res != "committed" {
		t.Errorf("Expected 'committed', got %s", res)
	}

	commit := GetCommitment("intent1")
	if commit.IntentHash != "hashXYZ" {
		t.Errorf("Stored hash mismatch")
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on duplicate intent ID")
		}
	}()
	CreateCommitment("intent1", "hashXYZ", "partyA", "partyB")
}

func TestRejectEmptyHash(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty hash")
		}
	}()
	CreateCommitment("intent2", "", "partyA", "partyB")
}

func TestRejectEmptyParty(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty party")
		}
	}()
	CreateCommitment("intent3", "hash", "", "partyB")
}
