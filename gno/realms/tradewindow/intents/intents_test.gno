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

func TestCreateCommitment(cur realm, t *testing.T) {
	resetCommitmentsForTest()

	res := CreateCommitment(cross(cur), "intent1", "hashXYZ", partyA, partyB)
	if res != "committed" {
		t.Errorf("Expected 'committed', got %s", res)
	}

	commit := GetCommitment("intent1")
	if commit.IntentHash != "hashXYZ" {
		t.Errorf("Stored hash mismatch")
	}

	if r := revive(func() { CreateCommitment(cross(cur), "intent1", "hashXYZ", partyA, partyB) }); r == nil {
		t.Errorf("Did not panic on duplicate intent ID")
	}
}

func TestRejectEmptyHash(cur realm, t *testing.T) {
	resetCommitmentsForTest()

	if r := revive(func() { CreateCommitment(cross(cur), "intent2", "", partyA, partyB) }); r == nil {
		t.Errorf("Did not panic on empty hash")
	}
}

func TestRejectEmptyParty(cur realm, t *testing.T) {
	resetCommitmentsForTest()

	if r := revive(func() { CreateCommitment(cross(cur), "intent3", "hash", "", partyB) }); r == nil {
		t.Errorf("Did not panic on empty party")
	}
}

func TestDualSignedCommitment(cur realm, t *testing.T) {
	resetCommitmentsForTest()

	if res := CreateCommitment(cross(cur), "intent4", "hash", partyA, partyB); res != "committed" {
		t.Errorf("Expected committed, got %s", res)
	}
	if IsDualSigned("intent4") {
		t.Errorf("Intent should not be dual-signed after one party")
	}

	testing.SetOriginCaller(address(partyB))
	if res := CreateCommitment(cross(cur), "intent4", "hash", partyA, partyB); res != "co-signed" {
		t.Errorf("Expected co-signed, got %s", res)
	}
	if !IsDualSigned("intent4") {
		t.Errorf("Intent should be dual-signed")
	}
}

func TestRejectUnauthorizedCommitment(cur realm, t *testing.T) {
	resetCommitmentsForTest()
	testing.SetOriginCaller(address(stranger))

	if r := revive(func() { CreateCommitment(cross(cur), "intent5", "hash", partyA, partyB) }); r == nil {
		t.Errorf("Did not panic on unauthorized commitment")
	}
}

func TestRejectHashMismatchOnCosign(cur realm, t *testing.T) {
	resetCommitmentsForTest()

	CreateCommitment(cross(cur), "intent6", "hash-one", partyA, partyB)
	testing.SetOriginCaller(address(partyB))

	if r := revive(func() { CreateCommitment(cross(cur), "intent6", "hash-two", partyA, partyB) }); r == nil {
		t.Errorf("Did not panic on hash mismatch")
	}
}
