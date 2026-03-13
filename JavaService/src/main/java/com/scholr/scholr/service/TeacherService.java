package com.scholr.scholr.service;

import com.scholr.scholr.dto.SubjectData;

import java.util.List;

public interface TeacherService {
    List<SubjectData> findSubjects(String username);
}

