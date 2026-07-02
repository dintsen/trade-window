// Package auth provides a minimal nonce-based wallet authentication scaffold.
//
// STATUS: MVP scaffold — nonces are issued and stored in-memory (non-persistent).
// Signature verification is NOT yet implemented; the /api/auth/verify endpoint
// returns 501 Not Implemented and explains what is required.
//
// Planned next step: integrate cosmos/amino or ADR-036 arbitrary-message signing
// so the client can prove wallet ownership without exposing private keys.
package auth

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

// nonceRecord holds a pending nonce and its expiry.
type nonceRecord struct {
	Nonce     string
	ExpiresAt time.Time
}

var (
	mu     sync.Mutex
	nonces = map[string]nonceRecord{} // keyed by wallet address
)

// purgeExpired removes stale nonces (called on every request to avoid leaks).
func purgeExpired() {
	now := time.Now()
	for addr, r := range nonces {
		if now.After(r.ExpiresAt) {
			delete(nonces, addr)
		}
	}
}

// HandleNonce issues a fresh nonce for a wallet address.
//
//	POST /api/auth/nonce
//	Body: {"wallet": "cosmos1..."}
//	Response: {"wallet": "cosmos1...", "nonce": "abc123...", "message": "Sign this nonce to authenticate..."}
func HandleNonce(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		Wallet string `json:"wallet"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Wallet == "" {
		http.Error(w, `{"error":"wallet_required"}`, http.StatusBadRequest)
		return
	}

	// Generate 32-byte random nonce
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		http.Error(w, `{"error":"nonce_generation_failed"}`, http.StatusInternalServerError)
		return
	}
	nonce := hex.EncodeToString(b)

	mu.Lock()
	purgeExpired()
	nonces[body.Wallet] = nonceRecord{
		Nonce:     nonce,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}
	mu.Unlock()

	msg := "Trade Window authentication\nWallet: " + body.Wallet + "\nNonce: " + nonce + "\nThis signature proves wallet ownership. No funds are moved."

	json.NewEncoder(w).Encode(map[string]string{
		"wallet":  body.Wallet,
		"nonce":   nonce,
		"message": msg,
	})
}

// HandleVerify is the signature verification endpoint.
//
//	POST /api/auth/verify
//	Body: {"wallet": "cosmos1...", "signature": "<base64>", "pub_key": "<base64>"}
//	Response: 501 Not Implemented with explanation.
//
// STATUS: Planned — requires ADR-036 or Amino signature verification.
// The nonce is consumed regardless to prevent replay.
func HandleVerify(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		Wallet    string `json:"wallet"`
		Signature string `json:"signature"`
		PubKey    string `json:"pub_key"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Wallet == "" {
		http.Error(w, `{"error":"wallet_required"}`, http.StatusBadRequest)
		return
	}

	// Consume nonce regardless (prevents replay even if verify is partial)
	mu.Lock()
	purgeExpired()
	record, exists := nonces[body.Wallet]
	if exists {
		delete(nonces, body.Wallet)
	}
	mu.Unlock()

	if !exists || time.Now().After(record.ExpiresAt) {
		http.Error(w, `{"error":"nonce_expired_or_not_found","hint":"Call POST /api/auth/nonce first"}`, http.StatusBadRequest)
		return
	}

	// Signature verification not yet implemented.
	// Required: verify that signature covers the message from HandleNonce
	// using the provided pub_key and the cosmos/amino or ADR-036 scheme.
	w.WriteHeader(http.StatusNotImplemented)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "not_implemented",
		"reason": "Signature verification requires ADR-036 or Amino integration. Nonce has been consumed.",
	})
}
