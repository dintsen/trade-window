package board

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"github.com/tradewindow/backend-go/internal/config"
)

func setupTest() (*Storage, *Handlers, func()) {
	config.AppConfig = &config.Config{
		BoardMaxBodyBytes: 1024,
		BoardDefaultTTLDays: 30,
	}
	f, _ := os.CreateTemp("", "board-test-*.jsonl")
	store := NewStorage(f.Name())
	handlers := NewHandlers(store)

	cleanup := func() {
		os.Remove(f.Name())
	}
	return store, handlers, cleanup
}

func TestPostListingValid(t *testing.T) {
	_, h, cleanup := setupTest()
	defer cleanup()

	payload := []byte(`{
		"title": "Looking to swap AON",
		"requestType": "swap",
		"offerAsset": "1000 USDC",
		"wantAsset": "AON",
		"chain": "atomone",
		"privateEmail": "test@test.com",
		"consentAccepted": true
	}`)

	req, _ := http.NewRequest("POST", "/api/board/listings", bytes.NewBuffer(payload))
	rr := httptest.NewRecorder()

	h.HandleListings(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	var resp PublicBoardListing
	json.NewDecoder(rr.Body).Decode(&resp)

	if resp.Title != "Looking to swap AON" {
		t.Errorf("handler returned wrong title: got %v", resp.Title)
	}
	if resp.Status != "open" {
		t.Errorf("status should be open: got %v", resp.Status)
	}
	// Check privacy
	bodyStr := rr.Body.String()
	if bytes.Contains([]byte(bodyStr), []byte("test@test.com")) {
		t.Errorf("Public endpoint leaked private email")
	}
}

func TestPostListingInvalid(t *testing.T) {
	_, h, cleanup := setupTest()
	defer cleanup()

	payloads := []string{
		`{"title": "Missing email", "requestType": "buy", "offerAsset": "A", "wantAsset": "B", "chain": "gno", "consentAccepted": true}`,
		`{"privateEmail": "a@a.com", "requestType": "buy", "offerAsset": "A", "wantAsset": "B", "chain": "gno", "consentAccepted": true}`,
		`{"title": "Bad chain", "requestType": "buy", "offerAsset": "A", "wantAsset": "B", "chain": "invalid", "privateEmail": "a@a.com", "consentAccepted": true}`,
		`{"title": "No consent", "requestType": "buy", "offerAsset": "A", "wantAsset": "B", "chain": "gno", "privateEmail": "a@a.com", "consentAccepted": false}`,
	}

	for _, p := range payloads {
		req, _ := http.NewRequest("POST", "/api/board/listings", bytes.NewBuffer([]byte(p)))
		rr := httptest.NewRecorder()
		h.HandleListings(rr, req)

		if status := rr.Code; status != http.StatusBadRequest {
			t.Errorf("Expected 400 Bad Request for payload %v, got %v", p, status)
		}
	}
}
