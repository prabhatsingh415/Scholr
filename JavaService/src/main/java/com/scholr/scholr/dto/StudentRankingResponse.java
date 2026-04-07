package com.scholr.scholr.dto;

public record StudentRankingResponse(
        int rank,
        String name,
        String collegeId,
        double cgpa,
        String departmentName,
        int semesterNo,
        int academicYear
) {}