package board

import "time"

type BoardListing struct {
	ID              string    `json:"id"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	ExpiresAt       time.Time `json:"expiresAt"`

	Status          string    `json:"status"` // open, closed, expired, hidden

	Title           string    `json:"title"`
	RequestType     string    `json:"requestType,omitempty"` // buy, sell, swap, otc_bundle, nft_game_rwa, other
	Side            string    `json:"side,omitempty"`        // legacy fallback for QA script

	OfferAsset      string    `json:"offerAsset,omitempty"`
	BaseAsset       string    `json:"baseAsset,omitempty"`   // legacy fallback for QA script
	WantAsset       string    `json:"wantAsset,omitempty"`
	QuoteAsset      string    `json:"quoteAsset,omitempty"`  // legacy fallback for QA script
	AmountRange     string    `json:"amountRange,omitempty"`
	Amount          string    `json:"amount,omitempty"`      // legacy fallback for QA script
	Chain           string    `json:"chain,omitempty"`       // gno, atomone, cosmos_ibc, other

	PublicMessage   string    `json:"publicMessage,omitempty"`
	Terms           string    `json:"terms,omitempty"`       // legacy fallback for QA script

	PublicContact   string    `json:"publicContact,omitempty"`
	ContactMethod   string    `json:"contactMethod,omitempty"`

	PrivateEmail    string    `json:"privateEmail,omitempty"`
	PrivateName     string    `json:"privateName,omitempty"`

	CreatorWallet   string    `json:"creatorWallet,omitempty"`

	ConsentAccepted bool      `json:"consentAccepted"`
}

type PublicBoardListing struct {
	ID            string    `json:"id"`
	CreatedAt     time.Time `json:"createdAt"`
	ExpiresAt     time.Time `json:"expiresAt"`
	Status        string    `json:"status"`
	Title         string    `json:"title"`
	RequestType   string    `json:"requestType"`
	OfferAsset    string    `json:"offerAsset"`
	WantAsset     string    `json:"wantAsset"`
	AmountRange   string    `json:"amountRange,omitempty"`
	Chain         string    `json:"chain"`
	PublicMessage string    `json:"publicMessage,omitempty"`
	PublicContact string    `json:"publicContact,omitempty"`
	ContactMethod string    `json:"contactMethod,omitempty"`
	CreatorWallet string    `json:"creatorWallet,omitempty"`
}

func (l *BoardListing) ToPublic() PublicBoardListing {
	return PublicBoardListing{
		ID:            l.ID,
		CreatedAt:     l.CreatedAt,
		ExpiresAt:     l.ExpiresAt,
		Status:        l.Status,
		Title:         l.Title,
		RequestType:   l.RequestType,
		OfferAsset:    l.OfferAsset,
		WantAsset:     l.WantAsset,
		AmountRange:   l.AmountRange,
		Chain:         l.Chain,
		PublicMessage: l.PublicMessage,
		PublicContact: l.PublicContact,
		ContactMethod: l.ContactMethod,
		CreatorWallet: l.CreatorWallet,
	}
}
