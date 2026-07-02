package fees

type FeeConfig struct {
	BaseFee int64
	Denom   string
}

var currentConfig *FeeConfig

func init() {
	currentConfig = &FeeConfig{
		BaseFee: 100, // 100 basis points
		Denom:   "ugnot",
	}
}

func GetFeeConfig() *FeeConfig {
	return currentConfig
}

func SetFeeConfig(cur realm, baseFee int64, denom string) string {
	currentConfig.BaseFee = baseFee
	currentConfig.Denom = denom
	return "updated"
}
