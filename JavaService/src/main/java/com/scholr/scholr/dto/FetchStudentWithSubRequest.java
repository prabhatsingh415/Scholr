package com.scholr.scholr.dto;

public record FetchStudentWithSubRequest(
        String subjectCode,
        Long semesterId,
        Long deptId,
        Long sessionId
        ){}
