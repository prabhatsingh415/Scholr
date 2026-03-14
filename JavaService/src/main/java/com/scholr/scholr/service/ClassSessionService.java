package com.scholr.scholr.service;

import com.scholr.scholr.entity.ClassSession;

import java.util.Optional;

public interface ClassSessionService {
    ClassSession save(ClassSession session);

    Optional<ClassSession> findById(Long sessionId);

    Optional<ClassSession> findActiveSessionByTeacher(Long userId);
}



