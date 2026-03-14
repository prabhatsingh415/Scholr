package com.scholr.scholr.controller;

import com.scholr.scholr.dto.ApiResponse;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.dto.SubjectData;
import com.scholr.scholr.service.QRService;
import com.scholr.scholr.service.TeacherService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher")
@Slf4j
@AllArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final QRService qrService;

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<SubjectData>>> getSubjects(@AuthenticationPrincipal UserDetails userData){

       List<SubjectData> subData = teacherService.findSubjects(userData.getUsername());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "subjects fetched successfully",
                        subData,
                        null,
                        LocalDateTime.now().toString()
                )
        );
    }


}
