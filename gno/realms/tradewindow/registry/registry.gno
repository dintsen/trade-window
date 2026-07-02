package registry

type VerifiedAsset struct {
	Denom  string
	Status string
	Reason string
}

var assets map[string]*VerifiedAsset

func init() {
	assets = make(map[string]*VerifiedAsset)
}

func AddAsset(cur realm, denom, status, reason string) string {
	if denom == "" {
		panic("empty denom")
	}
	if _, exists := assets[denom]; exists {
		panic("duplicate denom")
	}

	assets[denom] = &VerifiedAsset{
		Denom:  denom,
		Status: status,
		Reason: reason,
	}
	return "added"
}

func GetAsset(denom string) *VerifiedAsset {
	return assets[denom]
}

func MarkAssetStatus(cur realm, denom, status, reason string) string {
	asset, exists := assets[denom]
	if !exists {
		panic("asset not found")
	}
	asset.Status = status
	asset.Reason = reason
	return "updated"
}
