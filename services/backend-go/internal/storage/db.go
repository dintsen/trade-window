package storage

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/tradewindow/backend-go/internal/config"
)

func InitPostgresPool(ctx context.Context) *pgxpool.Pool {
	if config.AppConfig.StorageDriver != "postgres" {
		return nil
	}
	if config.AppConfig.DatabaseURL == "" {
		log.Fatal("STORAGE_DRIVER is set to postgres but DATABASE_URL is missing")
	}

	pool, err := pgxpool.New(ctx, config.AppConfig.DatabaseURL)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	log.Println("Postgres connection pool initialized")
	return pool
}
