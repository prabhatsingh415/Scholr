package com.scholr.scholr.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne
    @JsonIgnoreProperties({"sessions"})
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JsonIgnoreProperties({"sessions", "subjects", "password"})
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @ManyToOne
    @JsonIgnoreProperties({"sessions", "batches", "students"})
    @JoinColumn(name = "semester_no")
    private Semester semester;

    private String topic;
    private LocalDateTime conductedAt = LocalDateTime.now();
    private boolean isCompleted = true;
}