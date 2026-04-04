package com.scholr.scholr.repository;

import com.scholr.scholr.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByCollegeId(String collegeId);

    @Transactional
    @Modifying
    void deleteByCollegeId(String collegeId);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate < :now")
    int deleteExpiredTokens(@Param("now") LocalDateTime now);
}