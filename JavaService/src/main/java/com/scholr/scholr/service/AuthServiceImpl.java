package com.scholr.scholr.service;

import com.scholr.scholr.dto.*;
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

        redisTemplate.opsForValue().set("OTP_"+collegeId, OTP, Duration.ofMinutes(10)); // storing otp in redis
    }

    @Override
    @Transactional
    public AuthResponse verifyOTP(String otp, String collegeId) {
        String otpKey = "OTP_" + collegeId; // otp key
        String cachedOtp = (String) redisTemplate.opsForValue().get(otpKey); // fetch otp from redis

        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new InvalidOTPException("Invalid OTP or OTP expired");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        user.setVerified(true); // set student verify
        userService.save(user);
        redisTemplate.delete(otpKey); // delete key

        UserDataResponse userData = userService.mapToDTO(user);

        // generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        String rtKey = "RT_" + collegeId;
        redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));

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

        boolean passwordValid = passwordService.isPasswordValid(user, authRequest.getPassword());


        if(!passwordValid) throw new InvalidPasswordException("Invalid password or college id");

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        UserDataResponse userDataResponse = userService.mapToDTO(user);

        String rtKey = "RT_" + user.getCollegeId();
        redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));

        return new AuthResponse(accessToken, refreshToken, userDataResponse);
    }

    @Override
    public ResponseCookie logoutUser(String collegeId) {
        redisTemplate.delete("RT_" + collegeId);

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
        String savedToken = (String) redisTemplate.opsForValue().get(rtKey);

        if (savedToken == null || !savedToken.equals(oldRefreshToken)) {
            throw new UnauthorizedAccessException("Invalid or expired refresh token");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        redisTemplate.delete(rtKey);

        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        redisTemplate.opsForValue().set(rtKey, newRefresh, Duration.ofDays(45));

        return new TokenData(newAccess, newRefresh);
    }

    @Override
    public void handleForgotPassword(ForgotPasswordRequest request) {
        User user = userService.findByCollegeId(request.collegeId())
                .orElseThrow(() -> new UserNotFoundException("College Id not found!"));


        String email = user.getEmail();

        String OTP = otpService.generateOTP(6);

        brokerProducer.sendOTPMessage(  // sending email and OTP to msg broker
                EmailRequest.builder()
                        .email(email)
                        .otp(OTP)
                        .build()
        );

        redisTemplate.opsForValue().set("FP_OTP_"+request.collegeId(), OTP, Duration.ofMinutes(10)); // storing otp in redis
    }

    @Override
    @Transactional
    public void verifyForgotPasswordOTP(String otp, String collegeId, String password) {
        String otpKey = "FP_OTP_" + collegeId; // otp key
        String cachedOtp = (String) redisTemplate.opsForValue().get(otpKey); // fetch otp from redis

        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new InvalidOTPException("Invalid OTP or OTP expired");
        }

        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String hashedPassword = passwordService.hashPassword(password);
        user.setPassword(hashedPassword);
        userService.save(user);
        redisTemplate.delete(otpKey); // delete key
    }
}
