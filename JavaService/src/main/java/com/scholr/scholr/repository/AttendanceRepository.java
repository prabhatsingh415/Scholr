package com.scholr.scholr.repository;

import com.scholr.scholr.dto.StudentTodayAttendanceResponse;
import com.scholr.scholr.entity.Attendance;
import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByStudentAndSession(Student student, ClassSession session);

    Optional<Attendance> findByStudentAndSession(Student student, ClassSession session);


    @Query("SELECT new com.scholr.scholr.dto.StudentTodayAttendanceResponse(" +
            "s.subject.subjectName, " +
            "CAST(a.markedAt AS string), " +
            "CAST(a.status AS string), " +
            "s.sessionId) " +
            "FROM Attendance a JOIN a.session s " +
            "WHERE a.student.collegeId = :collegeId " +
            "AND a.markedAt >= CURRENT_DATE")
    List<StudentTodayAttendanceResponse> findTodayAttendanceByStudent(@Param("collegeId") String collegeId);
}



