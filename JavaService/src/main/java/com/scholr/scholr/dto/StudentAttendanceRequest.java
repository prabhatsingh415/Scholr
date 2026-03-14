package com.scholr.scholr.dto;

public record StudentAttendanceRequest(
        double studentLat,
        double studentLng,
        String token,
        String deviceId
){}
