package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
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
}
