package com.scholr.scholr.dto;

import jakarta.validation.constraints.Pattern;

public record ForgotPasswordVerifyRequest(String otp, String collegeId,
                                          @Pattern(
                                                  regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&~`\\!])(?=.*\\d)[A-Za-z\\d@$&~`\\!]{8,50}$",
                                                  message = "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$&~`!). No dashes allowed."
                                          )String password) {
}
