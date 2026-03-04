package com.scholr.scholr.service;

import com.scholr.scholr.dto.AuthRequest;
import com.scholr.scholr.dto.AuthResponse;
import com.scholr.scholr.dto.ForgotPasswordRequest;
import com.scholr.scholr.dto.TokenData;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;

public interface AuthService {
    void handleSignUp(@Valid AuthRequest request);

    AuthResponse verifyOTP(String otp, String collegeId);

    ResponseCookie createRefreshCookie(String refreshToken);

    AuthResponse handleLogin(@Valid AuthRequest authRequest);

    ResponseCookie logoutUser(String collegeId);

    TokenData rotateTokens(String oldRefreshToken);

    void handleForgotPassword(@Valid ForgotPasswordRequest request);

    void verifyForgotPasswordOTP(String otp, String collegeId, String password);

    void resendOTP(String collegeId);
}
