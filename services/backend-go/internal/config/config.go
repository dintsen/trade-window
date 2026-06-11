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
}

var AppConfig *Config

func Init() {
	AppConfig = &Config{
		Port:                       getEnvString("PORT", "8080"),
		AllowedOrigins:             getEnvStringSlice("ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:3001"}),
		CountdownSeconds:           getEnvInt("COUNTDOWN_SECONDS", 10),
		RoomExpiryMinutes:          getEnvInt("ROOM_EXPIRY_MINUTES", 60),
		RoomCleanupIntervalSeconds: getEnvInt("ROOM_CLEANUP_INTERVAL_SECONDS", 60),
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
