package com.scholr.scholr.service;

import com.scholr.scholr.dto.EmailRequest;
import com.scholr.scholr.dto.AuthRequest;
import com.scholr.scholr.dto.TokenData;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.exception.*;
import com.scholr.scholr.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final MessageBrokerProducer brokerProducer;
    private final OTPService otpService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtService jwtService;
    private final PasswordService passwordService;


    @Override
    public void handleSignUp(AuthRequest request) {
        String collegeId = request.getCollegeId();

        User user = userRepository.findByCollegeId(collegeId)
                    .orElseThrow(() -> new UserNotFoundException("Invalid College ID"));

        if (user.isVerified()) {
            throw new AlreadyVerifiedException("Account already active. Please login.");
        }

        String hashedPassword = passwordService.hashPassword(request.getPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);

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
    public TokenData verifyOTP(String otp, String collegeId) {
        String otpKey = "OTP_" + collegeId; // otp key
        String cachedOtp = (String) redisTemplate.opsForValue().get(otpKey); // fetch otp from redis

        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new InvalidOTPException("Invalid OTP or OTP expired");
        }

        User user = userRepository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        user.setVerified(true); // set student verify
        userRepository.save(user);
        redisTemplate.delete(otpKey); // delete key

        // generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        String rtKey = "RT_" + collegeId;
        redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));

        return new TokenData(accessToken, refreshToken);
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
    public TokenData handleLogin(AuthRequest authRequest) {
        User user = userRepository.findByCollegeId(authRequest.getCollegeId())
                    .orElseThrow(() -> new UserNotFoundException("User not found !"));

        boolean passwordValid = passwordService.isPasswordValid(user, authRequest.getPassword());

        if(!passwordValid) throw new InvalidPasswordException("Invalid password or college id");

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        String rtKey = "RT_" + user.getCollegeId();
        redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));

        return new TokenData(accessToken, refreshToken);
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

        User user = userRepository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));


        redisTemplate.delete(rtKey);

        String newAccess = jwtService.generateAccessToken(user);
        String newRefresh = jwtService.generateRefreshToken(user);

        redisTemplate.opsForValue().set(rtKey, newRefresh, Duration.ofDays(45));

        return new TokenData(newAccess, newRefresh);
    }


}
