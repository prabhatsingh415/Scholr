package com.scholr.scholr.service;

import jakarta.validation.constraints.NotBlank;

public interface DeviceManagementService {
    void checkAndRegister(String deviceId, String fcmId, @NotBlank(message = "College Id can not be blank") String collegeId);
}

