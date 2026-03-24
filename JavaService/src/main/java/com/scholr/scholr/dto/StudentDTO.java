package com.scholr.scholr.dto;

import com.scholr.scholr.enums.AttendanceStatus;

public record StudentDTO(
        Long userId,
        String collegeId,
        String firstName,
        String lastName,
        String profilePicURL,
        AttendanceStatus status
) {}