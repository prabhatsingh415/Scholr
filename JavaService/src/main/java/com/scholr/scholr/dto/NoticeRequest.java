package com.scholr.scholr.dto;

import com.scholr.scholr.enums.NoticeCategory;
import com.scholr.scholr.enums.NoticeScope;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoticeRequest(
        @NotBlank String title,
        @NotBlank String content,
        String contentLink,
        @NotNull NoticeScope scope,
        @NotNull NoticeCategory category,
        Long deptId
) {}
