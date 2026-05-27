package com.scholr.scholr.service;

import com.scholr.scholr.entity.Batch;
import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Semester;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.entity.Subject;
import com.scholr.scholr.entity.Teacher;
import com.scholr.scholr.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceImplTest {

    @InjectMocks
    private JwtServiceImpl jwtService;

    private String secretKey;
    private String qrSecret;
    private Student testStudent;
    private Teacher testTeacher;
    private Department testDepartment;
    private Semester testSemester;
    private Subject testSubject;
    private Batch testBatch;

    @BeforeEach
    void setUp() {
        // Generate valid Base64 encoded secrets for testing
        SecretKey key1 = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        SecretKey key2 = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        secretKey = java.util.Base64.getEncoder().encodeToString(key1.getEncoded());
        qrSecret = java.util.Base64.getEncoder().encodeToString(key2.getEncoded());

        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "qrSecret", qrSecret);

        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setDeptName("Computer Science");

        testSemester = new Semester();
        testSemester.setId(1L);
        testSemester.setSemesterNo(4);
        testSemester.setYear(2);

        testBatch = new Batch();
        testBatch.setBatchId(1L);

        testSubject = new Subject();
        testSubject.setId(1L);
        testSubject.setSubjectName("Data Structures");
        testSubject.setSubjectCode("CS101");
        testSubject.setDepartment(testDepartment);

        testTeacher = new Teacher();
        testTeacher.setUserId(1L);
        testTeacher.setCollegeId("TEACH001");
        testTeacher.setFirstName("John");
        testTeacher.setLastName("Doe");
        testTeacher.setDepartment(testDepartment);
        testTeacher.setHod(true);
        testTeacher.setSubjects(List.of(testSubject));

        testStudent = new Student();
        testStudent.setUserId(1L);
        testStudent.setCollegeId("STU001");
        testStudent.setFirstName("John");
        testStudent.setLastName("Doe");
        testStudent.setEmail("john@example.com");
        testStudent.setRole(Role.STUDENT);
        testStudent.setVerified(true);
        testStudent.setDepartment(testDepartment);
        testStudent.setBatch(testBatch);
    }

    @Test
    void testGenerateAccessToken_ShouldGenerateValidToken() {
        String token = jwtService.generateAccessToken(testStudent);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        String collegeId = jwtService.extractUserCollegeId(token);
        assertThat(collegeId).isEqualTo("STU001");
    }

    @Test
    void testGenerateAccessToken_WithTeacher_ShouldIncludeHodClaim() {
        String token = jwtService.generateAccessToken(testTeacher);

        assertThat(token).isNotNull();
        Claims claims = jwtService.extractAllClaims(token, secretKey);
        assertThat(claims.get("is_hod")).isEqualTo(true);
    }

    @Test
    void testGenerateAccessToken_WithStudent_ShouldNotIncludeHodClaim() {
        String token = jwtService.generateAccessToken(testStudent);

        assertThat(token).isNotNull();
        Claims claims = jwtService.extractAllClaims(token, secretKey);
        assertThat(claims.get("is_hod")).isNull();
    }

    @Test
    void testGenerateRefreshToken_ShouldGenerateValidToken() {
        String token = jwtService.generateRefreshToken(testStudent);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        String collegeId = jwtService.extractUserCollegeId(token);
        assertThat(collegeId).isEqualTo("STU001");
    }

    @Test
    void testExtractUserCollegeId_ShouldReturnCorrectCollegeId() {
        String token = jwtService.generateAccessToken(testStudent);
        String collegeId = jwtService.extractUserCollegeId(token);

        assertThat(collegeId).isEqualTo("STU001");
    }

    @Test
    void testExtractUserCollegeId_WithTeacher_ShouldReturnTeacherCollegeId() {
        String token = jwtService.generateAccessToken(testTeacher);
        String collegeId = jwtService.extractUserCollegeId(token);

        assertThat(collegeId).isEqualTo("TEACH001");
    }

    @Test
    void testIsTokenValid_WithValidToken_ShouldReturnTrue() {
        String token = jwtService.generateAccessToken(testStudent);
        UserDetails userDetails = new User("STU001", "password", java.util.Collections.emptyList());

        boolean result = jwtService.isTokenValid(token, userDetails);

        assertThat(result).isTrue();
    }

    @Test
    void testIsTokenValid_WithInvalidUser_ShouldReturnFalse() {
        String token = jwtService.generateAccessToken(testStudent);
        UserDetails userDetails = new User("INVALID", "password", java.util.Collections.emptyList());

        boolean result = jwtService.isTokenValid(token, userDetails);

        assertThat(result).isFalse();
    }

    @Test
    void testExtractAllClaims_ShouldReturnValidClaims() {
        String token = jwtService.generateAccessToken(testStudent);
        Claims claims = jwtService.extractAllClaims(token, secretKey);

        assertThat(claims).isNotNull();
        assertThat(claims.getSubject()).isEqualTo("STU001");
        assertThat(claims.get("email")).isEqualTo("john@example.com");
    }

    @Test
    void testGenerateTokenWithCustomData_ShouldIncludeAllCustomClaims() {
        String token = jwtService.generateTokenWithCustomData(
                "STU001",
                1L,
                4,
                testSubject,
                12.5,
                78.9
        );

        assertThat(token).isNotNull();
        Claims claims = jwtService.extractAllClaims(token, qrSecret);
        assertThat(claims.get("sid")).isEqualTo(1);
        assertThat(claims.get("sno")).isEqualTo(4);
        assertThat(claims.get("subject")).isEqualTo("Data Structures");
        assertThat(claims.get("lat")).isEqualTo(12.5);
        assertThat(claims.get("lng")).isEqualTo(78.9);
    }

    @Test
    void testGetRemainingExpiry_WithValidToken_ShouldReturnPositiveValue() {
        String token = jwtService.generateAccessToken(testStudent);
        long remainingTime = jwtService.getRemainingExpiry(token);

        assertThat(remainingTime).isGreaterThan(0);
    }

    @Test
    void testGetRemainingExpiry_WithExpiredToken_ShouldReturnZero() {
        // Create an expired token manually
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        String expiredToken = Jwts.builder()
                .setSubject("STU001")
                .setIssuedAt(new Date(System.currentTimeMillis() - 60000))
                .setExpiration(new Date(System.currentTimeMillis() - 10000))
                .signWith(key, io.jsonwebtoken.SignatureAlgorithm.HS256)
                .compact();

        long remainingTime = jwtService.getRemainingExpiry(expiredToken);

        assertThat(remainingTime).isEqualTo(0);
    }

    @Test
    void testGenerateAccessToken_TokenShouldIncludeAllUserClaims() {
        String token = jwtService.generateAccessToken(testStudent);
        Claims claims = jwtService.extractAllClaims(token, secretKey);

        assertThat(claims.get("college_id")).isEqualTo("STU001");
        assertThat(claims.get("email")).isEqualTo("john@example.com");
        assertThat(claims.get("role")).isEqualTo(Role.STUDENT.name());
        assertThat(claims.get("first_name")).isEqualTo("John");
        assertThat(claims.get("last_name")).isEqualTo("Doe");
        assertThat(claims.get("is_verified")).isEqualTo(true);
    }
}
