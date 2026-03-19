package com.scholr.scholr.service;

import com.scholr.scholr.entity.Department;
import com.scholr.scholr.repository.DepartmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService{
    private final DepartmentRepository repository;


    @Override
    public Optional<Department> findById(Long id) {
        return repository.findById(id);
    }
}
