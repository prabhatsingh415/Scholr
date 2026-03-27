package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "batch")
@SQLDelete(sql = "UPDATE batch SET is_deleted = true WHERE batchId=?")
@SQLRestriction("is_deleted = false")
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long batchId;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;


    private LocalDateTime startingTime;
    private LocalDateTime endingTime;

    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "curr_sem_id")
    private Semester semester;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
}
