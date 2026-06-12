package rooms

import (
	"testing"
	"time"
)

func TestRoomStateMachine(t *testing.T) {
	r := NewRoom("room-1")

	if r.State != StateLobby {
		t.Fatalf("expected lobby, got %s", r.State)
	}

	err := r.Join("party-a")
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}

	err = r.Join("party-b")
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}

	if r.State != StateActive {
		t.Fatalf("expected active, got %s", r.State)
	}

	// Add asset
	asset := TradeAsset{ID: "1", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "ATONE", BaseDenom: "uatone", TechnicalDenom: "uatone", Amount: "100", Decimals: 6, VerificationStatus: VerifyVerified}
	r.AddAsset("party-a", asset)
	if len(r.OfferA) != 1 {
		t.Fatalf("expected 1 asset for party A")
	}

	// Test lock reset
	r.ToggleLock("party-b", true)
	if !r.LockB {
		t.Fatalf("expected party B to be locked")
	}

	r.AddAsset("party-a", TradeAsset{ID: "2", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "PHOTON", BaseDenom: "uphoton", TechnicalDenom: "uphoton", Amount: "50", Decimals: 6, VerificationStatus: VerifyVerified})
	if r.LockB {
		t.Fatalf("expected party B lock to be reset after party A added asset")
	}

	// Test countdown trigger
	r.ToggleLock("party-a", true)
	r.ToggleLock("party-b", true)

	if r.State != StateLockedCountdown {
		t.Fatalf("expected locked_countdown, got %s", r.State)
	}

	// Test countdown expiration
	r.CountdownAt = time.Now().Add(-1 * time.Second) // force expire
	r.CheckCountdown()
	if r.State != StateReadyToSign {
		t.Fatalf("expected ready_to_sign, got %s", r.State)
	}

	// Test cancel
	r.Cancel()
	if r.State != StateCancelled {
		t.Fatalf("expected cancelled, got %s", r.State)
	}

	// Test add asset rejection during non-active
	err = r.AddAsset("party-a", TradeAsset{ID: "3", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "ATONE", BaseDenom: "uatone", TechnicalDenom: "uatone", Amount: "1", Decimals: 6, VerificationStatus: VerifyVerified})
	if err == nil {
		t.Fatalf("expected error adding asset when cancelled")
	}

	// Test malformed asset
	r2 := NewRoom("room-2")
	r2.Join("party-a")
	r2.Join("party-b")                                   // StateActive
	err = r2.AddAsset("party-a", TradeAsset{Amount: ""}) // Missing required fields
	if err == nil {
		t.Fatalf("expected error adding malformed asset")
	}

	// Test cancel during countdown
	r2.ToggleLock("party-a", true)
	r2.ToggleLock("party-b", true)
	if r2.State != StateLockedCountdown {
		t.Fatalf("expected countdown")
	}
	r2.Cancel()
	if r2.State != StateCancelled {
		t.Fatalf("expected cancelled even during countdown")
	}
	if r2.countdownStarted {
		t.Fatalf("expected countdownStarted to be false after cancel")
	}

	// Test expiry
	r3 := NewRoom("room-3")
	r3.LastActivityAt = time.Now().Add(-61 * time.Minute)
	if !r3.IsExpired(60) {
		t.Fatalf("expected room to be expired")
	}
}

func TestIntentHashStableForSameRoomState(t *testing.T) {
	r := NewRoom("room-stable")
	if err := r.Join("party-a"); err != nil {
		t.Fatalf("join party-a: %v", err)
	}
	if err := r.Join("party-b"); err != nil {
		t.Fatalf("join party-b: %v", err)
	}
	if err := r.AddAsset("party-a", TradeAsset{ID: "a2", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "PHOTON", BaseDenom: "uphoton", TechnicalDenom: "uphoton", Amount: "50", Decimals: 6, VerificationStatus: VerifyVerified}); err != nil {
		t.Fatalf("add asset a2: %v", err)
	}
	if err := r.AddAsset("party-a", TradeAsset{ID: "a1", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "ATONE", BaseDenom: "uatone", TechnicalDenom: "uatone", Amount: "100", Decimals: 6, VerificationStatus: VerifyVerified}); err != nil {
		t.Fatalf("add asset a1: %v", err)
	}
	if err := r.AddAsset("party-b", TradeAsset{ID: "b1", Type: "coin", ChainID: "gno-1", SourceChain: "gno", DisplayDenom: "GNOT", BaseDenom: "ugnot", TechnicalDenom: "ugnot", Amount: "25", Decimals: 6, VerificationStatus: VerifyVerified}); err != nil {
		t.Fatalf("add asset b1: %v", err)
	}

	first := ComputeIntentHash(r.GenerateIntent())
	second := ComputeIntentHash(r.GenerateIntent())
	if first != second {
		t.Fatalf("expected stable hash, got %s and %s", first, second)
	}
}

func TestIntentHashCanonicalAssetOrdering(t *testing.T) {
	first := NewRoom("room-order")
	second := NewRoom("room-order")
	for _, r := range []*Room{first, second} {
		if err := r.Join("party-a"); err != nil {
			t.Fatalf("join party-a: %v", err)
		}
		if err := r.Join("party-b"); err != nil {
			t.Fatalf("join party-b: %v", err)
		}
	}

	atone := TradeAsset{ID: "a1", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "ATONE", BaseDenom: "uatone", TechnicalDenom: "uatone", Amount: "100", Decimals: 6, VerificationStatus: VerifyVerified}
	photon := TradeAsset{ID: "a2", Type: "coin", ChainID: "atomone-1", SourceChain: "atomone", DisplayDenom: "PHOTON", BaseDenom: "uphoton", TechnicalDenom: "uphoton", Amount: "50", Decimals: 6, VerificationStatus: VerifyVerified}

	if err := first.AddAsset("party-a", photon); err != nil {
		t.Fatalf("first photon: %v", err)
	}
	if err := first.AddAsset("party-a", atone); err != nil {
		t.Fatalf("first atone: %v", err)
	}
	if err := second.AddAsset("party-a", atone); err != nil {
		t.Fatalf("second atone: %v", err)
	}
	if err := second.AddAsset("party-a", photon); err != nil {
		t.Fatalf("second photon: %v", err)
	}

	firstHash := ComputeIntentHash(first.GenerateIntent())
	secondHash := ComputeIntentHash(second.GenerateIntent())
	if firstHash != secondHash {
		t.Fatalf("expected canonical ordering to produce same hash, got %s and %s", firstHash, secondHash)
	}
}
