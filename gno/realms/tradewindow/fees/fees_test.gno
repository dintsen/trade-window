package fees

import "testing"

func TestGetSetFeeConfig(cur realm, t *testing.T) {
	config := GetFeeConfig()
	if config.BaseFee != 100 {
		t.Errorf("Expected BaseFee 100, got %d", config.BaseFee)
	}
	SetFeeConfig(cross(cur), 50, "ugnot")
	config = GetFeeConfig()
	if config.BaseFee != 50 {
		t.Errorf("Expected BaseFee 50, got %d", config.BaseFee)
	}
}
