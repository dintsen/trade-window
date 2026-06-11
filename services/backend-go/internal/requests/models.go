package requests

import "time"

type DealRequest struct {
	ID               string    `json:"id"`
	CreatedAt        time.Time `json:"createdAt"`

	Name             string    `json:"name"`
	Email            string    `json:"email"`
	ContactHandle    string    `json:"contactHandle,omitempty"`
	PreferredContact string    `json:"preferredContact,omitempty"`

	RequestType      string    `json:"requestType"`
	OfferAsset       string    `json:"offerAsset"`
	WantAsset        string    `json:"wantAsset"`
	AmountRange      string    `json:"amountRange,omitempty"`
	Chain            string    `json:"chain"`

	Message          string    `json:"message,omitempty"`
	ConsentAccepted  bool      `json:"consentAccepted"`
	Status           string    `json:"status"` // open, reviewed, archived
}
