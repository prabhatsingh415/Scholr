package com.scholr.scholr.dto;

import com.scholr.scholr.enums.AttendanceStatus;

public record ManualAttendanceRequest(
        String collegeId,
        Long sessionId,
        AttendanceStatus status
) {}
