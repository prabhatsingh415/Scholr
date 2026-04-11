package com.scholr.scholr.dto;


public record QRResponse(
        String qrCodeBase64,
        ClassSessionDTO session
) {}
