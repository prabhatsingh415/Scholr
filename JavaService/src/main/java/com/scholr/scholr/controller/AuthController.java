package com.scholr.scholr.controller;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.exception.UnauthorizedAccessException;
import com.scholr.scholr.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> processSignUp(@Valid @RequestBody AuthRequest request){
       log.info("[Auth:Signup] SignUp attempt for collegeId {}", request.getCollegeId());

       authService.handleSignUp(request);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Verification OTP successfully sent to your registered Email",
                null,
                null,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOTP(@RequestParam String collegeId) {
        log.info("[Auth:Resend-OTP] Resend attempt for collegeId: {}", collegeId);

        authService.resendOTP(collegeId);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "A new OTP has been sent to your registered Email",
                null,
                null,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> confirmSignUp(@Valid @RequestBody VerifyOTPRequest request){
        log.info("[Auth:OTP-Verification] Verification attempt for collegeId: {}", request.collegeId());

        AuthResponse authResponse = authService.verifyOTP(request.otp(), request.collegeId());

        ResponseCookie refreshCookie = authService.createRefreshCookie(authResponse.refreshToken());

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new ApiResponse<>(
                        true,
                        "OTP verified successfully",
                        Map.of("access_token", authResponse.accessToken(),
                            "user", authResponse.user()),
                        null,
                        LocalDateTime.now().toString()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthRequest authRequest){
        log.info("[Auth:Login] Login attempt for collegeId {}", authRequest.getCollegeId());

        AuthResponse authResponse = authService.handleLogin(authRequest);

        ResponseCookie refreshCookie = authService.createRefreshCookie(authResponse.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(new ApiResponse<>(
             true,
            "Login successful",
                     Map.of("access_token", authResponse.accessToken(),
                            "user", authResponse.user()),
           null,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@AuthenticationPrincipal UserDetails userDetails){
        String collegeId = userDetails.getUsername();

        log.info("[Auth:Logout] Logout attempt for collegeId {}", collegeId);

        ResponseCookie cookie = authService.logoutUser(collegeId);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new ApiResponse<>(
                        true,
                        "logout successfully",
                         null,
                        null,
                        LocalDateTime.now().toString()
                ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request){
        log.info("[Auth:refresh] request reached for token rotation");

        if (request.getCookies() == null) {
            log.error("yaha par hooon nahi mila");
            throw new UnauthorizedAccessException("Refresh token missing");
        }

        String oldRefreshToken = Arrays.stream(request.getCookies())
                .filter(c -> "refresh_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElseThrow(() -> new UnauthorizedAccessException("Refresh token missing"));

         log.info("old token {}", oldRefreshToken);
        TokenData newTokenData = authService.rotateTokens(oldRefreshToken);

        ResponseCookie newCookie = authService.createRefreshCookie(newTokenData.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                .body(new ApiResponse<>(
                        true,
                        "Token refreshed successfully",
                        Map.of("access_token", newTokenData.accessToken()),
                        null,
                        LocalDateTime.now().toString()
                ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        log.info("[Auth:forgot_password] request reached for forgot password");

        authService.handleForgotPassword(request);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Verification OTP successfully sent to your registered Email",
                null,
                null,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/forgot-password-verify")
    public ResponseEntity<?> resetPasswordPublic(@Valid @RequestBody ForgotPasswordVerifyRequest request){
        log.info("[Auth:forgot_password_verification] request reached for forgot password verification");

        authService.verifyForgotPasswordOTP(request.otp(), request.collegeId(), request.password());

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Password reset successfully",
                null,
                null,
                LocalDateTime.now().toString()
        ));
    }
}
