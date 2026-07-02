package token

// Future escrow token representation or wrapped assets

type Escrow struct {
	Owner   string
	Amount  int64
	Locked  bool
}

var escrows map[string]*Escrow

func init() {
	escrows = make(map[string]*Escrow)
}

func Deposit(cur realm, user string, amount int64) string {
	if _, exists := escrows[user]; !exists {
		escrows[user] = &Escrow{Owner: user, Amount: 0, Locked: false}
	}
	escrows[user].Amount += amount
	return "deposited"
}

func Lock(cur realm, user string) string {
	if esc, exists := escrows[user]; exists {
		esc.Locked = true
		return "locked"
	}
	return "not found"
}
