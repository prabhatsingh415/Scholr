package com.scholr.scholr.enums;

public record ManualAttendanceRequest(
        String collegeId,
        Long sessionId,
        AttendanceStatus status
) {}
