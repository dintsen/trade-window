package intents

import "std"

// IntentCommitment records a signed agreement between two parties.
// Both parties must independently call CreateCommitment with the same
// intentHash — only then is the commitment considered dual-signed.
type IntentCommitment struct {
	IntentID    string
	IntentHash  string
	PartyA      string
	PartyB      string
	SignedByA   bool
	SignedByB   bool
}

var commitments map[string]*IntentCommitment

func init() {
	commitments = make(map[string]*IntentCommitment)
}

// CreateCommitment records an intent commitment.
// The caller MUST be either partyA or partyB — no third party can commit.
// Both parties must call this independently; only when both have signed
// is the intent considered fully committed.
func CreateCommitment(id, intentHash, partyA, partyB string) string {
	caller := std.GetOrigCaller().String()

	if id == "" {
		panic("empty intent ID")
	}
	if intentHash == "" {
		panic("empty intent hash")
	}
	if partyA == "" || partyB == "" {
		panic("empty party address")
	}
	// Caller must be one of the declared parties
	if caller != partyA && caller != partyB {
		panic("caller is not a party to this intent")
	}

	existing, exists := commitments[id]
	if exists {
		// Allow the second party to co-sign, but hash must match
		if existing.IntentHash != intentHash {
			panic("intent hash mismatch — possible tampering")
		}
		if existing.PartyA != partyA || existing.PartyB != partyB {
			panic("party addresses mismatch — possible tampering")
		}
		if caller == partyA {
			if existing.SignedByA {
				panic("partyA already signed")
			}
			existing.SignedByA = true
		} else {
			if existing.SignedByB {
				panic("partyB already signed")
			}
			existing.SignedByB = true
		}
		return "co-signed"
	}

	c := &IntentCommitment{
		IntentID:   id,
		IntentHash: intentHash,
		PartyA:     partyA,
		PartyB:     partyB,
	}
	if caller == partyA {
		c.SignedByA = true
	} else {
		c.SignedByB = true
	}
	commitments[id] = c
	return "committed"
}

// GetCommitment returns the commitment for an ID (nil if not found).
func GetCommitment(id string) *IntentCommitment {
	return commitments[id]
}

// IsDualSigned returns true when both parties have independently committed.
func IsDualSigned(id string) bool {
	c, exists := commitments[id]
	if !exists {
		return false
	}
	return c.SignedByA && c.SignedByB
}
