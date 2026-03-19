package com.scholr.scholr.service;

import com.scholr.scholr.entity.Department;

import java.util.Optional;

public interface DepartmentService {
    Optional<Department> findById(Long Id);
}

