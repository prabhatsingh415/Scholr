package com.scholr.scholr.dto;

public record StudentAddRequest(
        String collegeId, String firstName, String lastName, String email,
        String phoneNo, Long deptId, String rollNo, String courseName,
        Long batchId, Long semesterId, String joiningDate, String gradDate
) {}