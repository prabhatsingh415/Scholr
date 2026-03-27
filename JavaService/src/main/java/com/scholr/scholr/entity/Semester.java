package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Data
@Table(name = "semester")
@SQLDelete(sql = "UPDATE semester SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer semesterNo;

    @Column(name = "academic_year")
    private Integer year;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

}
