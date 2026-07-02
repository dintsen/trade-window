package requests

import "time"

type DealRequest struct {
	ID               string    `json:"id"`
	CreatedAt        time.Time `json:"createdAt"`

	Name             string    `json:"name"`
	Email            string    `json:"email"`
	ContactHandle    string    `json:"contactHandle,omitempty"`
	PreferredContact string    `json:"preferredContact,omitempty"`

	RequestType      string    `json:"requestType,omitempty"`
	Summary          string    `json:"summary,omitempty"` // legacy fallback for QA script

	OfferAsset       string    `json:"offerAsset,omitempty"`
	OfferedAsset     string    `json:"offeredAsset,omitempty"` // legacy fallback for QA script
	WantAsset        string    `json:"wantAsset,omitempty"`
	RequestedAsset   string    `json:"requestedAsset,omitempty"` // legacy fallback for QA script
	AmountRange      string    `json:"amountRange,omitempty"`
	Chain            string    `json:"chain,omitempty"`

	Message          string    `json:"message,omitempty"`
	RequesterWallet  string    `json:"requesterWallet,omitempty"`
	ConsentAccepted  bool      `json:"consentAccepted"`
	Status           string    `json:"status"` // open, reviewed, archived
}
