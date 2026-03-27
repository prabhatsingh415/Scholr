package com.scholr.scholr.dto;

import com.scholr.scholr.entity.ClassSession;

public record QRResponse(
        String qrCodeBase64,
        ClassSession session
) {}
