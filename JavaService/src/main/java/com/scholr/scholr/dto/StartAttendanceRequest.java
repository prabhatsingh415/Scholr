package com.scholr.scholr.dto;

public record StartAttendanceRequest(
        String subjectName,
        Long batchId,
        String topic,
        Double teacherLat,
        Double teacherLng
) {}