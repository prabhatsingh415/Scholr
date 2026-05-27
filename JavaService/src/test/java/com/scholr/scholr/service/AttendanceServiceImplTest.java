package com.scholr.scholr.service;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.*;
import com.scholr.scholr.enums.AttendanceStatus;
import com.scholr.scholr.exception.*;
import com.scholr.scholr.repository.AttendanceRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AttendanceServiceImplTest {

    @Mock private UserService userService;
    @Mock private ClassSessionService classSessionService;
    @Mock private JwtService jwtService;
    @Mock private QRService qrService;
    @Mock private AttendanceRepository attendanceRepository;
    @Mock private SemesterService semesterService;
    @Mock private NotificationService notificationService;
    @Mock private BatchService batchService;

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    private Teacher testTeacher;
    private Student testStudent;
    private Department testDepartment;
    private Subject testSubject;
    private Semester testSemester;
    private ClassSession testSession;
    private Batch testBatch;

    @BeforeEach
    void setUp() {
        testDepartment = new Department();
        testDepartment.setId(1L);
        testDepartment.setDeptId("CS01");
        testDepartment.setDeptName("Computer Science");

        testBatch = new Batch();
        testBatch.setBatchId(1L);

        testSemester = new Semester();
        testSemester.setId(1L);
        testSemester.setSemesterNo(4);

        testSubject = new Subject();
        testSubject.setId(1L);
        testSubject.setSubjectName("Data Structures");

        testSubject.setDepartment(testDepartment);

        testTeacher = new Teacher();
        testTeacher.setUserId(1L);
        testTeacher.setCollegeId("TEACH001");
        testTeacher.setDepartment(testDepartment);
        testTeacher.setSubjects(List.of(testSubject));

        testStudent = new Student();
        testStudent.setUserId(2L);
        testStudent.setCollegeId("STU001");
        testStudent.setDepartment(testDepartment);
        testStudent.setBatch(testBatch);
        testStudent.setSemester(testSemester);
        testStudent.setDeviceId("device123");

        testSession = new ClassSession();
        testSession.setSessionId(1L);
        testSession.setTeacher(testTeacher);
        testSession.setSubject(testSubject);
        testSession.setCompleted(false);
    }

    @Test
    void testVerifyAndGenerateQR_WithValidTeacher_ShouldGenerateQR() {
        StartAttendanceRequest request = new StartAttendanceRequest("Data Structures", 4, "Arrays", 12.5, 78.9);

        when(userService.findByCollegeId("TEACH001")).thenReturn(Optional.of(testTeacher));
        when(classSessionService.findActiveSessionByTeacher(anyLong())).thenReturn(Optional.empty());
        when(semesterService.findBySemesterNo(anyInt())).thenReturn(testSemester);
        when(classSessionService.save(any())).thenReturn(testSession);
        when(jwtService.generateTokenWithCustomData(anyString(), anyLong(), anyInt(), any(), anyDouble(), anyDouble())).thenReturn("qrToken");
        when(qrService.generateQR(anyString())).thenReturn("qrData");

        QRResponse result = attendanceService.verifyAndGenerateQR(request, "TEACH001");

        assertThat(result).isNotNull();
        assertThat(result.qrCodeBase64()).isEqualTo("qrData");
    }

    @Test
    void testMarkAttendance_WithValidRequest_ShouldMarkPresent() {
        StudentAttendanceRequest request = new StudentAttendanceRequest(12.5, 78.9, "token", "device123");
        Claims claims = mock(Claims.class);

        when(claims.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 10000));
        when(claims.get("sid", Long.class)).thenReturn(1L);
        when(claims.get("lat", Double.class)).thenReturn(12.5);
        when(claims.get("lng", Double.class)).thenReturn(78.9);
        when(claims.get("sno", Integer.class)).thenReturn(4);

        when(jwtService.extractAllClaims(anyString(), any())).thenReturn(claims);
        when(classSessionService.findById(anyLong())).thenReturn(Optional.of(testSession));
        when(userService.findByCollegeId(anyString())).thenReturn(Optional.of(testStudent));
        when(attendanceRepository.existsByStudentAndSession(any(), any())).thenReturn(false);

        String result = attendanceService.markAttendance(request, "STU001");
        assertThat(result).contains("Attendance recorded successfully");
    }

    @Test
    void testMarkAttendance_ExpiredToken_ShouldThrowException() {
        StudentAttendanceRequest request = new StudentAttendanceRequest(12.5, 78.9, "token", "device123");
        Claims claims = mock(Claims.class);
        when(claims.getExpiration()).thenReturn(new Date(System.currentTimeMillis() - 1000));
        when(jwtService.extractAllClaims(anyString(), any())).thenReturn(claims);

        assertThatThrownBy(() -> attendanceService.markAttendance(request, "STU001"))
                .isInstanceOf(TokenExpiredException.class);
    }

    @Test
    void testMarkAttendance_SessionClosed_ShouldThrowException() {
        StudentAttendanceRequest request = new StudentAttendanceRequest(12.5, 78.9, "token", "device123");
        testSession.setCompleted(true);
        Claims claims = mock(Claims.class);
        when(claims.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 10000));
        when(claims.get("sid", Long.class)).thenReturn(1L);
        when(jwtService.extractAllClaims(anyString(), any())).thenReturn(claims);
        when(classSessionService.findById(anyLong())).thenReturn(Optional.of(testSession));

        assertThatThrownBy(() -> attendanceService.markAttendance(request, "STU001"))
                .isInstanceOf(SessionClosedException.class);
    }

    @Test
    void testToggleAttendance_CreateNewAttendance_ShouldSave() {
        ManualAttendanceRequest request = new ManualAttendanceRequest("STU001", 1L, AttendanceStatus.PRESENT);
        when(classSessionService.findById(anyLong())).thenReturn(Optional.of(testSession));
        when(userService.findByCollegeId(anyString())).thenReturn(Optional.of(testStudent));
        when(attendanceRepository.findByStudentAndSession(any(), any())).thenReturn(Optional.empty());

        attendanceService.toggleAttendance(request);
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }
}