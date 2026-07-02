package board

import "testing"

func TestAddRemoveListing(cur realm, t *testing.T) {
	AddListing(cross(cur), "test1", "maker1", "asset1", "asset2")
	if len(allListings) != 1 {
		t.Errorf("Expected 1 listing, got %d", len(allListings))
	}
	RemoveListing(cross(cur), "test1")
	if len(allListings) != 0 {
		t.Errorf("Expected 0 listings, got %d", len(allListings))
	}
}
