package gno

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/tradewindow/backend-go/internal/config"
)

type StatusResponse struct {
	Status             string   `json:"status"`
	BackendRole        string   `json:"backend_role"`
	ChainID            string   `json:"chain_id"`
	RPCURLConfigured   bool     `json:"rpc_url_configured"`
	EscrowRealmPath    string   `json:"escrow_realm_path"`
	SettlementEnabled  bool     `json:"settlement_enabled"`
	DeploymentMode     string   `json:"deployment_mode"`
	Warnings           []string `json:"warnings"`
	UnsupportedActions []string `json:"unsupported_actions"`
}

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	cfg := config.AppConfig
	if cfg == nil {
		config.Init()
		cfg = config.AppConfig
	}

	status := "disabled"
	warnings := []string{}
	rpcConfigured := strings.TrimSpace(cfg.GnoRPCURL) != ""
	realmConfigured := strings.TrimSpace(cfg.GnoEscrowRealmPath) != ""

	if cfg.GnoSettlementEnabled {
		if rpcConfigured && realmConfigured {
			status = "configured"
			warnings = append(warnings, "Gno settlement is experimental and must remain local/testnet-gated.")
		} else {
			status = "misconfigured"
			warnings = append(warnings, "Gno settlement flag is enabled but GNO_RPC_URL or GNO_ESCROW_REALM_PATH is missing.")
		}
	} else {
		warnings = append(warnings, "Gno settlement is disabled; backend exposes readiness status only.")
	}
	if !rpcConfigured {
		warnings = append(warnings, "GNO_RPC_URL is not configured, so backend cannot target a Gno node.")
	}

	response := StatusResponse{
		Status:            status,
		BackendRole:       "coordination_only",
		ChainID:           cfg.GnoChainID,
		RPCURLConfigured:  rpcConfigured,
		EscrowRealmPath:   cfg.GnoEscrowRealmPath,
		SettlementEnabled: cfg.GnoSettlementEnabled,
		DeploymentMode:    cfg.GnoDeploymentMode,
		Warnings:          warnings,
		UnsupportedActions: []string{
			"mainnet custody",
			"server-side wallet signing",
			"cross-chain atomic settlement",
			"NFT transfer execution",
		},
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
