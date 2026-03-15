package com.scholr.scholr.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.scholr.scholr.dto.StartAttendanceRequest;
import com.scholr.scholr.entity.*;
import com.scholr.scholr.exception.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;

import java.util.Base64;


@Service
@AllArgsConstructor
public class QRServiceImpl implements QRService{

    @Override
    public String generateQR(String token) {
        QRCodeWriter writer = new QRCodeWriter();
        try {
            BitMatrix encode = writer.encode(token, BarcodeFormat.QR_CODE, 400, 400);

            // custom colors
            int onColor = 0xFF6366F1;
            int offColor = 0xFF0A0A0A;

            MatrixToImageConfig config = new MatrixToImageConfig(onColor, offColor);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(encode, "PNG", pngOutputStream, config);

            byte[] pngData = pngOutputStream.toByteArray();

            return Base64.getEncoder().encodeToString(pngData);

        } catch (WriterException e) {
            throw new QRGenerationFailedException("Internal error while generating QR code");
        } catch (IOException e) {
            throw new QRCodeToImageConverationFailedException("Failed to convert byte data into Image");
        }
    }
}
