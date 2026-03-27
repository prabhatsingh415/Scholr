package com.scholr.scholr.controller;

import com.scholr.scholr.dto.*;
import com.scholr.scholr.entity.ClassSession;
import com.scholr.scholr.dto.ManualAttendanceRequest;
import com.scholr.scholr.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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


    @PostMapping("/manual-toggle")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<String>> markAttendance( @Valid @RequestBody ManualAttendanceRequest request){
        attendanceService.toggleAttendance(request);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Attendance Marked Successfully as "+ request.status(),
                null,
                null,
                LocalDateTime.now().toString()

        ));
    }

    @GetMapping("/student/today")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentTodayAttendanceResponse>>> getTodayAttendance(
            @AuthenticationPrincipal UserDetails student) {

        List<StudentTodayAttendanceResponse> history = attendanceService.getStudentTodayHistory(student.getUsername());

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Today's attendance history fetched",
                history,
                null,
                LocalDateTime.now().toString()
        ));
    }
}
