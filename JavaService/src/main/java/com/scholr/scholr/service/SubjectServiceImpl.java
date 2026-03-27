package com.scholr.scholr.service;

import com.scholr.scholr.entity.Subject;
import com.scholr.scholr.repository.SubjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SubjectServiceImpl implements SubjectService{

    private final SubjectRepository repository;

    @Override
    public List<Subject> findAllById(List<Long> longs) {
        return repository.findAllById(longs);
    }
}
