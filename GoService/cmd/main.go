package main

import (
	"fmt"
	"goservice/internal/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.LoadConfig()

	router := gin.Default()

	router.GET("/home", func(ctx *gin.Context) {
		ctx.JSON(http.StatusAccepted, "Welcome to Scholr Go Service 💀💀🙏")
	})

	fmt.Printf("Server starting on port %s...\n", cfg.SERVER_PORT)
	router.Run(":" + cfg.SERVER_PORT)
}
