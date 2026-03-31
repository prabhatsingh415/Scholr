package com.scholr.scholr.service;

import com.scholr.scholr.entity.BlackListToken;

import java.time.LocalDateTime;

public interface BlackListTokenService {
    void save(BlackListToken blackListToken);

    boolean isBlacklisted(String token);

    int deleteByExpirationTimeBefore(LocalDateTime expTime);
}


