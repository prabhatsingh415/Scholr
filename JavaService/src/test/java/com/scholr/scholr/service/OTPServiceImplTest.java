package com.scholr.scholr.service;

import com.scholr.scholr.entity.OTP;
import com.scholr.scholr.exception.InvalidOTPException;
import com.scholr.scholr.exception.OtpNotFoundException;
import com.scholr.scholr.repository.OTPRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class OTPServiceImplTest {

    @Mock
    private OTPRepository otpRepository;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private OTPServiceImpl otpService;

    private OTP testOtp;

    @BeforeEach
    void setUp() {
        testOtp = OTP.builder()
                .id(1L)
                .collegeId("STU001")
                .otp("123456")
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        Mockito.lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testGenerateOTP_ShouldGenerateOTPOfGivenSize() {
        String otp = otpService.generateOTP(6);

        assertThat(otp).isNotNull();
        assertThat(otp).hasSize(6);
        assertThat(otp).matches("\\d{6}");
    }

    @Test
    void testGenerateOTP_WithDifferentSize_ShouldGenerateCorrectSize() {
        String otp = otpService.generateOTP(4);

        assertThat(otp).hasSize(4);
        assertThat(otp).matches("\\d{4}");
    }

    @Test
    void testStoreOTP_ShouldStoreInRedis() {
        otpService.storeOTP("STU001", "123456", "OTP_");

        verify(valueOperations, times(1)).set(eq("OTP_STU001"), eq("123456"), any());
    }

    @Test
    void testFindOtpByCollegeID_FromRedis_ShouldReturnOtp() {
        when(valueOperations.get("OTP_STU001")).thenReturn("123456");

        String result = otpService.findOtpByCollegeID("STU001", "OTP_");

        assertThat(result).isEqualTo("123456");
        verify(valueOperations, times(1)).get("OTP_STU001");
    }

    @Test
    void testFindOtpByCollegeID_FromDB_WhenNotInRedis_ShouldReturnOtp() {
        when(valueOperations.get("OTP_STU001")).thenReturn(null);
        when(otpRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testOtp));

        String result = otpService.findOtpByCollegeID("STU001", "OTP_");

        assertThat(result).isEqualTo("123456");
    }

    @Test
    void testFindOtpByCollegeID_ExpiredOtp_ShouldThrowException() {
        OTP expiredOtp = OTP.builder()
                .id(1L)
                .collegeId("STU001")
                .otp("123456")
                .expiryTime(LocalDateTime.now().minusMinutes(5))
                .build();

        when(valueOperations.get("OTP_STU001")).thenReturn(null);
        when(otpRepository.findByCollegeId("STU001")).thenReturn(Optional.of(expiredOtp));

        assertThatThrownBy(() -> otpService.findOtpByCollegeID("STU001", "OTP_"))
                .isInstanceOf(InvalidOTPException.class)
                .hasMessage("Invalid OTP or OTP expired");
    }

    @Test
    void testFindOtpByCollegeID_NotFound_ShouldThrowException() {
        when(valueOperations.get("OTP_STU001")).thenReturn(null);
        when(otpRepository.findByCollegeId("STU001")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> otpService.findOtpByCollegeID("STU001", "OTP_"))
                .isInstanceOf(OtpNotFoundException.class)
                .hasMessage("OTP not found or expired!");
    }

    @Test
    void testDeleteOTP_ShouldDeleteFromRedisAndDB() {
        otpService.deleteOTP("STU001", "OTP_");

        verify(otpRepository, times(1)).deleteByCollegeId("STU001");
        verify(redisTemplate, times(1)).delete("OTP_STU001");
    }

    @Test
    void testDeleteExpiredTokens_ShouldCallRepository() {
        LocalDateTime now = LocalDateTime.now();
        when(otpRepository.deleteExpiredTokens(now)).thenReturn(5);

        int result = otpService.deleteExpiredTokens(now);

        assertThat(result).isEqualTo(5);
        verify(otpRepository, times(1)).deleteExpiredTokens(now);
    }

    @Test
    void testFindByCollegeId_ShouldReturnOtp() {
        when(otpRepository.findByCollegeId("STU001")).thenReturn(Optional.of(testOtp));

        Optional<OTP> result = otpService.findByCollegeId("STU001");

        assertThat(result).isPresent();
        assertThat(result.get().getOtp()).isEqualTo("123456");
        verify(otpRepository, times(1)).findByCollegeId("STU001");
    }

    @Test
    void testFindByCollegeId_NotFound_ShouldReturnEmpty() {
        when(otpRepository.findByCollegeId("INVALID")).thenReturn(Optional.empty());

        Optional<OTP> result = otpService.findByCollegeId("INVALID");

        assertThat(result).isEmpty();
    }

    @Test
    void testSaveOTPDB_ShouldSaveOTPToDatabase() {
        otpService.saveOTPDB("STU001", "654321", LocalDateTime.now().plusMinutes(10));

        verify(otpRepository, times(1)).save(any(OTP.class));
    }
}
