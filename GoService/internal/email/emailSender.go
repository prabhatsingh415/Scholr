package email

import (
	"context"
	"errors"
	"fmt"
	"goservice/internal/config"
	"goservice/internal/models"
	"log"

	br "github.com/getbrevo/brevo-go/lib"
)

func SendEmail(toEmail string, content string, mailType models.EmailType) error {
	subject, body := generateTemplate(mailType, content)

	err := executeSend(toEmail, subject, body)
	if err != nil {
		log.Printf("[EMAIL_SENDER :] Failed to send %s email to %s: %v", mailType, toEmail, err)
		return err
	}

	log.Printf("[EMAIL_SENDER :] %s email dispatched to %s", mailType, toEmail)
	return nil
}

func executeSend(toEmail, subject, body string) error {
	cfg := config.LoadConfig()

	// API Key
	if cfg.BREVO_MAIL_API == "" {
		return errors.New("[EMAIL_SENDER :]brevo api key is missing in configuration")
	}

	ctx := context.WithValue(context.Background(), br.ContextAPIKey, br.APIKey{
		Key: cfg.BREVO_MAIL_API,
	})

	client := br.NewAPIClient(br.NewConfiguration())

	emailData := br.SendSmtpEmail{
		Subject:     subject,
		HtmlContent: body,
		Sender: &br.SendSmtpEmailSender{
			Name:  cfg.SENDER_NAME,
			Email: cfg.SENDER_EMAIL,
		},
		To: []br.SendSmtpEmailTo{
			{Email: toEmail},
		},
	}

	// API Call
	_, httpRes, err := client.TransactionalEmailsApi.SendTransacEmail(ctx, emailData)

	if err != nil {
		return err
	}

	if httpRes.StatusCode > 299 {
		return fmt.Errorf("[EMAIL_SENDER :]brevo api returned status: %d", httpRes.StatusCode)
	}

	return nil
}
