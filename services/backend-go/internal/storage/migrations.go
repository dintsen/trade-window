package storage

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io/fs"
	"log"
	"sort"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/tradewindow/backend-go/migrations"
)

// RunMigrations runs all unapplied migrations from the migrations package.
func RunMigrations(ctx context.Context, pool *pgxpool.Pool) error {
	// 1. Create schema_migrations table if not exists
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		filename VARCHAR(255) PRIMARY KEY,
		checksum VARCHAR(64) NOT NULL,
		applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);`
	_, err := pool.Exec(ctx, createTableQuery)
	if err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}

	// 2. Read migration files from the embedded FS
	entries, err := fs.ReadDir(migrations.Files, ".")
	if err != nil {
		return fmt.Errorf("failed to read embedded migrations: %w", err)
	}

	var filenames []string
	for _, entry := range entries {
		if !entry.IsDir() && len(entry.Name()) > 4 && entry.Name()[len(entry.Name())-4:] == ".sql" {
			filenames = append(filenames, entry.Name())
		}
	}

	// Sort filenames alphabetically/numerically
	sort.Strings(filenames)

	log.Printf("Found %d migration files in embedded FS", len(filenames))

	// 3. For each file, compute checksum and check status
	for _, filename := range filenames {
		content, err := fs.ReadFile(migrations.Files, filename)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", filename, err)
		}

		hasher := sha256.New()
		hasher.Write(content)
		checksum := hex.EncodeToString(hasher.Sum(nil))

		// Check if migration is already applied
		var dbChecksum string
		var dbAppliedAt time.Time
		query := `SELECT checksum, applied_at FROM schema_migrations WHERE filename = $1`
		err = pool.QueryRow(ctx, query, filename).Scan(&dbChecksum, &dbAppliedAt)
		if err == nil {
			// Migration already applied, verify checksum
			if dbChecksum != checksum {
				return fmt.Errorf("checksum mismatch for migration %s: expected %s, got %s in database. Database state is inconsistent", filename, dbChecksum, checksum)
			}
			log.Printf("Migration %s already applied at %s", filename, dbAppliedAt.Format(time.RFC3339))
			continue
		}

		if err != pgx.ErrNoRows {
			return fmt.Errorf("failed to check migration status for %s: %w", filename, err)
		}

		log.Printf("Applying migration %s...", filename)

		// Start a transaction
		tx, err := pool.Begin(ctx)
		if err != nil {
			return fmt.Errorf("failed to start transaction for migration %s: %w", filename, err)
		}
		// Rollback has no effect if transaction was already committed
		defer func() {
			_ = tx.Rollback(ctx)
		}()

		// Run the SQL statements
		_, err = tx.Exec(ctx, string(content))
		if err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", filename, err)
		}

		// Insert record into schema_migrations
		insertQuery := `INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)`
		_, err = tx.Exec(ctx, insertQuery, filename, checksum)
		if err != nil {
			return fmt.Errorf("failed to log migration %s to schema_migrations: %w", filename, err)
		}

		err = tx.Commit(ctx)
		if err != nil {
			return fmt.Errorf("failed to commit transaction for migration %s: %w", filename, err)
		}

		log.Printf("Successfully applied migration %s", filename)
	}

	return nil
}
