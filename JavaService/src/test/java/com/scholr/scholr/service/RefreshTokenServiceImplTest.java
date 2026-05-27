package com.scholr.scholr.service;

import com.scholr.scholr.entity.RefreshToken;
import com.scholr.scholr.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class RefreshTokenServiceImplTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RefreshTokenServiceImpl refreshTokenService;

    private RefreshToken testToken;

    @BeforeEach
    void setUp() {
        testToken = RefreshToken.builder()
                .id(1L)
                .collegeId("STU001")
                .token("refreshToken123")
                .expiryDate(LocalDateTime.now().plusDays(45))
                .build();

        Mockito.lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testSaveOrUpdate_NewToken_ShouldSave() {
        when(refreshTokenRepository.findByCollegeId("STU001")).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(testToken)).thenReturn(testToken);

        refreshTokenService.saveOrUpdate(testToken);

        verify(refreshTokenRepository, times(1)).save(testToken);
    }

    @Test
    void testSaveOrUpdate_ExistingToken_ShouldUpdate() {
        RefreshToken existingToken = RefreshToken.builder()
                .id(1L)
                .collegeId("STU001")
                .token("oldToken")
                .expiryDate(LocalDateTime.now().plusDays(30))
                .build();

        when(refreshTokenRepository.findByCollegeId("STU001")).thenReturn(Optional.of(existingToken));
        when(refreshTokenRepository.save(existingToken)).thenReturn(existingToken);

        refreshTokenService.saveOrUpdate(testToken);

        assertThat(existingToken.getToken()).isEqualTo("refreshToken123");
        verify(refreshTokenRepository, times(1)).save(existingToken);
    }

    @Test
    void testDeleteRefreshToken_ShouldDeleteFromRedisAndDB() {
        refreshTokenService.deleteRefreshToken("STU001");

        verify(redisTemplate, times(1)).delete("RT_STU001");
        verify(refreshTokenRepository, times(1)).deleteByCollegeId("STU001");
    }

    @Test
    void testFindByCollegeId_ShouldReturnToken() {
        when(refreshTokenRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testToken));

        Optional<RefreshToken> result = refreshTokenService.findByCollegeId("STU001");

        assertThat(result).isPresent();
        assertThat(result.get().getToken()).isEqualTo("refreshToken123");
        verify(refreshTokenRepository, times(1)).findByCollegeId("STU001");
    }

    @Test
    void testFindByCollegeId_NotFound_ShouldReturnEmpty() {
        when(refreshTokenRepository.findByCollegeId("INVALID")).thenReturn(Optional.empty());

        Optional<RefreshToken> result = refreshTokenService.findByCollegeId("INVALID");

        assertThat(result).isEmpty();
    }

    @Test
    void testSaveRefreshToken_ShouldStoreInRedis() {
        refreshTokenService.saveRefreshToken("STU001", "refreshToken123");

        verify(valueOperations, times(1)).set(eq("RT_STU001"), eq("refreshToken123"), any());
    }

    @Test
    void testGetRefreshToken_FromRedis_ShouldReturnToken() {
        when(valueOperations.get("RT_STU001")).thenReturn("refreshToken123");

        String result = refreshTokenService.getRefreshToken("STU001");

        assertThat(result).isEqualTo("refreshToken123");
        verify(valueOperations, times(1)).get("RT_STU001");
    }

    @Test
    void testGetRefreshToken_FromDB_WhenNotInRedis_ShouldReturnToken() {
        when(valueOperations.get("RT_STU001")).thenReturn(null);
        when(refreshTokenRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testToken));

        String result = refreshTokenService.getRefreshToken("STU001");

        assertThat(result).isEqualTo("refreshToken123");
    }

    @Test
    void testGetRefreshToken_NullResponse_ShouldReturnNull() {
        when(valueOperations.get("RT_STU001")).thenReturn(null);
        when(refreshTokenRepository.findByCollegeId("STU001")).thenReturn(Optional.empty());

        String result = refreshTokenService.getRefreshToken("STU001");

        assertThat(result).isNull();
    }

    @Test
    void testDeleteExpiredTokens_ShouldCallRepository() {
        LocalDateTime now = LocalDateTime.now();
        when(refreshTokenRepository.deleteExpiredTokens(now)).thenReturn(3);

        int result = refreshTokenService.deleteExpiredTokens(now);

        assertThat(result).isEqualTo(3);
        verify(refreshTokenRepository, times(1)).deleteExpiredTokens(now);
    }

    @Test
    void testSaveOrUpdate_MultipleTokensForSameUser_ShouldUpdateLatest() {
        RefreshToken oldToken = RefreshToken.builder()
                .id(1L)
                .collegeId("STU001")
                .token("oldToken")
                .expiryDate(LocalDateTime.now())
                .build();

        RefreshToken newToken = RefreshToken.builder()
                .id(1L)
                .collegeId("STU001")
                .token("newToken")
                .expiryDate(LocalDateTime.now().plusDays(45))
                .build();

        when(refreshTokenRepository.findByCollegeId("STU001")).thenReturn(Optional.of(oldToken));
        when(refreshTokenRepository.save(oldToken)).thenReturn(oldToken);

        refreshTokenService.saveOrUpdate(newToken);

        assertThat(oldToken.getToken()).isEqualTo("newToken");
        assertThat(oldToken.getExpiryDate()).isAfter(LocalDateTime.now());
        verify(refreshTokenRepository, times(1)).save(oldToken);
    }
}
