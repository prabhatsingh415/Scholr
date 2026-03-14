package com.scholr.scholr.repository;

import com.scholr.scholr.entity.Attendance;
import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByStudentAndSession(Student student, ClassSession session);

}

