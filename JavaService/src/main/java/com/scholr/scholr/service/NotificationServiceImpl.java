package com.scholr.scholr.service;

import com.scholr.scholr.dto.NotificationPayload;
import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Semester;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService{

    private final UserService userService;
    private final MessageBrokerProducer msgBroker;

    @Override
    public void sendQRNotification(Semester semester, Department department, String subjectName, Long sessionId ) {

        List<String> tokens = userService.findAllFcmTokensBySemesterAndDepartment(semester.getId(), department.getDeptId());

        if (tokens == null || tokens.isEmpty()) {
            log.warn("[Notification] No FCM tokens found for Semester: {} and Dept: {}. Skipping push.", semester.getSemesterNo(), department.getDeptName());
            return;
        }

        NotificationPayload payload = NotificationPayload.builder()
                .fcmTokens(tokens)
                .title("Attendance Session Started 📢")
                .body("Attendance for " + subjectName + " is now open. Scan the QR code in class to mark your presence.")
                .data(Map.of(
                        "type", "ATTENDANCE_QR_GENERATED",
                        "subject", subjectName,
                        "sessionId", String.valueOf(sessionId),
                        "priority", "high",
                        "screen", "SCANNER_SCREEN"
                ))
                .build();

        sendMsg(payload);
    }

    private void sendMsg(NotificationPayload payload) {
        msgBroker.sendPushNotification(payload);
    }
}
