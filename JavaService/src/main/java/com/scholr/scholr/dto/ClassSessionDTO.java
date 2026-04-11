package com.scholr.scholr.dto;

public record ClassSessionDTO(
        Long sessionId,
        String subjectName,
        String subjectCode,
        Long semesterId,
        Long deptId,
        Integer semesterNo,
        String departmentName,
        String teacherName,
        String topic,
        String conductedAt,
        boolean isCompleted
) {}