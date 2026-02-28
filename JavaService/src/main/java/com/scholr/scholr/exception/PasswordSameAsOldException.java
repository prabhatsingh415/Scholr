package com.scholr.scholr.exception;

public class PasswordSameAsOldException extends RuntimeException {
    public PasswordSameAsOldException(String message) {
        super(message);
    }
}
