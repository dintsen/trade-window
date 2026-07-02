package registry

import "testing"

func TestAddAsset(t *testing.T) {
	res := AddAsset("uatom", "verified", "core asset")
	if res != "added" {
		t.Errorf("Expected 'added', got %s", res)
	}

	asset := GetAsset("uatom")
	if asset.Status != "verified" {
		t.Errorf("Asset status mismatch")
	}

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on duplicate denom")
		}
	}()
	AddAsset("uatom", "verified", "duplicate")
}

func TestRejectEmptyDenom(t *testing.T) {
	defer func() {
		if r := recover(); r == nil {
			t.Errorf("Did not panic on empty denom")
		}
	}()
	AddAsset("", "verified", "empty")
}

func TestMarkAssetStatus(t *testing.T) {
	AddAsset("uusdc", "verified", "stablecoin")
	MarkAssetStatus("uusdc", "suspended", "security review")

	asset := GetAsset("uusdc")
	if asset.Status != "suspended" {
		t.Errorf("Asset status not updated")
	}
}
