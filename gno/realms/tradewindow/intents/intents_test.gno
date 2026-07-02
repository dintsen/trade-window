package intents

import "testing"

const (
	partyA   = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5"
	partyB   = "g1d24j8fwnc0w5q427fauyey4gdd30qgu69k6n0x"
	stranger = "g16jpf0puufcpcjkph5nxueec8etpcldz7zwgydq"
)

func resetCommitmentsForTest() {
	commitments = make(map[string]*IntentCommitment)
	testing.SetOriginCaller(address(partyA))
}

func TestCreateCommitment(t *testing.T) {
	resetCommitmentsForTest()

	res := CreateCommitment("intent1", "hashXYZ", partyA, partyB)
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
	CreateCommitment("intent1", "hashXYZ", partyA, partyB)
}

func TestRejectEmptyHash(t *testing.T) {
	resetCommitmentsForTest()

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty hash")
		}
	}()
	CreateCommitment("intent2", "", partyA, partyB)
}

func TestRejectEmptyParty(t *testing.T) {
	resetCommitmentsForTest()

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty party")
		}
	}()
	CreateCommitment("intent3", "hash", "", partyB)
}

func TestDualSignedCommitment(t *testing.T) {
	resetCommitmentsForTest()

	if res := CreateCommitment("intent4", "hash", partyA, partyB); res != "committed" {
		t.Errorf("Expected committed, got %s", res)
	}
	if IsDualSigned("intent4") {
		t.Errorf("Intent should not be dual-signed after one party")
	}

	testing.SetOriginCaller(address(partyB))
	if res := CreateCommitment("intent4", "hash", partyA, partyB); res != "co-signed" {
		t.Errorf("Expected co-signed, got %s", res)
	}
	if !IsDualSigned("intent4") {
		t.Errorf("Intent should be dual-signed")
	}
}

func TestRejectUnauthorizedCommitment(t *testing.T) {
	resetCommitmentsForTest()
	testing.SetOriginCaller(address(stranger))

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on unauthorized commitment")
		}
	}()
	CreateCommitment("intent5", "hash", partyA, partyB)
}

func TestRejectHashMismatchOnCosign(t *testing.T) {
	resetCommitmentsForTest()

	CreateCommitment("intent6", "hash-one", partyA, partyB)
	testing.SetOriginCaller(address(partyB))

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on hash mismatch")
		}
	}()
	CreateCommitment("intent6", "hash-two", partyA, partyB)
}
