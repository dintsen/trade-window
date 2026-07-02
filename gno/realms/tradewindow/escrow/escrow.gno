package escrow

import "chain/runtime/unsafe"

const (
	StatusCreated   = "created"
	StatusFunding   = "funding"
	StatusFunded    = "funded"
	StatusDisputed  = "disputed"
	StatusReleased  = "released"
	StatusRefunded  = "refunded"
	StatusCancelled = "cancelled"
)

type EscrowAsset struct {
	AssetType          string
	DisplayDenom       string
	Denom              string
	Amount             int64
	ChainID            string
	VerificationStatus string
	SenderAddress      string
	ReceiverAddress    string
	FeeDenom           string
	FeeAmount          int64
}

type EscrowDeal struct {
	ID               string
	IntentHash       string
	PartyA           string
	PartyB           string
	Guarantor        string
	AssetA           EscrowAsset
	AssetB           EscrowAsset
	OfferADigest     string
	OfferBDigest     string
	OfferACount      int64
	OfferBCount      int64
	FundedA          bool
	FundedB          bool
	ReleaseApprovedA bool
	ReleaseApprovedB bool
	FundingProofA    string
	FundingProofB    string
	Status           string
	DisputedBy       string
	DisputeReason    string
}

var deals map[string]*EscrowDeal

func init() {
	deals = make(map[string]*EscrowDeal)
}

func caller() string {
	return string(unsafe.OriginCaller())
}

func CreateEscrow(
	cur realm,
	id string,
	intentHash string,
	partyA string,
	partyB string,
	assetTypeA string,
	denomA string,
	amountA int64,
	chainIDA string,
	assetTypeB string,
	denomB string,
	amountB int64,
	chainIDB string,
	guarantor string,
) string {
	if id == "" {
		panic("empty escrow ID")
	}
	if intentHash == "" {
		panic("empty intent hash")
	}
	if partyA == "" || partyB == "" {
		panic("empty party")
	}
	if partyA == partyB {
		panic("parties must differ")
	}
	if assetTypeA == "" || denomA == "" || chainIDA == "" || amountA <= 0 {
		panic("invalid partyA asset")
	}
	if assetTypeB == "" || denomB == "" || chainIDB == "" || amountB <= 0 {
		panic("invalid partyB asset")
	}
	if caller() != partyA {
		panic("only partyA can create escrow")
	}
	if _, exists := deals[id]; exists {
		panic("duplicate escrow ID")
	}

	deals[id] = &EscrowDeal{
		ID:         id,
		IntentHash: intentHash,
		PartyA:     partyA,
		PartyB:     partyB,
		Guarantor:  guarantor,
		AssetA: EscrowAsset{
			AssetType:          assetTypeA,
			DisplayDenom:       denomA,
			Denom:              denomA,
			Amount:             amountA,
			ChainID:            chainIDA,
			VerificationStatus: "unknown",
		},
		AssetB: EscrowAsset{
			AssetType:          assetTypeB,
			DisplayDenom:       denomB,
			Denom:              denomB,
			Amount:             amountB,
			ChainID:            chainIDB,
			VerificationStatus: "unknown",
		},
		Status: StatusCreated,
	}
	return StatusCreated
}

func CreateVerifiedExchange(
	cur realm,
	id string,
	intentHash string,
	partyA string,
	partyB string,
	assetTypeA string,
	displayDenomA string,
	denomA string,
	amountA int64,
	chainIDA string,
	verificationStatusA string,
	senderA string,
	receiverA string,
	feeDenomA string,
	feeAmountA int64,
	assetTypeB string,
	displayDenomB string,
	denomB string,
	amountB int64,
	chainIDB string,
	verificationStatusB string,
	senderB string,
	receiverB string,
	feeDenomB string,
	feeAmountB int64,
	guarantor string,
) string {
	if id == "" {
		panic("empty escrow ID")
	}
	if intentHash == "" {
		panic("empty intent hash")
	}
	if partyA == "" || partyB == "" {
		panic("empty party")
	}
	if partyA == partyB {
		panic("parties must differ")
	}
	if caller() != partyA {
		panic("only partyA can create exchange")
	}
	if _, exists := deals[id]; exists {
		panic("duplicate escrow ID")
	}

	assetA := EscrowAsset{
		AssetType:          assetTypeA,
		DisplayDenom:       displayDenomA,
		Denom:              denomA,
		Amount:             amountA,
		ChainID:            chainIDA,
		VerificationStatus: verificationStatusA,
		SenderAddress:      senderA,
		ReceiverAddress:    receiverA,
		FeeDenom:           feeDenomA,
		FeeAmount:          feeAmountA,
	}
	assetB := EscrowAsset{
		AssetType:          assetTypeB,
		DisplayDenom:       displayDenomB,
		Denom:              denomB,
		Amount:             amountB,
		ChainID:            chainIDB,
		VerificationStatus: verificationStatusB,
		SenderAddress:      senderB,
		ReceiverAddress:    receiverB,
		FeeDenom:           feeDenomB,
		FeeAmount:          feeAmountB,
	}

	validateExchangeAsset(assetA)
	validateExchangeAsset(assetB)

	deals[id] = &EscrowDeal{
		ID:         id,
		IntentHash: intentHash,
		PartyA:     partyA,
		PartyB:     partyB,
		Guarantor:  guarantor,
		AssetA:     assetA,
		AssetB:     assetB,
		Status:     StatusCreated,
	}
	return StatusCreated
}

