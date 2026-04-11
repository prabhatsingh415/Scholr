package com.scholr.scholr.entity;

import com.scholr.scholr.enums.NoticeCategory;
import com.scholr.scholr.enums.NoticeScope;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notices")
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String contentLink;

    @Enumerated(EnumType.STRING)
    private NoticeScope scope; // PUBLIC, PRIVATE

    @Enumerated(EnumType.STRING)
    private NoticeCategory category; // EXAM, EVENT, GENERAL

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department; // Null if for all (Admin notice)

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean isActive = true;
}

