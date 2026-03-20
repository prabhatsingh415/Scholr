package com.scholr.scholr.service;

import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.exception.DeviceMismatchException;
import com.scholr.scholr.exception.UserNotFoundException;
import com.scholr.scholr.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class DeviceManagementServiceImpl implements DeviceManagementService {

    private final UserRepository userRepository;


    // TODO: Add an API for admin to reset the device ID for a specific student

    @Override
    @Transactional
    public void checkAndRegister(String deviceId, String fcmId, String collegeId) {
        User user = userRepository.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("User with ID " + collegeId + " not found!"));

        if (fcmId != null && !fcmId.equals(user.getFcmId())) {
            user.setFcmId(fcmId);
            log.info("[DeviceMgmt] Updated FCM Token for user: {}", collegeId);
        }

        // Student-specific Device Binding
        if (user instanceof Student student) {
            String storedDeviceId = student.getDeviceId();

            if (storedDeviceId == null) {
                student.setDeviceId(deviceId);
                log.info("[DeviceMgmt] First time binding: Device {} locked for student {}", deviceId, collegeId);
            } else if (!storedDeviceId.equals(deviceId)) {
                log.warn("[DeviceMgmt] SECURITY ALERT: Device mismatch for student {}. Expected: {}, Found: {}",
                        collegeId, storedDeviceId, deviceId);
                throw new DeviceMismatchException("This account is bound to another device. Please use your registered phone.");
            }
        }

        userRepository.save(user);
    }
}