func CreateBundleEscrow(
	cur realm,
	id string,
	intentHash string,
	partyA string,
	partyB string,
	offerADigest string,
	offerBDigest string,
	offerACount int64,
	offerBCount int64,
	guarantor string,
) string {
	if id == "" {
		panic("empty escrow ID")
	}
	if intentHash == "" {
		panic("empty intent hash")
	}
	if partyA == "" || partyB == "" {
		panic("empty party")
	}
	if partyA == partyB {
		panic("parties must differ")
	}
	if offerADigest == "" || offerBDigest == "" {
		panic("empty offer digest")
	}
	if offerACount <= 0 || offerBCount <= 0 {
		panic("empty offer side")
	}
	if caller() != partyA {
		panic("only partyA can create escrow")
	}
	if _, exists := deals[id]; exists {
		panic("duplicate escrow ID")
	}

	deals[id] = &EscrowDeal{
		ID:           id,
		IntentHash:   intentHash,
		PartyA:       partyA,
		PartyB:       partyB,
		Guarantor:    guarantor,
		OfferADigest: offerADigest,
		OfferBDigest: offerBDigest,
		OfferACount:  offerACount,
		OfferBCount:  offerBCount,
		Status:       StatusCreated,
	}
	return StatusCreated
}

func MarkFunded(cur realm, id string) string {
	return markFunded(id, "")
}

func MarkFundedWithProof(cur realm, id string, fundingProof string) string {
	if fundingProof == "" {
		panic("empty funding proof")
	}
	return markFunded(id, fundingProof)
}

func markFunded(id string, fundingProof string) string {
	deal := mustGet(id)
	requireOpen(deal)
	c := caller()

	if c == deal.PartyA {
		if deal.FundedA {
			panic("partyA already funded")
		}
		deal.FundedA = true
		deal.FundingProofA = fundingProof
	} else if c == deal.PartyB {
		if deal.FundedB {
			panic("partyB already funded")
		}
		deal.FundedB = true
		deal.FundingProofB = fundingProof
	} else {
		panic("only a party can mark funded")
	}

	if deal.FundedA && deal.FundedB {
		deal.Status = StatusFunded
		return StatusFunded
	}
	deal.Status = StatusFunding
	return StatusFunding
}

func validateExchangeAsset(asset EscrowAsset) {
	if asset.AssetType != "coin" && asset.AssetType != "nft" && asset.AssetType != "unknown" {
		panic("invalid asset type")
	}
	if asset.DisplayDenom == "" || asset.Denom == "" || asset.ChainID == "" || asset.Amount <= 0 {
		panic("invalid asset identity")
	}
	if asset.SenderAddress == "" || asset.ReceiverAddress == "" {
		panic("missing settlement address")
	}
	if asset.FeeDenom == "" || asset.FeeAmount < 0 {
		panic("invalid fee")
	}
	if asset.VerificationStatus != "verified" &&
		asset.VerificationStatus != "unverified" &&
		asset.VerificationStatus != "unknown" &&
		asset.VerificationStatus != "suspicious" {
		panic("invalid verification status")
	}

	expected := knownSymbol(asset.ChainID, asset.Denom)
	if expected != "" {
		if asset.VerificationStatus == "verified" &&
			asset.DisplayDenom != expected &&
			asset.DisplayDenom != asset.Denom {
			panic("verified asset display denom mismatch")
		}
		return
	}

	if knownDisplayDenom(asset.DisplayDenom) {
		if asset.VerificationStatus != "suspicious" {
			panic("known ticker mismatch must be suspicious")
		}
		return
	}

	if asset.VerificationStatus == "verified" {
		panic("unknown asset cannot be verified")
	}
}

