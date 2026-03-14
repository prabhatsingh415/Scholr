package com.scholr.scholr.service;

import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.repository.ClassSessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ClassSessionServiceImpl implements ClassSessionService{

    private final ClassSessionRepository repository;

    @Override
    public ClassSession save(ClassSession session) {
        return repository.save(session);
    }

    @Override
    public Optional<ClassSession> findById(Long sessionId) {
        return repository.findById(sessionId);
    }

    @Override
    public Optional<ClassSession> findActiveSessionByTeacher(Long userId) {
        return repository.findByTeacherUserIdAndIsCompletedFalse(userId);
    }
}
