package registry

import "testing"

func TestAddAsset(cur realm, t *testing.T) {
	res := AddAsset(cross(cur), "uatom", "verified", "core asset")
	if res != "added" {
		t.Errorf("Expected 'added', got %s", res)
	}

	asset := GetAsset("uatom")
	if asset.Status != "verified" {
		t.Errorf("Asset status mismatch")
	}

	if r := revive(func() { AddAsset(cross(cur), "uatom", "verified", "duplicate") }); r == nil {
		t.Errorf("Did not panic on duplicate denom")
	}
}

func TestRejectEmptyDenom(cur realm, t *testing.T) {
	if r := revive(func() { AddAsset(cross(cur), "", "verified", "empty") }); r == nil {
		t.Errorf("Did not panic on empty denom")
	}
}

func TestMarkAssetStatus(cur realm, t *testing.T) {
	AddAsset(cross(cur), "uusdc", "verified", "stablecoin")
	MarkAssetStatus(cross(cur), "uusdc", "suspended", "security review")

	asset := GetAsset("uusdc")
	if asset.Status != "suspended" {
		t.Errorf("Asset status not updated")
	}
}
