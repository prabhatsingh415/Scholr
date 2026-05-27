package com.scholr.scholr.service;

import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordServiceImplTest {

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordServiceImpl passwordService;

    private User testUser;
    private String rawPassword;
    private String hashedPassword;

    @BeforeEach
    void setUp() {
        testUser = new Student();
        testUser.setUserId(1L);
        testUser.setCollegeId("STU001");
        rawPassword = "Password@123";
        hashedPassword = "$2a$10$slYQmyNdGzin7olVMahnxOYvvq5c6rCNfS2jKzxJQhqgnrxAX.Nj.";
    }

    @Test
    void testIsPasswordValid_WithCorrectPassword_ShouldReturnTrue() {
        testUser.setPassword(hashedPassword);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);

        boolean result = passwordService.isPasswordValid(testUser, rawPassword);

        assertThat(result).isTrue();
        verify(passwordEncoder, times(1)).matches(rawPassword, hashedPassword);
    }

    @Test
    void testIsPasswordValid_WithIncorrectPassword_ShouldReturnFalse() {
        testUser.setPassword(hashedPassword);
        when(passwordEncoder.matches("WrongPassword@123", hashedPassword)).thenReturn(false);

        boolean result = passwordService.isPasswordValid(testUser, "WrongPassword@123");

        assertThat(result).isFalse();
        verify(passwordEncoder, times(1)).matches("WrongPassword@123", hashedPassword);
    }

    @Test
    void testHashPassword_ShouldReturnEncodedPassword() {
        when(passwordEncoder.encode(rawPassword))
                .thenReturn(hashedPassword);

        String result = passwordService.hashPassword(rawPassword);

        assertThat(result).isEqualTo(hashedPassword);
        assertThat(result).isNotEqualTo(rawPassword);
        verify(passwordEncoder, times(1)).encode(rawPassword);
    }

    @Test
    void testHashPassword_DifferentInputs_ShouldProduceDifferentHashes() {
        String hashedPassword1 = "$2a$10$slYQmyNdGzin7olVMahnxOYvvq5c6rCNfS2jKzxJQhqgnrxAX.Nj.";
        String hashedPassword2 = "$2a$10$anotherHashedPasswordDifferentFromFirstOne";

        when(passwordEncoder.encode("Password@123")).thenReturn(hashedPassword1);
        when(passwordEncoder.encode("Different@123")).thenReturn(hashedPassword2);

        String result1 = passwordService.hashPassword("Password@123");
        String result2 = passwordService.hashPassword("Different@123");

        assertThat(result1).isNotEqualTo(result2);
    }

    @Test
    void testIsPasswordValid_CaseSensitive_ShouldReturnFalse() {
        testUser.setPassword(hashedPassword);
        when(passwordEncoder.matches("password@123", hashedPassword)).thenReturn(false);

        boolean result = passwordService.isPasswordValid(testUser, "password@123");

        assertThat(result).isFalse();
    }

    @Test
    void testHashPassword_MultipleCallsWithSamePswd_ShouldReturnDifferentHashes() {
        String hash1 = "$2a$10$hash1FromEncoder";
        String hash2 = "$2a$10$hash2FromEncoder";

        when(passwordEncoder.encode(rawPassword))
                .thenReturn(hash1)
                .thenReturn(hash2);

        String result1 = passwordService.hashPassword(rawPassword);
        String result2 = passwordService.hashPassword(rawPassword);

        // Both should not be null even if different
        assertThat(result1).isNotNull();
        assertThat(result2).isNotNull();
        verify(passwordEncoder, times(2)).encode(rawPassword);
    }
}

