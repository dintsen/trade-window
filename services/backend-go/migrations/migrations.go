package migrations

import (
	"embed"
)

// Files embeds all SQL files in the migrations directory.
//go:embed *.sql
var Files embed.FS
