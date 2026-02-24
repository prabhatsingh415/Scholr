package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MESSAGE_BROKER_URL string
	REDIS_URL          string
	SERVER_PORT        string
	BREVO_MAIL_API     string
	SENDER_NAME        string
	SENDER_EMAIL       string
}

func LoadConfig() *Config {
	godotenv.Load()

	return &Config{
		MESSAGE_BROKER_URL: os.Getenv("MESSAGE_BROKER_URL"),
		REDIS_URL:          os.Getenv("REDIS_URL"),
		SERVER_PORT:        os.Getenv("SERVER_PORT"),
		BREVO_MAIL_API:     os.Getenv("BREVO_MAIL_API"),
		SENDER_NAME:        os.Getenv("SENDER_NAME"),
		SENDER_EMAIL:       os.Getenv("SENDER_EMAIL"),
	}
}
