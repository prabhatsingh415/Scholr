package com.scholr.scholr.service;

import com.scholr.scholr.entity.OTP;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OTPService {
    String generateOTP(int size);

    void saveOTPDB(String collegeId, String otp, LocalDateTime expTime);

    String findOtpByCollegeID(String collegeId, String prefix);

    void deleteOTP(String collegeId, String prefix);

    void storeOTP(String collegeId, String otp, String prefix);

    int deleteExpiredTokens(LocalDateTime now);

    Optional<OTP> findByCollegeId(String collegeId);
}


