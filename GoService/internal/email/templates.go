package email

import (
	"fmt"
	"goservice/internal/models"
)

func generateTemplate(mailType models.EmailType, otp string) (string, string) {
	brandColor := "#6366F1"
	title := "Scholr"
	var subject, headerText, bodyText string

	switch mailType {
	case models.Verification:
		subject = "Welcome to Scholr - Verify your Email"
		title = "Welcome to Scholr"
		headerText = "Account Signup"
		bodyText = "We noticed that you requested for a sign up. Here is your OTP to verify your account."
	case models.ForgotOTP:
		subject = "Reset Your Password - Scholr"
		brandColor = "#FAFAFA"
		title = "Password Reset"
		headerText = "Security Request"
		bodyText = "We noticed you requested a password reset. Use the following code to secure your account."
	default:
		subject = "Notification from Scholr"
		headerText = "Update"
		bodyText = "Here is the code you requested."
	}

	html := fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<style>
			body { background-color: #0A0A0A; font-family: 'Inter', sans-serif; margin: 0; padding: 40px; color: #FAFAFA; }
			.container { max-width: 500px; margin: auto; background: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 24px; padding: 40px; text-align: center; }
			.brand { color: %s; font-size: 24px; font-weight: bold; letter-spacing: -0.025em; margin-bottom: 20px; }
			.header-tag { font-size: 12px; color: %s; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
			.title { font-size: 28px; font-weight: 700; margin-bottom: 15px; color: #FAFAFA; }
			.body-text { color: #666666; font-size: 15px; line-height: 1.5; margin-bottom: 25px; }
			.otp { background: #222222; border: 1px solid #2A2A2A; border-radius: 12px; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 0.2em; color: %s; margin: 20px 0; }
			.signature { margin-top: 30px; text-align: left; border-left: 2px solid %s; padding-left: 15px; }
			.sig-name { font-size: 16px; font-weight: 600; color: #FAFAFA; margin: 0; }
			.sig-title { font-size: 13px; color: #666666; margin: 2px 0 0 0; }
			.flex-footer { border-top: 1px solid #2A2A2A; margin-top: 30px; padding-top: 20px; color: #475569; font-size: 13px; font-style: italic; }
			.footer { margin-top: 20px; color: #666666; font-size: 11px; }
		</style>
	</head>
	<body>
		<div class="container">
			<div class="brand">Scholr</div>
			<div class="header-tag">%s</div>
			<div class="title">%s</div>
			<p class="body-text">%s</p>
			<div class="otp">%s</div>
			<p style="font-size: 13px; color: #475569;">If you didn't request this, please ignore this email.</p>
			
			<div class="signature">
				<p class="sig-name">Prabhat Singh</p>
				<p class="sig-title">Developer, Scholr</p>
			</div>

			<div class="flex-footer">
			 Build with passion at <b>Government Engineering College, Baran</b>
			</div>
			<div class="footer">© 2026 Scholr. All rights reserved.</div>
		</div>
	</body>
	</html>`, brandColor, brandColor, brandColor, brandColor, headerText, title, bodyText, otp)

	return subject, html
}
