package com.scholr.scholr.service;

import com.scholr.scholr.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public interface PasswordService {
    boolean isPasswordValid(User user, @NotBlank(message = "Password cannot be empty") @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters") @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&~`\\!])(?=.*\\d)[A-Za-z\\d@$&~`\\!]{8,50}$",
            message = "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$&~`!). No dashes allowed."
    ) String password);

    String hashPassword(@NotBlank(message = "Password cannot be empty") @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters") @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&~`\\!])(?=.*\\d)[A-Za-z\\d@$&~`\\!]{8,50}$",
            message = "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$&~`!). No dashes allowed."
    ) String password);
}

