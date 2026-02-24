package main

import (
	"context"
	"goservice/internal/config"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"goservice/internal/consumer"
)

func main() {
	cfg := config.LoadConfig()

	rootCtx, stop := context.WithCancel(context.Background())
	defer stop()
	go consumer.ConsumeMsg(rootCtx) // consume the broker's messages

	router := gin.Default()

	router.GET("/home", func(ctx *gin.Context) {
		ctx.JSON(http.StatusAccepted, "Welcome to Scholr Go Service ")
	})

	srv := &http.Server{
		Addr:    ":" + cfg.SERVER_PORT,
		Handler: router,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM) // relase the blockage
	<-quit

	stop()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting.")
}
