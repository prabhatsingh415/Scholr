package com.scholr.scholr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password is required")
        String currentPassword,

        @NotBlank(message = "New password is required")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=\\S+$).{8,}$",
                message = "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
        )
        String newPassword,

        @NotBlank(message = "Confirm password is required")
        String confirmNewPassword
) {}


