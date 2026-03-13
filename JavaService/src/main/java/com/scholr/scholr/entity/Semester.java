package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer semesterNo;

    @Column(name = "academic_year")
    private Integer year;
}
