package rooms

import (
	"testing"
	"time"
)

func readySignRoom(t *testing.T, id string, countdownAt time.Time) *Room {
	t.Helper()
	r := NewRoom(id)
	if err := r.Join("party-a"); err != nil {
		t.Fatalf("join party-a: %v", err)
	}
	if err := r.Join("party-b"); err != nil {
		t.Fatalf("join party-b: %v", err)
	}
	asset := TradeAsset{
		ID: "a1", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone",
		DisplayDenom: "ATONE", BaseDenom: "uatone", TechnicalDenom: "uatone",
		Amount: "100", Decimals: 6, VerificationStatus: VerifyVerified,
	}
	if err := r.AddAsset("party-a", asset); err != nil {
		t.Fatalf("add asset: %v", err)
	}
	if err := r.ToggleLock("party-a", true); err != nil {
		t.Fatalf("lock a: %v", err)
	}
	if err := r.ToggleLock("party-b", true); err != nil {
		t.Fatalf("lock b: %v", err)
	}
	// Force the countdown deadline into the past so CheckCountdown promotes
	// the room to ready_to_sign deterministically.
	r.mu.Lock()
	r.CountdownAt = countdownAt
	r.mu.Unlock()
	r.CheckCountdown()
	if got := r.GetState(); got != StateReadyToSign {
		t.Fatalf("expected ready_to_sign, got %s", got)
	}
	return r
}

func TestIntentIncludesDeterministicExpiry(t *testing.T) {
	countdownAt := time.Date(2026, 7, 1, 12, 0, 0, 0, time.UTC)
	r := readySignRoom(t, "room-expiry", countdownAt)

	intent := r.GenerateIntent()
	if intent.ExpiresAt == "" {
		t.Fatal("expected non-empty ExpiresAt after ready_to_sign")
	}
	parsed, err := time.Parse(time.RFC3339, intent.ExpiresAt)
	if err != nil {
		t.Fatalf("ExpiresAt is not RFC3339: %v", err)
	}
	if !parsed.After(countdownAt) {
		t.Fatalf("expiry %s must be after countdown deadline %s", parsed, countdownAt)
	}

	// Recomputing the intent for the same room state must give the same hash.
	h1 := ComputeIntentHash(intent)
	h2 := ComputeIntentHash(r.GenerateIntent())
	if h1 != h2 {
		t.Fatalf("expiry broke hash stability: %s vs %s", h1, h2)
	}
}

func TestIntentExpiryChangesHash(t *testing.T) {
	r1 := readySignRoom(t, "room-exp-a", time.Date(2026, 7, 1, 12, 0, 0, 0, time.UTC))
	r2 := readySignRoom(t, "room-exp-a", time.Date(2026, 7, 1, 13, 0, 0, 0, time.UTC))

	h1 := ComputeIntentHash(r1.GenerateIntent())
	h2 := ComputeIntentHash(r2.GenerateIntent())
	if h1 == h2 {
		t.Fatal("different expiry must produce a different intent hash")
	}
}

func TestIntentExpiryEmptyBeforeReadyToSign(t *testing.T) {
	r := NewRoom("room-pre-ready")
	if err := r.Join("party-a"); err != nil {
		t.Fatalf("join party-a: %v", err)
	}
	if err := r.Join("party-b"); err != nil {
		t.Fatalf("join party-b: %v", err)
	}
	intent := r.GenerateIntent()
	if intent.ExpiresAt != "" {
		t.Fatalf("expected empty expiry before ready_to_sign, got %q", intent.ExpiresAt)
	}
}
