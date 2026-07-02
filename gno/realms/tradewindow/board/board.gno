package board

// The OTC board lists public trade intents that haven't yet formed a room.

type Listing struct {
	ID          string
	Maker       string
	AssetOffered string
	AssetWanted  string
}

var allListings map[string]*Listing

func init() {
	allListings = make(map[string]*Listing)
}

func AddListing(cur realm, id, maker, offered, wanted string) string {
	if _, exists := allListings[id]; exists {
		panic("listing exists")
	}

	allListings[id] = &Listing{
		ID:          id,
		Maker:       maker,
		AssetOffered: offered,
		AssetWanted:  wanted,
	}
	return "listed"
}

func RemoveListing(cur realm, id string) string {
	delete(allListings, id)
	return "removed"
}
