package com.scholr.scholr.repository;

import com.scholr.scholr.entity.OTP;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByCollegeId(String collegeId);

    @Modifying
    @Transactional
    void deleteByCollegeId(String collegeId);
}


