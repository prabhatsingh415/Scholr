package com.scholr.scholr.controller;

import com.scholr.scholr.dto.ApiResponse;
import com.scholr.scholr.dto.NoticeRequest;
import com.scholr.scholr.entity.Notice;
import com.scholr.scholr.entity.User;
import com.scholr.scholr.service.NoticeService;
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
@RequestMapping("/api/v1/notice")
@Slf4j
@AllArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/publish")
    public ResponseEntity<ApiResponse<Notice>> publishNotice(
            @Valid @RequestBody NoticeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Notice notice = noticeService.createNotice(request, userDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notice Published!", notice, null, LocalDateTime.now().toString()));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<Notice>>> getNoticeFeed(@AuthenticationPrincipal UserDetails userDetails) {
        List<Notice> notices = noticeService.getNoticesForUser(userDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Feed fetched", notices, null, LocalDateTime.now().toString()));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<Notice>>> getPublicNotices() {
        List<Notice> notices = noticeService.getPublicNotices();
        return ResponseEntity.ok(new ApiResponse<>(true, "Public notices fetched", notices, null, LocalDateTime.now().toString()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotice(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        noticeService.deleteNotice(id, userDetails);
        return ResponseEntity.ok(new ApiResponse<>(true, "Notice deleted successfully", null, null, LocalDateTime.now().toString()));
    }
}