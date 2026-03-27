package consumer

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"goservice/internal/config"
	"goservice/internal/notification"

	"github.com/rabbitmq/amqp091-go"
)

type NotificationPayload struct {
	FcmTokens []string          `json:"fcmTokens"`
	Title     string            `json:"title"`
	Body      string            `json:"body"`
	Data      map[string]string `json:"data"`
}

func ConsumeNotifications(ctx context.Context) {
	cfg := config.LoadConfig()

	// Setup Connection
	conn, err := amqp091.Dial(cfg.MESSAGE_BROKER_URL)
	if err != nil {
		log.Fatalf("[NOTIF :] Could not connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("[NOTIF :] Could not open RabbitMQ channel: %v", err)
	}
	defer ch.Close()

	// Queue & Binding Logic
	args := amqp091.Table{
		"x-message-ttl": int32(1500000), // 25 mins
	}

	q, err := ch.QueueDeclare(
		"scholr.notification.push.queue",
		true, false, false, false, args,
	)
	if err != nil {
		log.Fatalf("[NOTIF :] Failed to declare queue: %v", err)
	}

	err = ch.QueueBind(
		q.Name,
		"notification.push.key",
		"scholr.auth.exchange",
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("[NOTIF :] Failed to bind queue: %v", err)
	}

	//Consumer Setup 
	msgs, err := ch.Consume(
		q.Name,
		"",
		false, 
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("[NOTIF :] Failed to register consumer: %v", err)
	}

	log.Printf("[NOTIF :] Notification Worker is live. Listening on %s", q.Name)

	for {
		select {
		case <-ctx.Done():
			log.Println("[NOTIF :] Context cancelled. Stopping worker...")
			return

		case d, ok := <-msgs:
			if !ok {
				return
			}

			log.Printf("[NOTIF :] New notification bundle received: %s", string(d.Body))

			var payload NotificationPayload
			if err := json.Unmarshal(d.Body, &payload); err != nil {
				log.Printf("[NOTIF :] Invalid JSON format. Dropping message: %v", err)
				d.Ack(false) 
				continue
			}

			go func(data NotificationPayload, msg amqp091.Delivery) {
				sendSuccess := true

				for _, token := range data.FcmTokens {
					err := notification.SendNotification(token, data.Title, data.Body, data.Data)

					if err != nil {
						log.Printf("[NOTIF :] Failed to send to token %s: %v", token, err)
						sendSuccess = false
					}
				}

				if !sendSuccess {
					log.Printf("[NOTIF :] Partial failure in bundle %s. Retrying in 2s...", data.Title)
					time.Sleep(2 * time.Second)
					msg.Nack(false, true) // Put back in queue for retry
					return
				}

				
				msg.Ack(false)
				log.Printf("[NOTIF :] Successfully pushed notifications for: %s", data.Title)

			}(payload, d)
		}
	}
}
