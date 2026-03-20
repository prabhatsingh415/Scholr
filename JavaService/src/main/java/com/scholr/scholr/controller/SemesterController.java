package com.scholr.scholr.controller;

import com.scholr.scholr.dto.ApiResponse;
import com.scholr.scholr.dto.SemesterRequest;
import com.scholr.scholr.entity.Semester;
import com.scholr.scholr.service.SemesterService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/semesters")
@PreAuthorize("hasRole('ADMIN')")
@AllArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<ApiResponse<Semester>> addSemester(@RequestBody SemesterRequest request) {
        Semester savedSemester = semesterService.addSemester(request);
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Semester created successfully",
                savedSemester,
                null,
                LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addSemestersBulk(@RequestBody List<SemesterRequest> requests) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Bulk Semesters Added",
                semesterService.addSemestersBulk(requests), null, LocalDateTime.now().toString()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Semester>>> getAllSemesters() {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "All semesters fetched",
                semesterService.findAll(),
                null,
                LocalDateTime.now().toString()
        ));
    }


    @GetMapping("/{semesterNo}")
    public ResponseEntity<ApiResponse<Semester>> getSemesterByNo(@PathVariable Integer semesterNo) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Semester details fetched",
                semesterService.findBySemesterNo(semesterNo),
                null,
                LocalDateTime.now().toString()
        ));
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<ApiResponse<Void>> deleteSemester(@PathVariable Long id) {
//        semesterService.deleteById(id);
//        return ResponseEntity.ok(new ApiResponse<>(
//                true,
//                "Semester deleted successfully",
//                null,
//                null,
//                LocalDateTime.now().toString()
//        ));
//    }
}