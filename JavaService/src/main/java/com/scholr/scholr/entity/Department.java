package com.scholr.scholr.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction; // <--- Naya wala import

@Entity
@Table(name = "departments")
@Data
@SQLDelete(sql = "UPDATE departments SET is_deleted = true WHERE id=?")
@SQLRestriction("is_deleted = false")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deptId;
    private String deptName;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;
}