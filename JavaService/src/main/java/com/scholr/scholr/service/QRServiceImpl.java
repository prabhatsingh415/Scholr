package com.scholr.scholr.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.entity.*;
import com.scholr.scholr.exception.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;

import java.util.Base64;


@Service
@AllArgsConstructor
public class QRServiceImpl implements QRService{

    private final UserService userService;
    private final JwtService jwtService;
    private final BatchService batchService;
    private final ClassSessionService classSessionService;

    @Override
    public String verifyAndGenerateQR(StartAttendanceRequest attendanceRequest, String collegeId) {
        User user = userService.findByCollegeId(collegeId)
                .orElseThrow(() -> new UserNotFoundException("CollegeId not found!"));

        if (!(user instanceof Teacher teacher)) {
            throw new StudentCanNotHaveSubjectsException("Access Denied: Only teachers can Generate QR.");
        }

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

        return this.generateQR(token);
    }

    private String generateQR(String token) {
        QRCodeWriter writer = new QRCodeWriter();
        try {
            BitMatrix encode = writer.encode(token, BarcodeFormat.QR_CODE, 400, 400);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(encode, "PNG", pngOutputStream);

            byte[] pngData = pngOutputStream.toByteArray();

            return Base64.getEncoder().encodeToString(pngData);

        } catch (WriterException e) {
            throw new QRGenerationFailedException("Internal error while generating QR code");
        } catch (IOException e) {
            throw new QRCodeToImageConverationFailedException("Failed to convert byte data into Image");
        }
    }
}
