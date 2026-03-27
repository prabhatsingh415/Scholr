package com.scholr.scholr.repository;

import com.scholr.scholr.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    Semester findBySemesterNo(Integer semester);
}

