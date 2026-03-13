package com.scholr.scholr.exception;

public class QRGenerationFailedException extends RuntimeException {
    public QRGenerationFailedException(String message) {
        super(message);
    }
}
