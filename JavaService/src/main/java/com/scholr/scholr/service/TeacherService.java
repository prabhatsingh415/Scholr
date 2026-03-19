package com.scholr.scholr.service;

import com.scholr.scholr.dto.FetchStudentWithSubRequest;
import com.scholr.scholr.dto.StudentDTO;
import com.scholr.scholr.dto.SubjectData;
import jakarta.validation.Valid;

import java.util.List;

public interface TeacherService {
    List<SubjectData> findSubjects(String username);

    List<StudentDTO> fetchStudentWithSub(@Valid FetchStudentWithSubRequest request);
}


