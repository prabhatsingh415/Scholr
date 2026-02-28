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

        // Teacher Specific (Optional/Null for others)
        Boolean isHod,
        Boolean isClassTeacher,

        // Student Specific (Optional/Null for others)
        String rollNo,
        String batchId,
        String courseName
) {
}