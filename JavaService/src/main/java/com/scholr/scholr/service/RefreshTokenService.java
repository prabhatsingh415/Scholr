package com.scholr.scholr.service;

import com.scholr.scholr.entity.RefreshToken;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenService {
    void saveOrUpdate(RefreshToken rfToken);

    Optional<RefreshToken> findByCollegeId(String collegeId);

    void saveRefreshToken(String collegeId, String refreshToken);

    void deleteRefreshToken(String collegeId);

    String getRefreshToken(String collegeId);

    int deleteExpiredTokens(LocalDateTime now);
}





