package rooms

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"strings"
	"sync"
	"time"

	"github.com/tradewindow/backend-go/internal/config"
)

const maxAssetsPerOffer = 20

// GenerateRoomID returns a cryptographically random room ID.
func GenerateRoomID() string {
	b := make([]byte, 8)
	if _, err := rand.Read(b); err != nil {
		panic("failed to generate room ID: " + err.Error())
	}
	return "room-" + hex.EncodeToString(b)
}

type RoomState string

const (
	StateLobby           RoomState = "lobby"
	StateActive          RoomState = "active"
	StateLockedCountdown RoomState = "locked_countdown"
	StateReadyToSign     RoomState = "ready_to_sign"
	StateCancelled       RoomState = "cancelled"
	StateCompleted       RoomState = "completed"
	StateExpired         RoomState = "expired"
)

type VerificationStatus string

const (
	VerifyVerified   VerificationStatus = "verified"
	VerifyUnverified VerificationStatus = "unverified"
	VerifyUnknown    VerificationStatus = "unknown"
	VerifySuspicious VerificationStatus = "suspicious"
)

type TradeAsset struct {
	ID                 string             `json:"id"`
	Type               string             `json:"type"`
	ChainID            string             `json:"chainId"`
	SourceChain        string             `json:"sourceChain"`
	DisplayDenom       string             `json:"displayDenom"`
	BaseDenom          string             `json:"baseDenom"`
	TechnicalDenom     string             `json:"technicalDenom"`
	Amount             string             `json:"amount"`
	Decimals           int                `json:"decimals"`
	IbcTrace           string             `json:"ibcTrace"`
	VerificationStatus VerificationStatus `json:"verificationStatus"`
	VerificationReason string             `json:"verificationReason"`
	Metadata           string             `json:"metadata"`
}

type Room struct {
	mu sync.Mutex

	ID             string       `json:"id"`
	State          RoomState    `json:"state"`
	PartyA         string       `json:"partyA"`
	PartyB         string       `json:"partyB"`
	OfferA         []TradeAsset `json:"offerA"`
	OfferB         []TradeAsset `json:"offerB"`
	LockA          bool         `json:"lockA"`
	LockB          bool         `json:"lockB"`
	CountdownAt    time.Time    `json:"countdownAt"`
	LastActivityAt time.Time    `json:"-"`

	countdownStarted bool
}

func NewRoom(id string) *Room {
	return &Room{
		ID:             id,
		State:          StateLobby,
		OfferA:         []TradeAsset{},
		OfferB:         []TradeAsset{},
		LastActivityAt: time.Now(),
	}
}

func (r *Room) touch() {
	r.LastActivityAt = time.Now()
}

func (r *Room) IsExpired(maxAgeMinutes int) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	return time.Since(r.LastActivityAt).Minutes() > float64(maxAgeMinutes)
}

func (r *Room) Join(party string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.touch()

	if r.State != StateLobby && r.State != StateActive {
		return errors.New("room is not joinable")
	}

	if r.PartyA == "" {
		r.PartyA = party
	} else if r.PartyB == "" && r.PartyA != party {
		r.PartyB = party
	}

	if r.PartyA != "" && r.PartyB != "" && r.State == StateLobby {
		r.State = StateActive
	} else if r.PartyA != "" && r.State == StateLobby {
		r.State = StateActive
	}
	return nil
}

func (r *Room) AddAsset(party string, asset TradeAsset) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.touch()

	if r.State != StateActive {
		return errors.New("cannot add assets unless room is active")
	}

	if err := ValidateTradeAsset(asset); err != nil {
		return err
	}

	if party == r.PartyA {
		if len(r.OfferA) >= maxAssetsPerOffer {
			return errors.New("offer limit reached: max 20 assets per side")
		}
		r.OfferA = append(r.OfferA, asset)
		r.LockA = false
		r.LockB = false
	} else if party == r.PartyB {
		if len(r.OfferB) >= maxAssetsPerOffer {
			return errors.New("offer limit reached: max 20 assets per side")
		}
		r.OfferB = append(r.OfferB, asset)
		r.LockA = false
		r.LockB = false
	} else {
		return errors.New("unauthorized party")
	}

	return nil
}

func ValidateTradeAsset(asset TradeAsset) error {
	if strings.TrimSpace(asset.ID) == "" || len(asset.ID) > 128 {
		return errors.New("invalid asset id")
	}
	if asset.Type != "coin" && asset.Type != "nft" && asset.Type != "unknown" {
		return errors.New("invalid asset type")
	}
	if strings.TrimSpace(asset.Amount) == "" || len(asset.Amount) > 80 {
		return errors.New("invalid asset amount")
	}
	if strings.TrimSpace(asset.DisplayDenom) == "" || len(asset.DisplayDenom) > 80 {
		return errors.New("invalid asset display denom")
	}
	if strings.TrimSpace(asset.TechnicalDenom) == "" || len(asset.TechnicalDenom) > 256 {
		return errors.New("invalid asset technical denom")
	}
	if strings.TrimSpace(asset.ChainID) == "" || len(asset.ChainID) > 128 {
		return errors.New("invalid asset chain id")
	}
	if strings.TrimSpace(asset.SourceChain) == "" || len(asset.SourceChain) > 128 {
		return errors.New("invalid asset source chain")
	}
	if asset.Decimals < 0 || asset.Decimals > 30 {
		return errors.New("invalid asset decimals")
	}
	switch asset.VerificationStatus {
	case VerifyVerified, VerifyUnverified, VerifyUnknown, VerifySuspicious:
	default:
		return errors.New("invalid asset verification status")
	}
	if len(asset.Metadata) > 2048 {
		return errors.New("asset metadata too large")
	}
	if len(asset.IbcTrace) > 512 {
		return errors.New("asset ibc trace too large")
	}
	return nil
}

func (r *Room) ToggleLock(party string, lock bool) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.touch()

	if r.State != StateActive && r.State != StateLockedCountdown {
		return errors.New("can only lock or unlock in active or countdown states")
	}

	// If unlocking during countdown, it breaks the countdown
	if !lock && r.State == StateLockedCountdown {
		r.State = StateActive
		r.countdownStarted = false
	}

	if party == r.PartyA {
		r.LockA = lock
	} else if party == r.PartyB {
		r.LockB = lock
	} else {
		return errors.New("unauthorized party")
	}

	if r.LockA && r.LockB && r.State == StateActive {
		r.State = StateLockedCountdown
		seconds := 10
		if config.AppConfig != nil {
			seconds = config.AppConfig.CountdownSeconds
		}
		r.CountdownAt = time.Now().Add(time.Duration(seconds) * time.Second)
	}

	return nil
}

// Cancel transitions the room to cancelled state.
// party must be PartyA or PartyB; returns error if unauthorized.
func (r *Room) Cancel(party string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.touch()
	if party != r.PartyA && party != r.PartyB {
		return errors.New("only a trade party can cancel")
	}
	if r.State == StateCompleted || r.State == StateExpired {
		return errors.New("room is already finalized")
	}
	r.State = StateCancelled
	r.countdownStarted = false
	return nil
}

// StartCountdown returns true if this caller should run the countdown loop
func (r *Room) StartCountdown() bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.State != StateLockedCountdown {
		return false
	}

	if r.countdownStarted {
		return false
	}

	r.countdownStarted = true
	return true
}

func (r *Room) CheckCountdown() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.touch()

	if r.State == StateLockedCountdown && time.Now().After(r.CountdownAt) {
		r.State = StateReadyToSign
	}
}

func (r *Room) GetState() RoomState {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.State
}

func (r *Room) MarkExpired() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.State = StateExpired
}
