package com.scholr.scholr.service;

import com.scholr.scholr.entity.BlackListToken;
import com.scholr.scholr.repository.BlackListTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class BlackListTokenServiceImplTest {

    @Mock private BlackListTokenRepository blackListTokenRepository;
    @Mock private RedisTemplate<String, String> redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;
    @Mock private JwtService jwtService;

    @InjectMocks
    private BlackListTokenServiceImpl blackListTokenService;

    @BeforeEach
    void setUp() {
        // Essential: Link RedisTemplate to ValueOperations mock
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testBlacklistToken_ShouldStoreInRedis() {
        blackListTokenService.blacklistToken("token123", 3600000L);
        verify(valueOperations, times(1)).set(eq("BL_token123"), eq("true"), any());
    }

    @Test
    void testIsBlacklisted_TokenInRedis_ShouldReturnTrue() {
        when(redisTemplate.hasKey("BL_token123")).thenReturn(true);
        boolean result = blackListTokenService.isBlacklisted("token123");
        assertThat(result).isTrue();
    }

    @Test
    void testIsBlacklisted_TokenNotInRedisButInDB_ShouldReturnTrue() {
        when(redisTemplate.hasKey(anyString())).thenReturn(false);
        when(blackListTokenRepository.existsByToken(anyString())).thenReturn(true);
        when(jwtService.getRemainingExpiry(anyString())).thenReturn(3600000L);

        boolean result = blackListTokenService.isBlacklisted("token123");
        assertThat(result).isTrue();
    }

    @Test
    void testBlacklistToken_WithDifferentTimes_ShouldHandleAll() {
        blackListTokenService.blacklistToken("token1", 1000L);
        blackListTokenService.blacklistToken("token2", 5000L);

        verify(valueOperations, times(2)).set(anyString(), anyString(), any());
    }
}