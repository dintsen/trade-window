package escrow

import "testing"

const (
	partyA    = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5"
	partyB    = "g1d24j8fwnc0w5q427fauyey4gdd30qgu69k6n0x"
	guarantor = "g16jpf0puufcpcjkph5nxueec8etpcldz7zwgydq"
	stranger  = "g1jrlpk89l5vc6mxy9w5u8gn5ge8ewqa64q7n0pu"
)

func resetEscrowsForTest() {
	deals = make(map[string]*EscrowDeal)
	testing.SetOriginCaller(address(partyA))
}

func createDefaultEscrow(cur realm, id string) {
	CreateEscrow(cross(cur), 
		id,
		"0xabc",
		partyA,
		partyB,
		"coin",
		"uatone",
		100,
		"atomone-1",
		"coin",
		"ugnot",
		25,
		"gno-testnet",
		guarantor,
	)
}

func createDefaultBundleEscrow(cur realm, id string) {
	CreateBundleEscrow(cross(cur), 
		id,
		"0xbundle",
		partyA,
		partyB,
		"atomone-1|coin|uatone|100||stargaze-1|nft|stars19abc:42|1",
		"gno-testnet|coin|ugnot|25",
		2,
		1,
		guarantor,
	)
}

func createDefaultVerifiedExchange(cur realm, id string) {
	CreateVerifiedExchange(cross(cur), 
		id,
		"0xexchange",
		partyA,
		partyB,
		"coin",
		"ATONE",
		"uatone",
		100,
		"atomone-1",
		"verified",
		"atone1sender",
		"atone1receiver",
		"uphoton",
		5000,
		"coin",
		"GNOT",
		"ugnot",
		25,
		"gno-testnet",
		"verified",
		"g1sender",
		"g1receiver",
		"ugnot",
		1,
		guarantor,
	)
}

func TestCreateFundApproveRelease(cur realm, t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow(cur, "escrow1")

	if GetStatus("escrow1") != StatusCreated {
		t.Errorf("Expected created status")
	}

	if res := MarkFunded(cross(cur), "escrow1"); res != StatusFunding {
		t.Errorf("Expected funding after first deposit, got %s", res)
	}

	testing.SetOriginCaller(address(partyB))
	if res := MarkFunded(cross(cur), "escrow1"); res != StatusFunded {
		t.Errorf("Expected funded after both deposits, got %s", res)
	}

	if res := ApproveRelease(cross(cur), "escrow1"); res != "release_pending" {
		t.Errorf("Expected release_pending, got %s", res)
	}

	testing.SetOriginCaller(address(partyA))
	if res := ApproveRelease(cross(cur), "escrow1"); res != "release_ready" {
		t.Errorf("Expected release_ready, got %s", res)
	}

	if !IsReleaseReady("escrow1") {
		t.Errorf("Expected release-ready escrow")
	}
	if res := Release(cross(cur), "escrow1"); res != StatusReleased {
		t.Errorf("Expected released, got %s", res)
	}
}

func TestCreateBundleEscrowStoresBothOfferDigests(cur realm, t *testing.T) {
	resetEscrowsForTest()
	createDefaultBundleEscrow(cur, "bundle1")

	deal := GetEscrow("bundle1")
	if deal.OfferACount != 2 || deal.OfferBCount != 1 {
		t.Errorf("Expected bundle counts to be stored")
	}
	if deal.OfferADigest == "" || deal.OfferBDigest == "" {
		t.Errorf("Expected bundle digests to be stored")
	}
}

func TestCreateVerifiedExchangeStoresSettlementAndFundingProofs(cur realm, t *testing.T) {
	resetEscrowsForTest()
	createDefaultVerifiedExchange(cur, "exchange1")

	deal := GetEscrow("exchange1")
	if deal.AssetA.DisplayDenom != "ATONE" || deal.AssetA.ReceiverAddress != "atone1receiver" {
		t.Errorf("Expected partyA settlement asset to be stored")
	}
	if deal.AssetB.DisplayDenom != "GNOT" || deal.AssetB.FeeDenom != "ugnot" {
		t.Errorf("Expected partyB settlement asset to be stored")
	}

	if res := MarkFundedWithProof(cross(cur), "exchange1", "atomone-txhash"); res != StatusFunding {
		t.Errorf("Expected funding after first proof, got %s", res)
	}
	if GetEscrow("exchange1").FundingProofA != "atomone-txhash" {
		t.Errorf("Expected partyA funding proof")
	}

	testing.SetOriginCaller(address(partyB))
	if res := MarkFundedWithProof(cross(cur), "exchange1", "gno-txhash"); res != StatusFunded {
		t.Errorf("Expected funded after both proofs, got %s", res)
	}
}

