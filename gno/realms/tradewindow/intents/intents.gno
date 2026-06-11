package intents

type IntentCommitment struct {
	IntentID   string
	IntentHash string
	PartyA     string
	PartyB     string
}

var commitments map[string]*IntentCommitment

func init() {
	commitments = make(map[string]*IntentCommitment)
}

func CreateCommitment(id, intentHash, partyA, partyB string) string {
	if id == "" {
		panic("empty intent ID")
	}
	if intentHash == "" {
		panic("empty intent hash")
	}
	if partyA == "" || partyB == "" {
		panic("empty party address")
	}
	if _, exists := commitments[id]; exists {
		panic("duplicate intent ID")
	}

	commitments[id] = &IntentCommitment{
		IntentID:   id,
		IntentHash: intentHash,
		PartyA:     partyA,
		PartyB:     partyB,
	}
	return "committed"
}

func GetCommitment(id string) *IntentCommitment {
	return commitments[id]
}
