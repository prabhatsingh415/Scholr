package com.scholr.scholr.service;

import com.scholr.scholr.dto.QRResponse;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.dto.StudentAttendanceRequest;
import com.scholr.scholr.entity.ClassSession;
import jakarta.validation.Valid;

public interface AttendanceService {
    QRResponse verifyAndGenerateQR(StartAttendanceRequest attendanceRequest, String collegeId);

    String markAttendance(@Valid StudentAttendanceRequest request, String collegeId);

    ClassSession getActiveTeacherSession(String username);

    void endSession(Long sessionId);
}



