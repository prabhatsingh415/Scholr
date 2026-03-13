package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class AttendanceQrSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qrSessionId;

    @OneToOne
    @JoinColumn(name = "session_id")
    private ClassSession classSession;

    @Column(unique = true)
    private String qrToken;

    private Double teacherLat;
    private Double teacherLng;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime expiresAt;

    private boolean isActive = true;
}
