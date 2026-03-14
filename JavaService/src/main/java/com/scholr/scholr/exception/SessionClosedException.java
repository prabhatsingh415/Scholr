package com.scholr.scholr.exception;

public class SessionClosedException extends RuntimeException {
    public SessionClosedException(String message) {
        super(message);
    }
}
