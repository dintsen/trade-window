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

func createDefaultEscrow(id string) {
	CreateEscrow(
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

func createDefaultBundleEscrow(id string) {
	CreateBundleEscrow(
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

func createDefaultVerifiedExchange(id string) {
	CreateVerifiedExchange(
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

func TestCreateFundApproveRelease(t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow("escrow1")

	if GetStatus("escrow1") != StatusCreated {
		t.Errorf("Expected created status")
	}

	if res := MarkFunded("escrow1"); res != StatusFunding {
		t.Errorf("Expected funding after first deposit, got %s", res)
	}

	testing.SetOriginCaller(address(partyB))
	if res := MarkFunded("escrow1"); res != StatusFunded {
		t.Errorf("Expected funded after both deposits, got %s", res)
	}

	if res := ApproveRelease("escrow1"); res != "release_pending" {
		t.Errorf("Expected release_pending, got %s", res)
	}

	testing.SetOriginCaller(address(partyA))
	if res := ApproveRelease("escrow1"); res != "release_ready" {
		t.Errorf("Expected release_ready, got %s", res)
	}

	if !IsReleaseReady("escrow1") {
		t.Errorf("Expected release-ready escrow")
	}
	if res := Release("escrow1"); res != StatusReleased {
		t.Errorf("Expected released, got %s", res)
	}
}

func TestCreateBundleEscrowStoresBothOfferDigests(t *testing.T) {
	resetEscrowsForTest()
	createDefaultBundleEscrow("bundle1")

	deal := GetEscrow("bundle1")
	if deal.OfferACount != 2 || deal.OfferBCount != 1 {
		t.Errorf("Expected bundle counts to be stored")
	}
	if deal.OfferADigest == "" || deal.OfferBDigest == "" {
		t.Errorf("Expected bundle digests to be stored")
	}
}

func TestCreateVerifiedExchangeStoresSettlementAndFundingProofs(t *testing.T) {
	resetEscrowsForTest()
	createDefaultVerifiedExchange("exchange1")

	deal := GetEscrow("exchange1")
	if deal.AssetA.DisplayDenom != "ATONE" || deal.AssetA.ReceiverAddress != "atone1receiver" {
		t.Errorf("Expected partyA settlement asset to be stored")
	}
	if deal.AssetB.DisplayDenom != "GNOT" || deal.AssetB.FeeDenom != "ugnot" {
		t.Errorf("Expected partyB settlement asset to be stored")
	}

	if res := MarkFundedWithProof("exchange1", "atomone-txhash"); res != StatusFunding {
		t.Errorf("Expected funding after first proof, got %s", res)
	}
	if GetEscrow("exchange1").FundingProofA != "atomone-txhash" {
		t.Errorf("Expected partyA funding proof")
	}

	testing.SetOriginCaller(address(partyB))
	if res := MarkFundedWithProof("exchange1", "gno-txhash"); res != StatusFunded {
		t.Errorf("Expected funded after both proofs, got %s", res)
	}
}

func TestRejectFakeVerifiedKnownTickerInExchange(t *testing.T) {
	resetEscrowsForTest()
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on fake verified ticker")
		}
	}()

	CreateVerifiedExchange(
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
}

func TestAllowExplicitSuspiciousKnownTickerMismatchInExchange(t *testing.T) {
	resetEscrowsForTest()

	res := CreateVerifiedExchange(
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

func TestRejectUnauthorizedCreateAndFund(t *testing.T) {
	resetEscrowsForTest()
	testing.SetOriginCaller(address(stranger))

	func() {
		defer func() {
			if r := recover(); r == nil {
				t.Errorf("Did not panic on unauthorized create")
			}
		}()
		createDefaultEscrow("escrow2")
	}()

	testing.SetOriginCaller(address(partyA))
	createDefaultEscrow("escrow2")

	testing.SetOriginCaller(address(stranger))
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on unauthorized funding")
		}
	}()
	MarkFunded("escrow2")
}

func TestRejectReleaseBeforeBothApprovals(t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow("escrow3")
	MarkFunded("escrow3")
	testing.SetOriginCaller(address(partyB))
	MarkFunded("escrow3")
	ApproveRelease("escrow3")

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on one-sided release")
		}
	}()
	Release("escrow3")
}

func TestCancelBeforeFullyFunded(t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow("escrow4")
	MarkFunded("escrow4")

	if res := CancelBeforeFunding("escrow4"); res != StatusCancelled {
		t.Errorf("Expected cancelled, got %s", res)
	}
}

func TestDisputeRequiresGuarantorResolution(t *testing.T) {
	resetEscrowsForTest()
	createDefaultEscrow("escrow5")
	MarkFunded("escrow5")
	testing.SetOriginCaller(address(partyB))
	MarkFunded("escrow5")

	if res := OpenDispute("escrow5", "counterparty did not confirm receipt"); res != StatusDisputed {
		t.Errorf("Expected disputed, got %s", res)
	}

	func() {
		defer func() {
			if r := recover(); r == nil {
				t.Errorf("Did not panic on party refunding disputed escrow")
			}
		}()
		Refund("escrow5")
	}()

	testing.SetOriginCaller(address(guarantor))
	if res := Refund("escrow5"); res != StatusRefunded {
		t.Errorf("Expected refunded, got %s", res)
	}
}
