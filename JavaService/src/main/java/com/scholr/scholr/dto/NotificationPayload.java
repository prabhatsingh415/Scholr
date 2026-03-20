package com.scholr.scholr.dto;

import lombok.Builder;
import java.util.List;
import java.util.Map;

@Builder
public record NotificationPayload(
        List<String> fcmTokens,
        String title,
        String body,
        Map<String, String> data
) {}