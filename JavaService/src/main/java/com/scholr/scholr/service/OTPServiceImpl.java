package com.scholr.scholr.service;

import com.scholr.scholr.entity.OTP;
import com.scholr.scholr.exception.InvalidOTPException;
import com.scholr.scholr.exception.OtpNotFoundException;
import com.scholr.scholr.repository.OTPRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@AllArgsConstructor
@Slf4j
public class OTPServiceImpl implements OTPService{

    private final OTPRepository repository;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public String generateOTP(int size) {
        StringBuilder otp = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < size; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }


    @Override
    @CircuitBreaker(name = "redisService", fallbackMethod = "storeOTPFallback")
    public void storeOTP(String collegeId, String otp, String prefix) {
        redisTemplate.opsForValue().set(prefix + collegeId, otp, Duration.ofMinutes(10));
    }

    public void storeOTPFallback(String collegeId, String otp, String prefix, Throwable t) {
        log.error("Redis unreachable! Circuit OPEN. Switching to DB for ID: {}. Prefix: {}, Error: {}",
                collegeId, prefix, t.getMessage());
        saveOTPDB(collegeId, otp, LocalDateTime.now().plusMinutes(10));
    }

    @Override
    public int deleteExpiredTokens(LocalDateTime now) {
        return repository.deleteExpiredTokens(now);
    }

    @Override
    public Optional<OTP> findByCollegeId(String collegeId) {
        return repository.findByCollegeId(collegeId);
    }


    @Override
    public void saveOTPDB(String collegeId, String newOTP, LocalDateTime expTime) {
        OTP otp = OTP.builder()
                 .collegeId(collegeId)
                 .otp(newOTP)
                 .expiryTime(expTime)
                 .build();

        repository.save(otp);
    }

    @Override
    @CircuitBreaker(name = "redisService", fallbackMethod = "findOtpFallback")
    public String findOtpByCollegeID(String collegeId, String prefix) {
        String otp = redisTemplate.opsForValue().get(prefix + collegeId);

        if (otp == null) {
            log.info("OTP not in Redis, checking DB ID: {}", collegeId);

            OTP otpEntity = repository.findByCollegeId(collegeId)
                    .orElseThrow(() -> new OtpNotFoundException("OTP not found or expired!"));

            if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
                repository.delete(otpEntity);
                throw new InvalidOTPException("Invalid OTP or OTP expired");
            }
            otp = otpEntity.getOtp();

        }

        return otp;
    }

    public String findOtpFallback(String collegeId, String prefix, Throwable t) {
        log.warn("Circuit OPEN! Fetching OTP from DB for ID: {} , Prefix: {}, Error: {}", collegeId, prefix, t.getMessage());
        OTP otpEntity = repository.findByCollegeId(collegeId)
                .orElseThrow(() -> new OtpNotFoundException("OTP not found or expired in DB!"));
        return otpEntity.getOtp();
    }

    @Override
    @Transactional
    public void deleteOTP(String collegeId, String prefix) {
        String otpKey = prefix + collegeId;

        repository.deleteByCollegeId(collegeId);

        try {
            redisTemplate.delete(otpKey);
        } catch (Exception e) {
            log.error("Failed to delete from Redis for key: {}", otpKey);
        }
    }
}
