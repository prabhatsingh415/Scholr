package com.scholr.scholr.dto;

import jakarta.validation.constraints.Size;

public record UpdateNameRequest(
        @Size(max = 50)
        String firstName,
        @Size(max = 50)
        String lastName) {
}
