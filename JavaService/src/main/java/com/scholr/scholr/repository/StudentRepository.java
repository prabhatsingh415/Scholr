package com.scholr.scholr.repository;

import com.scholr.scholr.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s JOIN s.semester sem WHERE " +
            "(:deptId IS NULL OR s.department.id = :deptId) AND " +
            "(:academicYear IS NULL OR sem.year = :academicYear) " +
            "ORDER BY s.cgpa DESC")
    List<Student> findRankings(@Param("deptId") Long deptId,
                               @Param("academicYear") Integer academicYear);
}
