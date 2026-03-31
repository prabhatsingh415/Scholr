package com.scholr.scholr.service;

import com.scholr.scholr.entity.BlackListToken;
import com.scholr.scholr.repository.BlackListTokenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
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
    public void save(BlackListToken blackListToken) {
        repository.save(blackListToken);
    }

    @Override
    public boolean isBlacklisted(String token) {
        String redisKey = "BL_" + token;

        // Try Redis First
        try {
            Boolean hasKey = redisTemplate.hasKey(redisKey);
            if (Boolean.TRUE.equals(hasKey)) {
                return true;
            }
        } catch (Exception e) {

            log.error("Redis connection failed during blacklist check. Falling back to DB. Error: {}", e.getMessage());
        }


        boolean existsInDb = repository.existsByToken(token);
        long remainingTime = jwtService.getRemainingExpiry(token);

        if (existsInDb) {
            try {
                redisTemplate.opsForValue().set(redisKey, "true", Duration.ofMillis(remainingTime));
                log.info("Blacklist Healed! Token moved from DB to Cache.");
            } catch (Exception ignored) {
            }
        }
        // If Redis down then try DB
        return existsInDb;
    }

    @Override
    public int deleteByExpirationTimeBefore(LocalDateTime expTime) {
        return repository.deleteExpiredTokens(expTime);
    }
}
