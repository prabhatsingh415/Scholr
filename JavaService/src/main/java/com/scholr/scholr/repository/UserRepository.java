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

    @Query("SELECT DISTINCT new com.scholr.scholr.dto.StudentDTO(s.userId, s.collegeId, s.firstName, s.lastName, s.profilePicURL) " +
            "FROM Student s " +
            "JOIN s.department d " +
            "JOIN s.semester sem " +
            "JOIN Subject sub ON sub.department = d AND sub.semester = sem " +
            "WHERE sem.Id = :semesterId " +
            "AND d.Id = :deptId " +
            "AND sub.subjectCode = :subjectCode " +
            "AND s.role = 'STUDENT' " +
            "AND s.isVerified = true")
    List<StudentDTO> fetchStudentsForAttendance(
            @Param("subjectCode") String subjectCode,
            @Param("semesterId") Long semesterId,
            @Param("deptId") Long deptId
    );

    List<User> findByRole(Role role);

    List<User> findAllByRole(Role role);
}