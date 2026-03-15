package com.scholr.scholr.dto;

public record StartAttendanceRequest(
        String subjectName,
        Integer semester,
        String topic,
        Double teacherLat,
        Double teacherLng
) {}