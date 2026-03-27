package com.scholr.scholr.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "student_details")
@PrimaryKeyJoinColumn(name = "user_id") // Link to User's ID
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Student extends User {

    @Column(nullable = false)
    private String rollNo;

    @Column(nullable = false)
    private String courseName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @Column(name = "device_id", unique = true)
    private String deviceId;       // for device binding

    @ManyToOne
    private Batch batch;

    private double cgpa = 0.0;
    private Integer activeBacklogs = 0;

    @Column(nullable = false)
    private LocalDate dateOfJoining;

    @Column(nullable = false)
    private LocalDate expectedDateOfGraduation;

}
