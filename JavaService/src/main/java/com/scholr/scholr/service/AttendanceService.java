package com.scholr.scholr.service;

import com.scholr.scholr.dto.QRResponse;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.dto.StudentAttendanceRequest;
import com.scholr.scholr.dto.StudentTodayAttendanceResponse;
import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.dto.ManualAttendanceRequest;
import jakarta.validation.Valid;

import java.util.List;

public interface AttendanceService {
    QRResponse verifyAndGenerateQR(StartAttendanceRequest attendanceRequest, String collegeId);

    String markAttendance(@Valid StudentAttendanceRequest request, String collegeId);

    ClassSession getActiveTeacherSession(String username);

    void endSession(Long sessionId);

    void toggleAttendance(@Valid ManualAttendanceRequest request);

    List<StudentTodayAttendanceResponse> getStudentTodayHistory(String collegeId);
}




