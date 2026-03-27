package com.scholr.scholr.service;

import com.scholr.scholr.dto.StartAttendanceRequest;
import jakarta.validation.Valid;

public interface QRService {
    String generateQR(String token);
}

