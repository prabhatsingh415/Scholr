package com.scholr.scholr.dto; // Lowercase

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {

    @NotBlank(message = "College Id can not be blank")
    private String collegeId;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, max = 50, message = "Password must be between 8 and 50 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&~`\\!])(?=.*\\d)[A-Za-z\\d@$&~`\\!]{8,50}$",
            message = "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$&~`!). No dashes allowed."
    )
    private String password;
}