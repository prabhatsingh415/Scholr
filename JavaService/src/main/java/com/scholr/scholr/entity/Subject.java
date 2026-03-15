package com.scholr.scholr.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjectName;
    private String subjectCode; // unique code
    private Integer credit;

    @ManyToOne
    @JsonIgnoreProperties({"subjects", "batches", "students"})
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @ManyToOne
    @JsonIgnoreProperties({"subjects", "teacher", "deptId"})
    @JoinColumn(name = "dept_id")
    private Department department;

    @ManyToOne
    @JsonIgnoreProperties({"subjects", "password", "email", "phoneNo"})
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

}