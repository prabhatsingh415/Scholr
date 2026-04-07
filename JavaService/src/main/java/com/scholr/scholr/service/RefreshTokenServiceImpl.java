package com.scholr.scholr.service;

import com.scholr.scholr.entity.RefreshToken;
import com.scholr.scholr.repository.RefreshTokenRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService{

    private final RefreshTokenRepository repository;
    private final RedisTemplate<String, String> redisTemplate;

    @Override
    public void saveOrUpdate(RefreshToken newToken) {
        Optional<RefreshToken> existingToken = repository.findByCollegeId(newToken.getCollegeId());

        if (existingToken.isPresent()) {
            RefreshToken tokenToUpdate = existingToken.get();
            tokenToUpdate.setToken(newToken.getToken());
            tokenToUpdate.setExpiryDate(newToken.getExpiryDate());
            repository.save(tokenToUpdate);
            log.info("Refresh Token updated for College ID: {}", newToken.getCollegeId());
        } else {
            repository.save(newToken);
            log.info("New Refresh Token saved for College ID: {}", newToken.getCollegeId());
        }
    }

    @Override
    public void deleteRefreshToken(String collegeId) {
        String rtKey = "RT_" + collegeId;
        try {
            redisTemplate.delete(rtKey);
        } catch (Exception e) {
            log.error("Redis delete failed for Refresh Token: {}. Relying on DB cleanup.", rtKey);
        }
        repository.deleteByCollegeId(collegeId); // DB cleanup
    }

    @Override
    public Optional<RefreshToken> findByCollegeId(String collegeId) {
        return repository.findByCollegeId(collegeId);
    }

    @Override
    @CircuitBreaker(name = "redisService", fallbackMethod = "saveRefreshTokenFallback")
    public void saveRefreshToken(String collegeId, String refreshToken) {
        String rtKey = "RT_" + collegeId;
        redisTemplate.opsForValue().set(rtKey, refreshToken, Duration.ofDays(45));
    }

    // FALLBACK
    public void saveRefreshTokenFallback(String collegeId, String refreshToken, Throwable t) {
        log.error("Redis DOWN! Saving Refresh Token to DB for ID: {}", collegeId);
        RefreshToken rfToken = RefreshToken.builder()
                .collegeId(collegeId)
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(45))
                .build();
        this.saveOrUpdate(rfToken);
    }

    @Override
    @CircuitBreaker(name = "redisService", fallbackMethod = "getRefreshTokenFallback")
    public String getRefreshToken(String collegeId) {
        String rtKey = "RT_" + collegeId;
        String token = redisTemplate.opsForValue().get(rtKey);

        if (token == null) {
            log.info("[RefreshTokenService] Refresh Token missing in Redis, checking DB for ID: {}", collegeId);
            token = repository.findByCollegeId(collegeId)
                    .map(RefreshToken::getToken)
                    .orElse(null);

            if (token != null) {
                try {
                    redisTemplate.opsForValue().set(rtKey, token, Duration.ofDays(45));
                } catch (Exception ignored) {}
            }
        }
        return token;
    }

    @Override
    public int deleteExpiredTokens(LocalDateTime now) {
        return repository.deleteExpiredTokens(now);
    }

    // FALLBACK
    public String getRefreshTokenFallback(String collegeId, Throwable t) {
        log.warn("Circuit OPEN! Fetching Refresh Token from DB for ID: {}, Error: {}", collegeId, t.getMessage());
        return repository.findByCollegeId(collegeId)
                .map(RefreshToken::getToken)
                .orElse(null);
    }
}
