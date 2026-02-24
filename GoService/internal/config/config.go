package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MESSAGE_BROKER_URL string
	REDIS_URL          string
	SERVER_PORT        string
}

func LoadConfig() *Config {
	godotenv.Load()

	return &Config{
		MESSAGE_BROKER_URL: os.Getenv("MESSAGE_BROKER_URL"),
		REDIS_URL:          os.Getenv("REDIS_URL"),
		SERVER_PORT:        os.Getenv("SERVER_PORT"),
	}
}
