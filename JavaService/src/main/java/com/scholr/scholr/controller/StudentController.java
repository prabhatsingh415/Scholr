package com.scholr.scholr.controller;

import com.scholr.scholr.dto.ApiResponse;
import com.scholr.scholr.dto.StudentRankingResponse;
import com.scholr.scholr.service.RankingService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@Slf4j
@AllArgsConstructor
public class StudentController {

    private final RankingService rankingService;

    @GetMapping("/ranking")
    public ResponseEntity<ApiResponse<List<StudentRankingResponse>>> getRankings(
            @RequestParam(required = false) Long deptId,
            @RequestParam(required = false) Integer year
    ) {
        List<StudentRankingResponse> data = rankingService.getRankings(deptId, year);
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Rankings fetched successfully",
                        data,
                        null,
                        LocalDateTime.now().toString()
                ));
    }
}
