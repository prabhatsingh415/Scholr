package com.scholr.scholr.repository;

import com.scholr.scholr.entity.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    Optional<ClassSession> findByTeacherUserIdAndIsCompletedFalse(Long userId);
}
