package rooms

import (
	"errors"
	"sync"
	"time"

	"github.com/tradewindow/backend-go/internal/config"
)

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
	
	if asset.Amount == "" || asset.DisplayDenom == "" {
		return errors.New("invalid asset payload")
	}

	if party == r.PartyA {
		r.OfferA = append(r.OfferA, asset)
		if r.LockB {
			r.LockB = false 
		}
	} else if party == r.PartyB {
		r.OfferB = append(r.OfferB, asset)
		if r.LockA {
			r.LockA = false 
		}
	} else {
		return errors.New("unauthorized party")
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

func (r *Room) Cancel() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.touch()
	if r.State != StateCompleted && r.State != StateExpired {
		r.State = StateCancelled
		r.countdownStarted = false
	}
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
