package com.scholr.scholr.service;

import com.scholr.scholr.entity.BlackListToken;
import com.scholr.scholr.repository.BlackListTokenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@Slf4j
public class BlackListTokenServiceImpl implements BlackListTokenService{

    private final BlackListTokenRepository repository;
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtService jwtService;

    @Override
    @CircuitBreaker(name = "redisService", fallbackMethod = "blacklistTokenFallback")
    public void blacklistToken(String token, long remainingTimeMs) {
        String redisKey = "BL_" + token;
        redisTemplate.opsForValue().set(redisKey, "true", Duration.ofMillis(remainingTimeMs));
        log.info("Token blacklisted in Redis for {} ms", remainingTimeMs);
    }

    public void blacklistTokenFallback(String token, long remainingTimeMs, Throwable t) {
        log.error("Redis DOWN during Logout! Falling back to DB for Blacklist. Error: {}", t.getMessage());

        BlackListToken blackListToken = BlackListToken.builder()
                .token(token)
                .expirationTime(LocalDateTime.now().plusNanos(remainingTimeMs * 1_000_000))
                .build();

        this.save(blackListToken);
    }

    @Override
    public void save(BlackListToken blackListToken) {
        repository.save(blackListToken);
    }

    @Override
    @CircuitBreaker(name = "redisService", fallbackMethod = "isBlacklistedFallback")
    public boolean isBlacklisted(String token) {
        String redisKey = "BL_" + token;
        boolean existsInRedis = Boolean.TRUE.equals(redisTemplate.hasKey(redisKey));

        if (!existsInRedis) {
            log.info("[BlacklistTokenService] Token not in Redis, checking DB for: {}", token);

            boolean existsInDb = repository.existsByToken(token);

            if (existsInDb) {
                healRedis(token, "BL_" + token);
                return true;
            }
        }
        return existsInRedis;
    }

    public boolean isBlacklistedFallback(String token, Throwable t) {
        log.error("Circuit OPEN or Redis DOWN! Falling back to DB. Reason: {}", t.getMessage());

        boolean existsInDb = repository.existsByToken(token);

        if (existsInDb) {
            healRedis(token, "BL_" + token);
        }
        return existsInDb;
    }


    @Override
    public int deleteByExpirationTimeBefore(LocalDateTime expTime) {
        return repository.deleteExpiredTokens(expTime);
    }


    private void healRedis(String token, String redisKey) {
        try {
            long remainingTime = jwtService.getRemainingExpiry(token);
            if (remainingTime > 0) {
                redisTemplate.opsForValue().set(redisKey, "true", Duration.ofMillis(remainingTime));
                log.info("Blacklist Healed successfully for token.");
            }
        } catch (Exception ignored) {}
    }
}
