package com.scholr.scholr.dto;

import java.util.List;

public record TeacherAddRequest(
        String collegeId, String firstName, String lastName,
        String email, String phoneNo, Long deptId, boolean isHod,
        List<Long> subjectIds
) {}