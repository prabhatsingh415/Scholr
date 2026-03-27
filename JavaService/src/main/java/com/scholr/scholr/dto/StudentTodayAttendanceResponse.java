package com.scholr.scholr.dto;

public record StudentTodayAttendanceResponse(
        String subjectName,
        String markedAt,
        String status,
        Long sessionId
) {}