func knownSymbol(chainID string, denom string) string {
	if chainID == "gno-testnet" && denom == "ugnot" {
		return "GNOT"
	}
	if chainID == "atomone-1" && denom == "uatone" {
		return "ATONE"
	}
	if chainID == "atomone-1" && denom == "uphoton" {
		return "PHOTON"
	}
	if chainID == "cosmoshub-4" && denom == "uatom" {
		return "ATOM"
	}
	if chainID == "stargaze-1" && denom == "ustars" {
		return "STARS"
	}
	return ""
}

func knownDisplayDenom(displayDenom string) bool {
	return displayDenom == "GNOT" ||
		displayDenom == "ATONE" ||
		displayDenom == "PHOTON" ||
		displayDenom == "ATOM" ||
		displayDenom == "STARS"
}

func ApproveRelease(cur realm, id string) string {
	deal := mustGet(id)
	if deal.Status != StatusFunded {
		panic("escrow is not fully funded")
	}
	c := caller()

	if c == deal.PartyA {
		if deal.ReleaseApprovedA {
			panic("partyA already approved release")
		}
		deal.ReleaseApprovedA = true
	} else if c == deal.PartyB {
		if deal.ReleaseApprovedB {
			panic("partyB already approved release")
		}
		deal.ReleaseApprovedB = true
	} else {
		panic("only a party can approve release")
	}

	if IsReleaseReady(id) {
		return "release_ready"
	}
	return "release_pending"
}

func Release(cur realm, id string) string {
	deal := mustGet(id)
	if deal.Status != StatusFunded && deal.Status != StatusDisputed {
		panic("escrow cannot be released")
	}
	c := caller()
	if deal.Status == StatusFunded {
		if !deal.ReleaseApprovedA || !deal.ReleaseApprovedB {
			panic("release requires both party approvals")
		}
		if c != deal.PartyA && c != deal.PartyB {
			panic("only a party can release approved escrow")
		}
	} else {
		if deal.Guarantor == "" || c != deal.Guarantor {
			panic("only guarantor can release disputed escrow")
		}
	}
	deal.Status = StatusReleased
	return StatusReleased
}

func CancelBeforeFunding(cur realm, id string) string {
	deal := mustGet(id)
	if caller() != deal.PartyA && caller() != deal.PartyB {
		panic("only a party can cancel")
	}
	if deal.FundedA && deal.FundedB {
		panic("cannot cancel fully funded escrow")
	}
	requireOpen(deal)
	deal.Status = StatusCancelled
	return StatusCancelled
}

func OpenDispute(cur realm, id string, reason string) string {
	deal := mustGet(id)
	if reason == "" {
		panic("empty dispute reason")
	}
	if deal.Status != StatusFunded {
		panic("only funded escrow can be disputed")
	}
	c := caller()
	if c != deal.PartyA && c != deal.PartyB {
		panic("only a party can dispute")
	}
	deal.Status = StatusDisputed
	deal.DisputedBy = c
	deal.DisputeReason = reason
	return StatusDisputed
}

func Refund(cur realm, id string) string {
	deal := mustGet(id)
	c := caller()
	if deal.Status == StatusDisputed {
		if deal.Guarantor == "" || c != deal.Guarantor {
			panic("only guarantor can refund disputed escrow")
		}
	} else {
		if c != deal.PartyA && c != deal.PartyB {
			panic("only a party can refund open escrow")
		}
		if deal.FundedA && deal.FundedB {
			panic("fully funded escrow requires dispute resolution")
		}
		requireOpen(deal)
	}
	deal.Status = StatusRefunded
	return StatusRefunded
}

func GetEscrow(id string) *EscrowDeal {
	return deals[id]
}

func GetStatus(id string) string {
	return mustGet(id).Status
}

func IsReleaseReady(id string) bool {
	deal := mustGet(id)
	return deal.Status == StatusFunded && deal.ReleaseApprovedA && deal.ReleaseApprovedB
}

func mustGet(id string) *EscrowDeal {
	deal, exists := deals[id]
	if !exists {
		panic("escrow not found")
	}
	return deal
}

func requireOpen(deal *EscrowDeal) {
	if deal.Status == StatusReleased || deal.Status == StatusRefunded || deal.Status == StatusCancelled {
		panic("escrow is finalized")
	}
}
