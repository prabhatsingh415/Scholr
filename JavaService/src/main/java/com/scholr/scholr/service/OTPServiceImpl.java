package com.scholr.scholr.service;

import com.scholr.scholr.entity.OTP;
import com.scholr.scholr.exception.OtpNotFoundException;
import com.scholr.scholr.repository.OTPRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
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
    public void saveOTPDB(String collegeId, String newOTP, LocalDateTime expTime) {
        OTP otp = OTP.builder()
                 .collegeId(collegeId)
                 .otp(newOTP)
                 .expiryDate(expTime)
                 .build();

        repository.save(otp);
    }

    @Override
    public String findOtpByCollegeID(String collegeId, String prefix) {
        String otpKey = prefix + collegeId;
        String otp = null;

        // Try Redis
        try {
            otp = redisTemplate.opsForValue().get(otpKey);
        } catch (Exception e) {
            log.error("Redis unreachable during OTP fetch. Falling back to DB.");
        }

        if (otp == null) {
            OTP otpEntity = repository.findByCollegeId(collegeId)
                    .orElseThrow(() -> new OtpNotFoundException("OTP not found or expired!"));
            otp = otpEntity.getOtp();
        }

        return otp;
    }

    @Override
    @Transactional
    public void deleteOTP(String collegeId, String prefix) {
        String otpKey = prefix + collegeId;

        try {
            redisTemplate.delete(otpKey);
        } catch (Exception e) {
            log.error("Failed to delete from Redis for key: {}", otpKey);
        }

        repository.deleteByCollegeId(collegeId);
    }
}
