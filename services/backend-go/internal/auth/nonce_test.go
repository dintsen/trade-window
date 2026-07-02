package auth

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestVerifyDoesNotEchoConsumedNonce(t *testing.T) {
	nonces = map[string]nonceRecord{}

	nonceReq := httptest.NewRequest(
		http.MethodPost,
		"/api/auth/nonce",
		bytes.NewBufferString(`{"wallet":"g1testwallet"}`),
	)
	nonceRR := httptest.NewRecorder()
	HandleNonce(nonceRR, nonceReq)
	if nonceRR.Code != http.StatusOK {
		t.Fatalf("expected nonce request to pass, got %d", nonceRR.Code)
	}

	verifyReq := httptest.NewRequest(
		http.MethodPost,
		"/api/auth/verify",
		bytes.NewBufferString(`{"wallet":"g1testwallet","signature":"placeholder","pub_key":"placeholder"}`),
	)
	verifyRR := httptest.NewRecorder()
	HandleVerify(verifyRR, verifyReq)

	body := verifyRR.Body.String()
	if strings.Contains(body, "nonce_was") || strings.Contains(body, "Trade Window authentication") {
		t.Fatalf("verify response should not echo nonce material, got %s", body)
	}
}
