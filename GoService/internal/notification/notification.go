package notification

import (
	"context"
	"fmt"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

func SendNotification(token string, title string, body string, data map[string]string) error {
	ctx := context.Background()

	opt := option.WithCredentialsFile("serviceAccountKey.json")

	// Firebase App Initialize
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return fmt.Errorf("error initializing firebase app: %v", err)
	}

	// Messaging Client setup
	client, err := app.Messaging(ctx)
	if err != nil {
		return fmt.Errorf("error getting messaging client: %v", err)
	}

	// Message Design
	message := &messaging.Message{
		Token: token,
		Notification: &messaging.Notification{
			Title: title,
			Body:  body,
		},
		Data: data,
		Android: &messaging.AndroidConfig{
			Priority: "high",
		},
	}

	// Trigger the notification
	response, err := client.Send(ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send message: %v", err)
	}

	log.Printf("[FCM SUCCESS :] Notification sent! MessageID: %s", response)
	return nil
}
