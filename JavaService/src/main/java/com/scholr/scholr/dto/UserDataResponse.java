package com.scholr.scholr.dto;

import com.scholr.scholr.enums.Role;
import lombok.Builder;

@Builder
public record UserDataResponse(
        // Common Fields
        String collegeId,
        String firstName,
        String lastName,
        String email,
        Role role,
        String profilePicURL,
        String deptId,
        boolean isVerified,

        // Teacher Specific
        Boolean isHod,

        // Student Specific
        String rollNo,
        String batchId,
        String courseName
) {
}