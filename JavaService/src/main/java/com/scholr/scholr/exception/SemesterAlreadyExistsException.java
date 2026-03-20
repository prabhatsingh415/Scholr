package com.scholr.scholr.exception;

public class SemesterAlreadyExistsException extends RuntimeException {
    public SemesterAlreadyExistsException(String message) {
        super(message);
    }
}
