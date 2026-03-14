package com.scholr.scholr.service;

import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.dto.StudentAttendanceRequest;
import com.scholr.scholr.entity.*;
import com.scholr.scholr.enums.AttendanceStatus;
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

    @Value("${QR_SECRET}")
    private String qrSecret;

    @Override
    public String verifyAndGenerateQR(StartAttendanceRequest attendanceRequest, String collegeId) {
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

        Batch batch = batchService.findById(attendanceRequest.batchId())
                .orElseThrow(() -> new BatchNotFoundException("Batch not found"));

        ClassSession session = new ClassSession();
        session.setSubject(targetSubject);
        session.setTeacher(teacher);
        session.setBatch(batch);
        session.setTopic(attendanceRequest.topic() != null ? attendanceRequest.topic() : "Regular Lecture");
        session.setConductedAt(LocalDateTime.now());
        session.setCompleted(false);


        session = classSessionService.save(session);

        // JWT generation
        String token = jwtService.generateTokenWithCustomData(
                collegeId,
                session.getSessionId(),
                batch.getBatchId(),
                targetSubject,
                attendanceRequest.teacherLat(),
                attendanceRequest.teacherLng()
        );

        return qrService.generateQR(token);
    }

    @Override
    public String markAttendance(StudentAttendanceRequest request, String collegeId) {

        Claims claims = jwtService.extractAllClaims(request.token(), qrSecret);

        if (claims.getExpiration().before(new Date())) {
            throw new TokenExpiredException("Session Expired ! contact teacher for manual attendance mark.");
        }

        Long sessionId = claims.get("sid", Long.class);
        Double teacherLat = claims.get("lat", Double.class);
        Double teacherLng = claims.get("lng", Double.class);
        Long batchIdFromToken = claims.get("bid", Long.class);

        ClassSession session = classSessionService.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session invalid"));

        if (session.isCompleted())
            throw new SessionClosedException("Teacher has ended this session. Attendance closed!");


        Student student = (Student) userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("Student not found"));


        if (!student.getBatch().getBatchId().equals(batchIdFromToken)) {
            throw new BatchMismatchException("This is not your batch's class!");
        }


        // Duplicate Check (One student, one session, one attendance)
        if (repository.existsByStudentAndSession(student, session)) {
            throw new AlreadyMarkedException("Attendance already marked !");
        }

        //calculate the distance between the teacher and student's location
        double distance = LocationUtils.calculateDistance(
                request.studentLat(),
                request.studentLng(),
                teacherLat,
                teacherLng
        );


        if(distance > 50.0){
            throw new OutOfRangeException("You are to far, go in the class! Distance: " + (int)distance + "m");
        }


        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSession(session);
        attendance.setMarkedAt(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.PRESENT);

        repository.save(attendance);

        return "Attendance marked! Distance was " + (int)distance + " meters.";
    }

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
}
