package com.scholr.scholr.dto;

public record SubjectData(
        String subjectName,
        String subjectCode,
        String deptName,
        Integer semester,
        Integer year
       ) {}
