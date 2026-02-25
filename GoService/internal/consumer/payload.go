package consumer

import (
	"context"
	"encoding/json"
	"log"

	"goservice/internal/config"
	"goservice/internal/email"
	"goservice/internal/models"

	"github.com/rabbitmq/amqp091-go"
)

type OTPPayload struct { // message payload matching with backend
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

func ConsumeMsg(ctx context.Context) {
	cfg := config.LoadConfig()

	// Setup connection
	conn, err := amqp091.Dial(cfg.MESSAGE_BROKER_URL)
	if err != nil {
		log.Fatalf("[PAYLOAD :] Could not connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("[PAYLOAD :] Could not open RabbitMQ channel: %v", err)
	}
	defer ch.Close()

	// Queue
	q, err := ch.QueueDeclare(
		"scholr.auth.sync.queue", // name
		true,                     // durable
		false,                    // delete when unused
		false,                    // exclusive
		false,                    // no-wait
		nil,                      // arguments
	)
	if err != nil {
		log.Fatalf("[PAYLOAD :] Failed to declare queue: %v", err)
	}

	//bind
	err = ch.QueueBind(
		q.Name,                 // queue name
		"auth.sync.key",        // routing key
		"scholr.auth.exchange", // exchange
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("[PAYLOAD :]Binding failed: %v", err)
	}

	// Consumer setup
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
		log.Fatalf("[PAYLOAD :] Failed to register consumer: %v", err)
	}

	log.Printf("[PAYLOAD :] Worker is live. Listening on %s", q.Name)

	// Processing messages
	for {
		select {
		case <-ctx.Done():
			log.Println("[PAYLOAD_INFO :] Consumer stopping...")
			return
		case d, ok := <-msgs:
			if !ok {
				return
			}

			var payload OTPPayload
			// JSON
			if err := json.Unmarshal(d.Body, &payload); err != nil {
				log.Printf("[PAYLOAD :] Invalid JSON format: %v | Body: %s", err, string(d.Body))
				d.Ack(false)
				continue
			}

			go func(data OTPPayload, msg amqp091.Delivery) {
				log.Printf("[PAYLOAD :] Sending OTP to %s", data.Email)

				err := email.SendEmail(data.Email, data.OTP, models.Verification)
				if err != nil {
					log.Printf("[PAYLOAD :] Failed to send email to %s: %v", data.Email, err)
					msg.Nack(false, true) //reinsert if fails
					return
				}

				// Success
				msg.Ack(false)
				log.Printf("[PAYLOAD :] Process completed for %s", data.Email)
			}(payload, d)
		}
	}
}
