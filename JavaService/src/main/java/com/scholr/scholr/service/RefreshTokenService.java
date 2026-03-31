package com.scholr.scholr.service;

import com.scholr.scholr.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    void saveOrUpdate(RefreshToken rfToken);

    void deleteToken(String collegeId);

    Optional<RefreshToken> findByCollegeId(String collegeId);
}



