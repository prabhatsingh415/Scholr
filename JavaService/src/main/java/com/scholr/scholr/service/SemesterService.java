package com.scholr.scholr.service;

import com.scholr.scholr.dto.SemesterRequest;
import com.scholr.scholr.entity.Semester;

import java.util.List;
import java.util.Optional;

public interface SemesterService {
    Semester findBySemesterNo(Integer semester);

    Optional<Semester> findById(Long id);

    Semester addSemester(SemesterRequest request);

    List<Semester> addSemestersBulk(List<SemesterRequest> requests);

    List<Semester> findAll();
}





