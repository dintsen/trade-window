package config

import (
	"log"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port                       string
	AllowedOrigins             []string
	CountdownSeconds           int
	RoomExpiryMinutes          int
	RoomCleanupIntervalSeconds int
	BoardStoragePath           string
	BoardMaxBodyBytes          int
	BoardRateLimitPerMinute    int
	BoardDefaultTTLDays        int
	BoardAdminToken            string
	StorageDriver              string
	DatabaseURL                string
	RequestsStoragePath        string
	RequestsMaxBodyBytes       int
	RequestsRateLimitPerMinute int
}

var AppConfig *Config

func Init() {
	AppConfig = &Config{
		Port:                       getEnvString("PORT", "8080"),
		AllowedOrigins:             getEnvStringSlice("ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:3001"}),
		CountdownSeconds:           getEnvInt("COUNTDOWN_SECONDS", 10),
		RoomExpiryMinutes:          getEnvInt("ROOM_EXPIRY_MINUTES", 60),
		RoomCleanupIntervalSeconds: getEnvInt("ROOM_CLEANUP_INTERVAL_SECONDS", 60),
		BoardStoragePath:           getEnvString("BOARD_STORAGE_PATH", "./data/board-listings.jsonl"),
		BoardMaxBodyBytes:          getEnvInt("BOARD_MAX_BODY_BYTES", 16384),
		BoardRateLimitPerMinute:    getEnvInt("BOARD_RATE_LIMIT_PER_MINUTE", 10),
		BoardDefaultTTLDays:        getEnvInt("BOARD_DEFAULT_TTL_DAYS", 30),
		BoardAdminToken:            getEnvString("BOARD_ADMIN_TOKEN", ""),
		StorageDriver:              getEnvString("STORAGE_DRIVER", "jsonl"),
		DatabaseURL:                getEnvString("DATABASE_URL", ""),
		RequestsStoragePath:        getEnvString("REQUESTS_STORAGE_PATH", "./data/deal-requests.jsonl"),
		RequestsMaxBodyBytes:       getEnvInt("REQUESTS_MAX_BODY_BYTES", 16384),
		RequestsRateLimitPerMinute: getEnvInt("REQUESTS_RATE_LIMIT_PER_MINUTE", 10),
	}
}

func getEnvString(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getEnvStringSlice(key string, fallback []string) []string {
	if value, exists := os.LookupEnv(key); exists {
		if strings.TrimSpace(value) == "" {
			return []string{}
		}
		return strings.Split(value, ",")
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if value, exists := os.LookupEnv(key); exists {
		parsed, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("Warning: Invalid integer value for %s: %v. Using default: %d\n", key, value, fallback)
			return fallback
		}
		return parsed
	}
	return fallback
}
