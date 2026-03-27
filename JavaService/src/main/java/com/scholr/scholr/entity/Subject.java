package com.scholr.scholr.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Data
@Table(name = "subject")
@SQLDelete(sql = "UPDATE subject SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
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

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

}