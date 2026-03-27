package com.scholr.scholr.service;

import com.scholr.scholr.dto.QRResponse;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.dto.StudentAttendanceRequest;
import com.scholr.scholr.dto.StudentTodayAttendanceResponse;
import com.scholr.scholr.entity.*;
import com.scholr.scholr.enums.AttendanceMode;
import com.scholr.scholr.enums.AttendanceStatus;
import com.scholr.scholr.dto.ManualAttendanceRequest;
import com.scholr.scholr.exception.*;
import com.scholr.scholr.repository.AttendanceRepository;
import com.scholr.scholr.utils.LocationUtils;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService{

    private final UserService userService;
    private final BatchService batchService;
    private final ClassSessionService classSessionService;
    private final JwtService jwtService;
    private final QRService qrService;
    private final AttendanceRepository repository;
    private final SemesterService semesterService;
    private final NotificationService notificationService;


    @Value("${QR_SECRET}")
    private String qrSecret;

    @Override
    @Transactional
    public QRResponse verifyAndGenerateQR(StartAttendanceRequest attendanceRequest, String collegeId) {
        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("CollegeId not found!"));

        if (!(user instanceof Teacher teacher)) {
            throw new StudentCanNotHaveSubjectsException("Access Denied: Only teachers can Generate QR.");
        }

        classSessionService.findActiveSessionByTeacher(teacher.getUserId()).ifPresent(s -> {
            throw new ActiveSessionException("There is already a class (" + s.getSubject().getSubjectName() + ") live.");
        });

        Subject targetSubject = teacher.getSubjects().stream()
                .filter(s -> s.getSubjectName().equalsIgnoreCase(attendanceRequest.subjectName()))
                .findFirst()
                .orElseThrow(() -> new SubjectNotFoundException("Subject not assigned to you"));

        Semester semester = semesterService.findBySemesterNo(attendanceRequest.semester());

        ClassSession session = new ClassSession();
        session.setSubject(targetSubject);
        session.setTeacher(teacher);
        session.setSemester(semester);
        session.setDepartment(targetSubject.getDepartment());
        session.setTopic(attendanceRequest.topic() != null ? attendanceRequest.topic() : "Regular Lecture");
        session.setConductedAt(LocalDateTime.now());
        session.setCompleted(false);


        session = classSessionService.save(session);

        // JWT generation
        String token = jwtService.generateTokenWithCustomData(
                collegeId,
                session.getSessionId(),
                semester.getSemesterNo(),
                targetSubject,
                attendanceRequest.teacherLat(),
                attendanceRequest.teacherLng()
        );

        String qrToken = qrService.generateQR(token);

        notificationService.sendQRNotification(session.getSemester(), session.getDepartment(), targetSubject.getSubjectName(), session.getSessionId());

        return new QRResponse(qrToken, session);
    }

    @Override
    @Transactional
    public String markAttendance(StudentAttendanceRequest request, String collegeId) {

        Claims claims = jwtService.extractAllClaims(request.token(), qrSecret);

        if (claims.getExpiration().before(new Date())) {
            log.warn("[Attendance] Expired QR scanned by student: {}", collegeId);
            throw new TokenExpiredException("Attendance session has expired. Please request the teacher for manual verification.");        }

        Long sessionId = claims.get("sid", Long.class);
        Double teacherLat = claims.get("lat", Double.class);
        Double teacherLng = claims.get("lng", Double.class);
        Integer semesterNoFromToken = claims.get("sno", Integer.class);

        ClassSession session = classSessionService.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Invalid or non-existent attendance session."));

        if (session.isCompleted()) {
            log.info("[Attendance] Attempt to mark attendance for closed session: {}", sessionId);
            throw new SessionClosedException("The Teacher has closed this session. Attendance is no longer being accepted.");
        }


        Student student = (Student) userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("Student record not found for ID: " + collegeId));


        if (student.getDeviceId() == null) {
            student.setDeviceId(request.deviceId());
            userService.save(student);
            log.info("[Security] New device ID bound for student: {}", collegeId);
        } else if (!student.getDeviceId().equals(request.deviceId())) {
            log.error("[Security] Device mismatch detected for {}. Expected: {}, Received: {}",
                    collegeId, student.getDeviceId(), request.deviceId());
            throw new DeviceMismatchException("Security Alert: Device mismatch detected. Attendance must be marked using your registered device.");
        }


        if (!student.getSemester().getSemesterNo().equals(semesterNoFromToken)) {
            log.warn("[Attendance] Batch mismatch for student {}: Expected Sem {}", collegeId, semesterNoFromToken);
            throw new BatchMismatchException("Access Denied: This session is not scheduled for your current semester.");
        }


        // Duplicate Check (One student, one session, one attendance)
        if (repository.existsByStudentAndSession(student, session)) {
            throw new AlreadyMarkedException("Your attendance for this session has already been recorded.");
        }

        //calculate the distance between the teacher and student's location
        double distance = LocationUtils.calculateDistance(
                request.studentLat(),
                request.studentLng(),
                teacherLat,
                teacherLng
        );


        if (distance > 50.0) {
            log.warn("[Attendance] Out-of-range attempt by {}. Distance: {}m", collegeId, (int)distance);
            throw new OutOfRangeException(String.format("Location mismatch: You must be inside the classroom to mark attendance. Current distance: %dm", (int)distance));
        }


        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSession(session);
        attendance.setMarkedAt(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance.setMode(AttendanceMode.AUTO);

        repository.save(attendance);

        log.info("[Attendance] Success: Student {} marked present for session {}. Distance: {}m", collegeId, sessionId, (int)distance);
        return String.format("Attendance recorded successfully. Verification distance: %d meters.", (int)distance);    }

    @Override
    public ClassSession getActiveTeacherSession(String username) {
        User user = userService.findByCollegeId(username)
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        return classSessionService.findActiveSessionByTeacher(user.getUserId())
                .orElse(null);
    }

    @Override
    @Transactional
    public void endSession(Long sessionId) {
        ClassSession session = classSessionService.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));
        session.setCompleted(true);
        classSessionService.save(session);
    }

    @Override
    @Transactional
    public void toggleAttendance(ManualAttendanceRequest request) {
        ClassSession session = classSessionService.findById(request.sessionId())
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));

        if(session.isCompleted())throw new SessionClosedException("Cannot mark attendance. The session has already been completed.");

        Student student = (Student) userService.findByCollegeId(request.collegeId())
                          .orElseThrow(() -> new UserNotFoundException("Student not found !"));

        Optional<Attendance> existingAttendance = repository.findByStudentAndSession(student, session);


        Attendance attendance;
        if(existingAttendance.isPresent()) {
            // just toggle the attendance
            attendance = existingAttendance.get();
            attendance.setStatus(request.status());
            attendance.setMarkedAt(LocalDateTime.now());
        }else {
            // create a new instance
            attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setSession(session);
            attendance.setMarkedAt(LocalDateTime.now());
            attendance.setStatus(request.status());
        }
        attendance.setMode(AttendanceMode.MANUAL);
        repository.save(attendance);
    }

    @Override
    public List<StudentTodayAttendanceResponse> getStudentTodayHistory(String collegeId) {
        return repository.findTodayAttendanceByStudent(collegeId);
    }
}
