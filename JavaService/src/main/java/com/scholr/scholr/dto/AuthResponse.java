package com.scholr.scholr.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserDataResponse user
) {}
