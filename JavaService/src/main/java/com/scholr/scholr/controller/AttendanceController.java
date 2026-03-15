package com.scholr.scholr.controller;

import com.scholr.scholr.dto.ApiResponse;
import com.scholr.scholr.dto.QRResponse;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.dto.StudentAttendanceRequest;
import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.service.AttendanceService;
import com.scholr.scholr.service.QRService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/attendance")
@AllArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;


    @GetMapping("/active-session")
    public ResponseEntity<ApiResponse<ClassSession>> getActiveSession(@AuthenticationPrincipal UserDetails userDetails) {
        ClassSession session = attendanceService.getActiveTeacherSession(userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(true, "Active session found", session, null, LocalDateTime.now().toString()));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<QRResponse>>
    getSubjects(@Valid @RequestBody StartAttendanceRequest attendanceRequest,
                @AuthenticationPrincipal UserDetails userDetails){

        QRResponse response = attendanceService.verifyAndGenerateQR(attendanceRequest, userDetails.getUsername());

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Attendance QR generated Successfully!",
                response,
                null,
                LocalDateTime.now().toString()
        ));
    }


    @PatchMapping("/end/{sessionId}")
    public ResponseEntity<ApiResponse<String>> endSession(@PathVariable Long sessionId) {
        attendanceService.endSession(sessionId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session Ended Successfully", null, null, LocalDateTime.now().toString()));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> verifyAndMark(
            @Valid @RequestBody StudentAttendanceRequest request,
            @AuthenticationPrincipal UserDetails student) {

        String result = attendanceService.markAttendance(request, student.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(true, "Attendance Marked", result, null, LocalDateTime.now().toString()));
    }
}
