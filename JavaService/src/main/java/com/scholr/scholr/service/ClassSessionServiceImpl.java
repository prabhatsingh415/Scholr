package com.scholr.scholr.service;

import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.repository.ClassSessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClassSessionServiceImpl implements ClassSessionService{

    private final ClassSessionRepository repository;

    @Override
    public ClassSession save(ClassSession session) {
        return repository.save(session);
    }
}
