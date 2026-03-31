package com.scholr.scholr.service;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.BlackListToken;
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

import java.time.Duration;
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
    @Transactional
    public void handleSignUp(AuthRequest request) {
        String collegeId = request.getCollegeId();

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("Invalid College ID"));

        if (user.isVerified()) {
            throw new AlreadyVerifiedException("Account already active. Please login.");
        }

        String hashedPassword = passwordService.hashPassword(request.getPassword());
        user.setPassword(hashedPassword);
        userService.save(user);

        String email = user.getEmail();
        String OTP = otpService.generateOTP(6);

        brokerProducer.sendOTPMessage(  // sending email and OTP to msg broker
                EmailRequest.builder()
                        .email(email)
                        .otp(OTP)
                        .build()
        );
        try {
            redisTemplate.opsForValue().set("OTP_"+collegeId, OTP, Duration.ofMinutes(10)); // storing otp in redis
        }catch (Exception e){
            log.error("Redis is DOWN! Falling back to DB for OTP. ID: {}", user.getCollegeId());
            otpService.saveOTPDB(collegeId, OTP, LocalDateTime.now().plusMinutes(10));
        }
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

        String rtKey = "RT_" + collegeId;
        try {
            // Try Redis
            redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));
        } catch (Exception e) {
            log.error("Redis is DOWN! Falling back to DB for Refresh Token while verifying OTP. ID: {}", user.getCollegeId());

            // Fallback to DB
            RefreshToken rfToken = RefreshToken.builder()
                    .collegeId(user.getCollegeId())
                    .token(refreshToken)
                    .expiryDate(LocalDateTime.now().plusDays(45))
                    .build();

            refreshTokenService.saveOrUpdate(rfToken); // Update if exists
        }

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

        String rtKey = "RT_" + user.getCollegeId();

        try {
            // Try Redis
            redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));
        } catch (Exception e) {
            log.error("Redis is DOWN! Falling back to DB for Refresh Token. ID: {}", user.getCollegeId());

            // Fallback to DB
            RefreshToken rfToken = RefreshToken.builder()
                    .collegeId(user.getCollegeId())
                    .token(refreshToken)
                    .expiryDate(LocalDateTime.now().plusDays(45))
                    .build();

            refreshTokenService.saveOrUpdate(rfToken); // Update if exists
        }

        return new AuthResponse(accessToken, refreshToken, userDataResponse);
    }

    @Override
    public ResponseCookie logoutUser(String token, String collegeId) {
        try {
            redisTemplate.delete("RT_" + collegeId);
        } catch (Exception e) {
            log.error("Failed to delete Refresh Token from Redis during logout");
        }
        refreshTokenService.deleteToken(collegeId);

        String redisKey = "BL_" + token;
        long remainingTime = jwtService.getRemainingExpiry(token);

        try {
            redisTemplate.opsForValue().set(redisKey, "true", Duration.ofMillis(remainingTime));
            log.info("Token blacklisted in Redis");
        } catch (Exception e) {
            log.error("Redis is DOWN! Falling back to Database for blacklisting. Error: {}", e.getMessage());

            // Fallback to DB
            BlackListToken blackListToken = BlackListToken.builder()
                    .token(token)
                    .expirationTime(LocalDateTime.now().plusNanos(remainingTime * 1_000_000))
                    .build();

            blackListTokenService.save(blackListToken);
        }

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

        String rtKey = "RT_" + collegeId;

        String savedToken = null;
        try {
            savedToken = (String) redisTemplate.opsForValue().get(rtKey);
        } catch (Exception e) {
            log.error("Redis down during token rotation check for ID: {}. Falling back to DB.", collegeId);
        }
        if (savedToken == null) {
            RefreshToken dbToken = refreshTokenService.findByCollegeId(collegeId)
                    .orElseThrow(() -> new UnauthorizedAccessException("Session expired. Please login again."));
            savedToken = dbToken.getToken();
        }

        if (!savedToken.equals(oldRefreshToken)) {
            log.warn("Token mismatch detected for ID: {}.", collegeId);
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        try {
            redisTemplate.delete(rtKey);
            redisTemplate.opsForValue().set(rtKey, newRefresh, Duration.ofDays(45));
        } catch (Exception e) {
            log.error("Failed to update Redis during rotation: {}", e.getMessage());
        }

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

        brokerProducer.sendOTPMessage(  // sending email and OTP to msg broker
                EmailRequest.builder()
                        .email(email)
                        .otp(OTP)
                        .build()
        );

        String fpKey = "FP_OTP_" + collegeId;
        try {
            // Try storing in Redis
            redisTemplate.opsForValue().set(fpKey, OTP, Duration.ofMinutes(10));
            log.info("Forgot Password OTP stored in Redis for: {}", collegeId);
        } catch (Exception e) {
            log.error("Redis DOWN! Falling back to DB for Forgot Password OTP. ID: {}", collegeId);
            otpService.saveOTPDB(collegeId, OTP, LocalDateTime.now().plusMinutes(10));
        }
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

        String otpKey = "OTP_" + collegeId;
        try {
            redisTemplate.opsForValue().set(otpKey, newOTP, Duration.ofMinutes(10));
            log.info("Resent OTP stored in Redis for: {}", collegeId);
        } catch (Exception e) {
            log.error("Redis DOWN during resend! Falling back to DB for ID: {}", collegeId);

            otpService.saveOTPDB(collegeId, newOTP, LocalDateTime.now().plusMinutes(10));
        }    }
}
