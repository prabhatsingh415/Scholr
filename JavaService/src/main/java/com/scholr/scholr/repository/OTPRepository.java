package com.scholr.scholr.repository;

import com.scholr.scholr.entity.OTP;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByCollegeId(String collegeId);

    @Modifying
    @Transactional
    void deleteByCollegeId(String collegeId);

    @Modifying
    @Query("DELETE FROM OTP o WHERE o.expiryTime < :now")
    int deleteExpiredTokens(@Param("now") LocalDateTime now);
}


