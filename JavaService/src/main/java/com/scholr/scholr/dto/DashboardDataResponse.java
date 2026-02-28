package com.scholr.scholr.dto;

public record DashboardDataResponse(
        String collegeId,
        String firstName,
        String lastName,
        String email,
        String phoneNo,
        String profilePicURL,
        String deptId,
        String role,

        // Student specific fields
        String rollNo,
        String courseName,
        String batchId,
        Double cgpa,
        Integer activeBacklogs
) {}