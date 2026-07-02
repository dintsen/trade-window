package gno

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/tradewindow/backend-go/internal/config"
)

func TestHandleStatusDefaultDisabled(t *testing.T) {
	config.AppConfig = &config.Config{
		GnoChainID:         "gno-testnet",
		GnoEscrowRealmPath: "gno.land/r/tradewindow/escrow",
		GnoDeploymentMode:  "local",
	}

	req := httptest.NewRequest(http.MethodGet, "/api/gno/status", nil)
	rr := httptest.NewRecorder()

	HandleStatus(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", rr.Code)
	}

	var got StatusResponse
	if err := json.NewDecoder(rr.Body).Decode(&got); err != nil {
		t.Fatal(err)
	}
	if got.Status != "disabled" {
		t.Fatalf("expected disabled status, got %q", got.Status)
	}
	if got.SettlementEnabled {
		t.Fatal("settlement should be disabled by default")
	}
	if got.RPCURLConfigured {
		t.Fatal("RPC should be reported as unconfigured")
	}
}

func TestHandleStatusEnabledButMissingRPCIsMisconfigured(t *testing.T) {
	config.AppConfig = &config.Config{
		GnoChainID:           "gno-testnet",
		GnoEscrowRealmPath:   "gno.land/r/tradewindow/escrow",
		GnoSettlementEnabled: true,
		GnoDeploymentMode:    "local",
	}

	req := httptest.NewRequest(http.MethodGet, "/api/gno/status", nil)
	rr := httptest.NewRecorder()

	HandleStatus(rr, req)

	var got StatusResponse
	if err := json.NewDecoder(rr.Body).Decode(&got); err != nil {
		t.Fatal(err)
	}
	if got.Status != "misconfigured" {
		t.Fatalf("expected misconfigured status, got %q", got.Status)
	}
	if !strings.Contains(strings.Join(got.Warnings, " "), "GNO_RPC_URL") {
		t.Fatalf("expected RPC warning, got %v", got.Warnings)
	}
}

func TestHandleStatusConfiguredForLocalTestnet(t *testing.T) {
	config.AppConfig = &config.Config{
		GnoChainID:           "gno-testnet",
		GnoRPCURL:            "http://127.0.0.1:26657",
		GnoEscrowRealmPath:   "gno.land/r/tradewindow/escrow",
		GnoSettlementEnabled: true,
		GnoDeploymentMode:    "local",
	}

	req := httptest.NewRequest(http.MethodGet, "/api/gno/status", nil)
	rr := httptest.NewRecorder()

	HandleStatus(rr, req)

	var got StatusResponse
	if err := json.NewDecoder(rr.Body).Decode(&got); err != nil {
		t.Fatal(err)
	}
	if got.Status != "configured" {
		t.Fatalf("expected configured status, got %q", got.Status)
	}
	if !got.RPCURLConfigured {
		t.Fatal("RPC should be reported as configured")
	}
	if got.BackendRole != "coordination_only" {
		t.Fatalf("backend role should stay coordination_only, got %q", got.BackendRole)
	}
}
