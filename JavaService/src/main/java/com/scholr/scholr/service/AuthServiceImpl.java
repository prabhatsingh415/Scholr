package com.scholr.scholr.service;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.RefreshToken;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.exception.*;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@AllArgsConstructor
@Service
@Slf4j
public class AuthServiceImpl implements AuthService{
    private final UserService userService;
    private final MessageBrokerProducer brokerProducer;
    private final OTPService otpService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtService jwtService;
    private final PasswordService passwordService;
    private final BlackListTokenService blackListTokenService;
    private final RefreshTokenService refreshTokenService;


    @Override
    public void handleSignUp(AuthRequest request) {
        String collegeId = request.getCollegeId();

        User user = userService.prepareUserForVerification(collegeId, request.getPassword());

        String email = user.getEmail();
        String OTP = otpService.generateOTP(6);
        otpService.storeOTP(collegeId, OTP, "OTP_");

        brokerProducer.sendOTPMessage(  // sending email and OTP to msg broker
                EmailRequest.builder()
                        .email(email)
                        .otp(OTP)
                        .build()
        );
    }

    @Override
    @Transactional
    public AuthResponse verifyOTP(String otp, String collegeId) {

        String cachedOtp = otpService.findOtpByCollegeID(collegeId, "OTP_");

        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new InvalidOTPException("Invalid OTP or OTP expired");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        user.setVerified(true); // set student verify
        userService.save(user);
        otpService.deleteOTP(collegeId, "OTP_");

        UserDataResponse userData = userService.mapToDTO(user);

        // generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        refreshTokenService.saveRefreshToken(collegeId, refreshToken);

        return new AuthResponse(accessToken, refreshToken, userData);
    }

    @Override
    public ResponseCookie createRefreshCookie(String refreshCookie) {
        return ResponseCookie.from("refresh_token", refreshCookie)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(45 * 24 * 60 * 60) // 45 days
                .sameSite("Strict")
                .build();

    }

    @Override
    public AuthResponse handleLogin(AuthRequest authRequest) {
        User user = userService.findByCollegeId(authRequest.getCollegeId())
                .orElseThrow(() -> new UserNotFoundException("User not found !"));

        if (user.isDeleted()) {
            throw new AccountDeletedException("Your account has been deactivated or deleted.");
        }

        if(!user.isVerified()){
            throw new UnauthorizedAccessException("Account not verified. Please verify your OTP first.");
        }


        boolean passwordValid = passwordService.isPasswordValid(user, authRequest.getPassword());
        if(!passwordValid) throw new InvalidPasswordException("Invalid password or college id");

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        UserDataResponse userDataResponse = userService.mapToDTO(user);

        refreshTokenService.saveRefreshToken(user.getCollegeId(), refreshToken);

        return new AuthResponse(accessToken, refreshToken, userDataResponse);
    }

    @Override
    public ResponseCookie logoutUser(String token, String collegeId) {
        refreshTokenService.deleteRefreshToken(collegeId);

        long remainingTime = jwtService.getRemainingExpiry(token);

        blackListTokenService.blacklistToken(token, remainingTime);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", "")
                .maxAge(0)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .build();

        SecurityContextHolder.clearContext();

        log.info("[User Service:Logout] User {} logged out successfully", collegeId);
        return cookie;
    }

    @Override
    public TokenData rotateTokens(String oldRefreshToken) {
        String collegeId = jwtService.extractUserCollegeId(oldRefreshToken);

        String savedToken = refreshTokenService.getRefreshToken(collegeId);

        if (savedToken == null || !savedToken.equals(oldRefreshToken)) {
            log.warn("Token mismatch or expired for ID: {}.", collegeId);
            throw new UnauthorizedAccessException("Session expired or invalid refresh token");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        refreshTokenService.deleteRefreshToken(collegeId);
        refreshTokenService.saveRefreshToken(collegeId, newRefresh);

        RefreshToken rfToken = RefreshToken.builder()
                .collegeId(collegeId)
                .token(newRefresh)
                .expiryDate(LocalDateTime.now().plusDays(45))
                .build();
        refreshTokenService.saveOrUpdate(rfToken);

        return new TokenData(newAccess, newRefresh);
    }

    @Override
    public void handleForgotPassword(ForgotPasswordRequest request) {
        User user = userService.findByCollegeId(request.collegeId())
                .orElseThrow(() -> new UserNotFoundException("College Id not found!"));


        String email = user.getEmail();
        String collegeId = request.collegeId();
        String OTP = otpService.generateOTP(6);

        otpService.storeOTP(collegeId, OTP, "FP_OTP_");

        brokerProducer.sendOTPMessage(  // sending email and OTP to msg broker
                EmailRequest.builder()
                        .email(email)
                        .otp(OTP)
                        .build()
        );

        log.info("[Auth-Service: Forgot Password] OTP sent and stored for: {}", collegeId);
    }

    @Override
    @Transactional
    public void verifyForgotPasswordOTP(String otp, String collegeId, String password) {
        String cachedOtp = otpService.findOtpByCollegeID(collegeId, "FP_OTP_");

        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new InvalidOTPException("Invalid OTP or OTP expired");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String hashedPassword = passwordService.hashPassword(password);
        user.setPassword(hashedPassword);
        userService.save(user);

        otpService.deleteOTP(collegeId, "FP_OTP_");
    }

    @Override
    public void resendOTP(String collegeId) {
        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("Invalid College ID"));

        if (user.isVerified()) {
            throw new AlreadyVerifiedException("Account already active.");
        }

        String newOTP = otpService.generateOTP(6);

        brokerProducer.sendOTPMessage(
                EmailRequest.builder()
                        .email(user.getEmail())
                        .otp(newOTP)
                        .build()
        );

        otpService.storeOTP(collegeId, newOTP, "OTP_");
    }
}
