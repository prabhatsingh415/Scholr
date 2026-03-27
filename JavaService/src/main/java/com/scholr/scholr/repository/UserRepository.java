package com.scholr.scholr.repository;

import com.scholr.scholr.dto.StudentDTO;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByCollegeId(String collegeId);

    @Query("SELECT DISTINCT new com.scholr.scholr.dto.StudentDTO(" +
            "s.userId, s.collegeId, s.firstName, s.lastName, s.profilePicURL, " +
            "COALESCE(a.status, com.scholr.scholr.enums.AttendanceStatus.ABSENT)) " +
            "FROM Student s " +
            "JOIN s.department d " +
            "JOIN s.semester sem " +
            "JOIN Subject sub ON sub.department = d AND sub.semester = sem " +
            "LEFT JOIN Attendance a ON a.student = s AND a.session.sessionId = :sessionId " +
            "WHERE sem.Id = :semesterId " +
            "AND d.Id = :deptId " +
            "AND sub.subjectCode = :subjectCode " +
            "AND s.role = 'STUDENT' " +
            "AND s.isVerified = true")
    List<StudentDTO> fetchStudentsForAttendance(
            @Param("subjectCode") String subjectCode,
            @Param("semesterId") Long semesterId,
            @Param("deptId") Long deptId,
            @Param("sessionId") Long sessionId
    );

    @Query("SELECT s.fcmId FROM Student s " +
            "WHERE s.semester.Id = :semesterId " +
            "AND s.department.deptId = :deptId " +
            "AND s.fcmId IS NOT NULL")
    List<String> findAllFcmTokensBySemesterAndDepartment(
            @Param("semesterId") Long semesterId,
            @Param("deptId") String deptId

    );

    List<User> findByRole(Role role);

    List<User> findAllByRole(Role role);

    void deleteByCollegeId(String collegeId);
}