package com.scholr.scholr.service;

import com.scholr.scholr.dto.AuthRequest;
import com.scholr.scholr.dto.AuthResponse;
import com.scholr.scholr.dto.EmailRequest;
import com.scholr.scholr.dto.ForgotPasswordRequest;
import com.scholr.scholr.dto.TokenData;
import com.scholr.scholr.dto.UserDataResponse;
import com.scholr.scholr.entity.RefreshToken;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.exception.AccountDeletedException;
import com.scholr.scholr.exception.AlreadyVerifiedException;
import com.scholr.scholr.exception.InvalidOTPException;
import com.scholr.scholr.exception.InvalidPasswordException;
import com.scholr.scholr.exception.UnauthorizedAccessException;
import com.scholr.scholr.exception.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserService userService;

    @Mock
    private MessageBrokerProducer brokerProducer;

    @Mock
    private OTPService otpService;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordService passwordService;

    @Mock
    private BlackListTokenService blackListTokenService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private Student testUser;
    private AuthRequest authRequest;
    private UserDataResponse userDataResponse;

    @BeforeEach
    void setUp() {
        testUser = new Student();
        testUser.setUserId(1L);
        testUser.setCollegeId("STU001");
        testUser.setEmail("student@example.com");
        testUser.setVerified(false);
        testUser.setDeleted(false);

        authRequest = new AuthRequest();
        authRequest.setCollegeId("STU001");
        authRequest.setPassword("Password@123");

        userDataResponse = new UserDataResponse(
                "STU001", "John", "Doe", "student@example.com", null, null,
                "CS01", true, null, null, null, null
        );
    }

    @Test
    void testHandleSignUp_ShouldPrepareUserAndSendOTP() {
        User preparedUser = testUser;
        preparedUser.setPassword("hashedPassword");

        when(userService.prepareUserForVerification("STU001", "Password@123"))
                .thenReturn(preparedUser);
        when(otpService.generateOTP(6)).thenReturn("123456");

        authService.handleSignUp(authRequest);

        verify(userService, times(1)).prepareUserForVerification("STU001", "Password@123");
        verify(otpService, times(1)).generateOTP(6);
        verify(otpService, times(1)).storeOTP("STU001", "123456", "OTP_");
        verify(brokerProducer, times(1)).sendOTPMessage(any(EmailRequest.class));
    }

    @Test
    void testVerifyOTP_WithValidOTP_ShouldReturnAuthResponse() {
        testUser.setVerified(true);

        when(otpService.findOtpByCollegeID("STU001", "OTP_")).thenReturn("123456");
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(userService.mapToDTO(testUser)).thenReturn(userDataResponse);
        when(jwtService.generateAccessToken(testUser)).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refreshToken");

        AuthResponse result = authService.verifyOTP("123456", "STU001");

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("accessToken");
        assertThat(result.refreshToken()).isEqualTo("refreshToken");
        verify(userService, times(1)).save(testUser);
        verify(otpService, times(1)).deleteOTP("STU001", "OTP_");
    }

    @Test
    void testVerifyOTP_WithInvalidOTP_ShouldThrowException() {
        when(otpService.findOtpByCollegeID("STU001", "OTP_")).thenReturn("123456");

        assertThatThrownBy(() -> authService.verifyOTP("999999", "STU001"))
                .isInstanceOf(InvalidOTPException.class)
                .hasMessage("Invalid OTP or OTP expired");
    }

    @Test
    void testCreateRefreshCookie_ShouldReturnValidCookie() {
        ResponseCookie cookie = authService.createRefreshCookie("refreshToken");

        assertThat(cookie).isNotNull();
        assertThat(cookie.getValue()).isEqualTo("refreshToken");
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.isSecure()).isTrue();
    }

    @Test
    void testHandleLogin_WithValidCredentials_ShouldReturnAuthResponse() {
        testUser.setVerified(true);

        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(passwordService.isPasswordValid(testUser, "Password@123")).thenReturn(true);
        when(jwtService.generateAccessToken(testUser)).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("refreshToken");
        when(userService.mapToDTO(testUser)).thenReturn(userDataResponse);

        AuthResponse result = authService.handleLogin(authRequest);

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("accessToken");
        verify(jwtService, times(1)).generateAccessToken(testUser);
        verify(jwtService, times(1)).generateRefreshToken(testUser);
    }

    @Test
    void testHandleLogin_UserNotFound_ShouldThrowException() {
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.handleLogin(authRequest))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found !");
    }

    @Test
    void testHandleLogin_UserDeleted_ShouldThrowException() {
        testUser.setDeleted(true);
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> authService.handleLogin(authRequest))
                .isInstanceOf(AccountDeletedException.class)
                .hasMessage("Your account has been deactivated or deleted.");
    }

    @Test
    void testHandleLogin_UserNotVerified_ShouldThrowException() {
        testUser.setVerified(false);
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> authService.handleLogin(authRequest))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessage("Account not verified. Please verify your OTP first.");
    }

    @Test
    void testHandleLogin_InvalidPassword_ShouldThrowException() {
        testUser.setVerified(true);
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(passwordService.isPasswordValid(testUser, "Password@123")).thenReturn(false);

        assertThatThrownBy(() -> authService.handleLogin(authRequest))
                .isInstanceOf(InvalidPasswordException.class)
                .hasMessage("Invalid password or college id");
    }

    @Test
    void testLogoutUser_ShouldClearTokenAndSetCookie() {
        when(jwtService.getRemainingExpiry("token")).thenReturn(1000L);

        ResponseCookie cookie = authService.logoutUser("token", "STU001");

        assertThat(cookie).isNotNull();
        verify(refreshTokenService, times(1)).deleteRefreshToken("STU001");
        verify(blackListTokenService, times(1)).blacklistToken("token", 1000L);
    }

    @Test
    void testRotateTokens_WithValidToken_ShouldReturnNewTokens() {
        when(jwtService.extractUserCollegeId("oldRefreshToken")).thenReturn("STU001");
        when(refreshTokenService.getRefreshToken("STU001")).thenReturn("oldRefreshToken");
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("newAccessToken");
        when(jwtService.generateRefreshToken(testUser)).thenReturn("newRefreshToken");

        TokenData result = authService.rotateTokens("oldRefreshToken");

        assertThat(result).isNotNull();
        assertThat(result.accessToken()).isEqualTo("newAccessToken");
        assertThat(result.refreshToken()).isEqualTo("newRefreshToken");
        verify(refreshTokenService, times(1)).saveOrUpdate(any(RefreshToken.class));
    }

    @Test
    void testRotateTokens_WithInvalidToken_ShouldThrowException() {
        when(jwtService.extractUserCollegeId("invalidToken")).thenReturn("STU001");
        when(refreshTokenService.getRefreshToken("STU001")).thenReturn("differentToken");

        assertThatThrownBy(() -> authService.rotateTokens("invalidToken"))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessage("Session expired or invalid refresh token");
    }

    @Test
    void testHandleForgotPassword_ShouldSendOTPEmail() {
        ForgotPasswordRequest request = new ForgotPasswordRequest("STU001");
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(otpService.generateOTP(6)).thenReturn("654321");

        authService.handleForgotPassword(request);

        verify(userService, times(1)).findByCollegeId("STU001");
        verify(otpService, times(1)).generateOTP(6);
        verify(otpService, times(1)).storeOTP("STU001", "654321", "FP_OTP_");
        verify(brokerProducer, times(1)).sendOTPMessage(any(EmailRequest.class));
    }

    @Test
    void testVerifyForgotPasswordOTP_WithValidOTP_ShouldUpdatePassword() {
        when(otpService.findOtpByCollegeID("STU001", "FP_OTP_")).thenReturn("654321");
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(passwordService.hashPassword("NewPassword@123")).thenReturn("hashedPassword");

        authService.verifyForgotPasswordOTP("654321", "STU001", "NewPassword@123");

        verify(userService, times(1)).save(testUser);
        verify(otpService, times(1)).deleteOTP("STU001", "FP_OTP_");
    }

    @Test
    void testResendOTP_WithUnverifiedAccount_ShouldSendOTP() {
        testUser.setVerified(false);
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));
        when(otpService.generateOTP(6)).thenReturn("111111");

        authService.resendOTP("STU001");

        verify(otpService, times(1)).generateOTP(6);
        verify(otpService, times(1)).storeOTP("STU001", "111111", "OTP_");
        verify(brokerProducer, times(1)).sendOTPMessage(any(EmailRequest.class));
    }

    @Test
    void testResendOTP_WithVerifiedAccount_ShouldThrowException() {
        testUser.setVerified(true);
        when(userService.findByCollegeId("STU001")).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> authService.resendOTP("STU001"))
                .isInstanceOf(AlreadyVerifiedException.class)
                .hasMessage("Account already active.");
    }
}
