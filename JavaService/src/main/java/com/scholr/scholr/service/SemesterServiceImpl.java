package com.scholr.scholr.service;

import com.scholr.scholr.entity.Semester;
import com.scholr.scholr.repository.SemesterRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class SemesterServiceImpl implements SemesterService{
    private final SemesterRepository repository;

    @Override
    public Semester findBySemesterNo(Integer semester) {
        return repository.findBySemesterNo(semester);
    }

    @Override
    public Optional<Semester> findById(Long id) {
        return repository.findById(id);
    }
}