func TestRejectFakeVerifiedKnownTickerInExchange(cur realm, t *testing.T) {
	resetEscrowsForTest()

	r := revive(func() {
		CreateVerifiedExchange(cross(cur),
		"fake1",
		"0xfake",
		partyA,
		partyB,
		"coin",
		"ATOM",
		"uatone",
		100,
		"atomone-1",
		"verified",
		"atone1sender",
		"atone1receiver",
		"uphoton",
		5000,
		"coin",
		"GNOT",
		"ugnot",
		25,
		"gno-testnet",
		"verified",
		"g1sender",
		"g1receiver",
		"ugnot",
		1,
		guarantor,
	)
	})
	if r == nil {
		t.Errorf("Did not panic on fake verified ticker")
	}
}

func TestAllowExplicitSuspiciousKnownTickerMismatchInExchange(cur realm, t *testing.T) {
	resetEscrowsForTest()

	res := CreateVerifiedExchange(cross(cur), 
		"suspicious1",
		"0xsuspicious",
		partyA,
		partyB,
		"coin",
		"ATOM",
		"uatone",
		100,
		"atomone-1",
		"suspicious",
		"atone1sender",
		"atone1receiver",
		"uphoton",
		5000,
		"coin",
		"GNOT",
		"ugnot",
		25,
		"gno-testnet",
		"verified",
		"g1sender",
		"g1receiver",
		"ugnot",
		1,
		guarantor,
	)
	if res != StatusCreated {
		t.Errorf("Expected suspicious exchange to be created as risky intent")
	}
}

func TestRejectUnauthorizedCreateAndFund(cur realm, t *testing.T) {
	resetEscrowsForTest()
	testing.SetOriginCaller(address(stranger))

	if r := revive(func() { createDefaultEscrow(cur, "escrow2") }); r == nil {
		t.Errorf("Did not panic on unauthorized create")
	}

	testing.SetOriginCaller(address(partyA))
	createDefaultEscrow(cur, "escrow2")

	testing.SetOriginCaller(address(stranger))
	if r := revive(func() { MarkFunded(cross(cur), "escrow2") }); r == nil {
		t.Errorf("Did not panic on unauthorized funding")
	}
}

func TestRejectReleaseBeforeBothApprovals(cur realm, t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow(cur, "escrow3")
	MarkFunded(cross(cur), "escrow3")
	testing.SetOriginCaller(address(partyB))
	MarkFunded(cross(cur), "escrow3")
	ApproveRelease(cross(cur), "escrow3")

	if r := revive(func() { Release(cross(cur), "escrow3") }); r == nil {
		t.Errorf("Did not panic on one-sided release")
	}
}

func TestCancelBeforeFullyFunded(cur realm, t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow(cur, "escrow4")
	MarkFunded(cross(cur), "escrow4")

	if res := CancelBeforeFunding(cross(cur), "escrow4"); res != StatusCancelled {
		t.Errorf("Expected cancelled, got %s", res)
	}
}

func TestDisputeRequiresGuarantorResolution(cur realm, t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow(cur, "escrow5")
	MarkFunded(cross(cur), "escrow5")
	testing.SetOriginCaller(address(partyB))
	MarkFunded(cross(cur), "escrow5")

	if res := OpenDispute(cross(cur), "escrow5", "counterparty did not confirm receipt"); res != StatusDisputed {
		t.Errorf("Expected disputed, got %s", res)
	}

	if r := revive(func() { Refund(cross(cur), "escrow5") }); r == nil {
		t.Errorf("Did not panic on party refunding disputed escrow")
	}

	testing.SetOriginCaller(address(guarantor))
	if res := Refund(cross(cur), "escrow5"); res != StatusRefunded {
		t.Errorf("Expected refunded, got %s", res)
	}
}
