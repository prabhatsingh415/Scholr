package com.scholr.scholr.service;

import java.time.LocalDateTime;

public interface OTPService {
    String generateOTP(int size);

    void saveOTPDB(String collegeId, String otp, LocalDateTime expTime);

    String findOtpByCollegeID(String collegeId, String prefix);

    void deleteOTP(String collegeId, String prefix);

    void storeOTP(String collegeId, String otp, String prefix);

    int deleteExpiredTokens(LocalDateTime now);
}


