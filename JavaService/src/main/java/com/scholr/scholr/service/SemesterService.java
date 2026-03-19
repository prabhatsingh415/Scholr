package com.scholr.scholr.service;

import com.scholr.scholr.entity.Semester;

import java.util.Optional;

public interface SemesterService {
    Semester findBySemesterNo(Integer semester);

    Optional<Semester> findById(Long id);
}


