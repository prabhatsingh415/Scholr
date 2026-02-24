package com.scholr.scholr.service;

import com.scholr.scholr.dto.AuthRequest;
import com.scholr.scholr.dto.TokenData;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;

public interface UserService {
    void handleSignUp(@Valid AuthRequest request);

    TokenData verifyOTP(String otp, String collegeId);

    ResponseCookie createRefreshCookie(String refreshToken);

    TokenData handleLogin(@Valid AuthRequest authRequest);

    ResponseCookie logoutUser(String collegeId);

    TokenData rotateTokens(String oldRefreshToken);
}





