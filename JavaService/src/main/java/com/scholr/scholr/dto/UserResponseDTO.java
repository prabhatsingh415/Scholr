package com.scholr.scholr.dto;

import com.scholr.scholr.enums.Role;


public record UserResponseDTO(
        Long userId,
        String collegeId,
        String firstName,
        String lastName,
        String email,
        String phoneNo,
        Role role,
        String deptName,
        boolean isVerified,
        String rollNo,
        Integer semesterNo,
        Long batchId,

        Boolean isHod
) {}