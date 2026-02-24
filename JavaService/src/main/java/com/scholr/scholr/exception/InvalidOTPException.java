package com.scholr.scholr.exception;

public class InvalidOTPException extends RuntimeException {
    public InvalidOTPException(String message) {
        super(message);
    }
}
