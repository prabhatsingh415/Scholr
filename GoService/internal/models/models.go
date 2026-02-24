package models

type EmailType string

const (
	Info         EmailType = "INFO"
	Verification EmailType = "VERIFICATION"
	ForgotOTP    EmailType = "FORGOT_PASSWORD"
)
