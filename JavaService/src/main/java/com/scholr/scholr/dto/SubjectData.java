package com.scholr.scholr.dto;

import com.scholr.scholr.enums.AttendanceStatus;

public record SubjectData(
        String subjectName,
        String subjectCode,
        String deptName,
        Integer semester,
        Integer year
) {}
