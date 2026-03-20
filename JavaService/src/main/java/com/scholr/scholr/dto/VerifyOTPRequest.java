package com.scholr.scholr.dto;

public record VerifyOTPRequest(String otp, String collegeId, String fcmId, String deviceId) {}