package com.scholr.scholr.service;

import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.repository.ClassSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClassSessionServiceImplTest {

    @Mock
    private ClassSessionRepository classSessionRepository;

    @InjectMocks
    private ClassSessionServiceImpl classSessionService;

    private ClassSession testSession;

    @BeforeEach
    void setUp() {
        testSession = new ClassSession();
        testSession.setSessionId(1L);
        testSession.setTopic("Arrays and Strings");
        testSession.setCompleted(false);
        testSession.setConductedAt(LocalDateTime.now());
    }

    @Test
    void testSave_ShouldPersistSession() {
        when(classSessionRepository.save(testSession)).thenReturn(testSession);

        ClassSession result = classSessionService.save(testSession);

        assertThat(result).isNotNull();
        assertThat(result.getSessionId()).isEqualTo(1L);
        verify(classSessionRepository, times(1)).save(testSession);
    }

    @Test
    void testSave_NewSession_ShouldReturnSavedSession() {
        ClassSession newSession = new ClassSession();
        newSession.setTopic("Data Structures");
        newSession.setCompleted(false);

        ClassSession savedSession = new ClassSession();
        savedSession.setSessionId(2L);
        savedSession.setTopic("Data Structures");
        savedSession.setCompleted(false);

        when(classSessionRepository.save(newSession)).thenReturn(savedSession);

        ClassSession result = classSessionService.save(newSession);

        assertThat(result.getSessionId()).isEqualTo(2L);
        verify(classSessionRepository, times(1)).save(newSession);
    }

    @Test
    void testFindById_ShouldReturnSession() {
        when(classSessionRepository.findById(1L)).thenReturn(Optional.of(testSession));

        Optional<ClassSession> result = classSessionService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getSessionId()).isEqualTo(1L);
        verify(classSessionRepository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound_ShouldReturnEmpty() {
        when(classSessionRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<ClassSession> result = classSessionService.findById(999L);

        assertThat(result).isEmpty();
        verify(classSessionRepository, times(1)).findById(999L);
    }

    @Test
    void testFindActiveSessionByTeacher_ShouldReturnActiveSession() {
        when(classSessionRepository.findByTeacherUserIdAndIsCompletedFalse(1L))
                .thenReturn(Optional.of(testSession));

        Optional<ClassSession> result = classSessionService.findActiveSessionByTeacher(1L);

        assertThat(result).isPresent();
        assertThat(result.get().isCompleted()).isFalse();
        verify(classSessionRepository, times(1)).findByTeacherUserIdAndIsCompletedFalse(1L);
    }

    @Test
    void testFindActiveSessionByTeacher_NoActiveSession_ShouldReturnEmpty() {
        when(classSessionRepository.findByTeacherUserIdAndIsCompletedFalse(999L))
                .thenReturn(Optional.empty());

        Optional<ClassSession> result = classSessionService.findActiveSessionByTeacher(999L);

        assertThat(result).isEmpty();
        verify(classSessionRepository, times(1)).findByTeacherUserIdAndIsCompletedFalse(999L);
    }

    @Test
    void testFindActiveSessionByTeacher_WithCompletedSession_ShouldReturnEmpty() {
        ClassSession completedSession = new ClassSession();
        completedSession.setSessionId(2L);
        completedSession.setCompleted(true);

        when(classSessionRepository.findByTeacherUserIdAndIsCompletedFalse(1L))
                .thenReturn(Optional.empty());

        Optional<ClassSession> result = classSessionService.findActiveSessionByTeacher(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void testSave_MultiipleSessions_ShouldPersistAll() {
        ClassSession session1 = new ClassSession();
        session1.setSessionId(1L);

        ClassSession session2 = new ClassSession();
        session2.setSessionId(2L);

        when(classSessionRepository.save(session1)).thenReturn(session1);
        when(classSessionRepository.save(session2)).thenReturn(session2);

        ClassSession result1 = classSessionService.save(session1);
        ClassSession result2 = classSessionService.save(session2);

        assertThat(result1.getSessionId()).isEqualTo(1L);
        assertThat(result2.getSessionId()).isEqualTo(2L);
        verify(classSessionRepository, times(2)).save(any(ClassSession.class));
    }

    @Test
    void testFindById_DifferentIds_ShouldReturnCorrectSession() {
        ClassSession session1 = new ClassSession();
        session1.setSessionId(1L);
        session1.setTopic("Topic 1");

        ClassSession session2 = new ClassSession();
        session2.setSessionId(2L);
        session2.setTopic("Topic 2");

        when(classSessionRepository.findById(1L)).thenReturn(Optional.of(session1));
        when(classSessionRepository.findById(2L)).thenReturn(Optional.of(session2));

        Optional<ClassSession> result1 = classSessionService.findById(1L);
        Optional<ClassSession> result2 = classSessionService.findById(2L);

        assertThat(result1).isPresent();
        assertThat(result1.get().getTopic()).isEqualTo("Topic 1");
        assertThat(result2).isPresent();
        assertThat(result2.get().getTopic()).isEqualTo("Topic 2");
    }
}

