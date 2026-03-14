package com.scholr.scholr.exception;

import com.scholr.scholr.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return buildResponse(HttpStatus.BAD_REQUEST, errorMessage, "VAL_001");
    }

    // --- 401 Unauthorized ---
    @ExceptionHandler({
            InvalidPasswordException.class,
            UnauthorizedAccessException.class,
            InvalidCurrentPasswordException.class,
            PasswordMismatchException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(Exception ex) {
        logErrorLocation(ex);
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), "AUTH_002");
    }

    // --- 404 Not Found ---
    @ExceptionHandler({
            UserNotFoundException.class,
            SubjectNotFoundException.class,
            BatchNotFoundException.class,
            SessionNotFoundException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleNotFound(Exception ex) {
        logErrorLocation(ex);
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), "NOT_FOUND_001");
    }

    // --- 400 Bad Request (Attendance & Logic Errors) ---
    @ExceptionHandler({
            StudentCanNotHaveSubjectsException.class,
            BatchMismatchException.class,
            OutOfRangeException.class,
            AlreadyMarkedException.class,
            SessionClosedException.class,
            TokenExpiredException.class,
            ActiveSessionException.class,
            AlreadyVerifiedException.class,
            InvalidOTPException.class,
            PasswordSameAsOldException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(Exception ex) {
        logErrorLocation(ex);

        // Custom error codes for frontend logic
        String errorCode = "BAD_REQ_001";
        if (ex instanceof OutOfRangeException) errorCode = "ATT_001";
        if (ex instanceof AlreadyMarkedException) errorCode = "ATT_002";
        if (ex instanceof TokenExpiredException) errorCode = "ATT_003";

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), errorCode);
    }

    // --- 500 Internal Server Error ---
    @ExceptionHandler({
            Exception.class,
            QRCodeToImageConverationFailedException.class,
            QRGenerationFailedException.class,
            ImageUploadFailedException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleAllOtherExceptions(Exception ex) {
        logErrorLocation(ex);
        String message = (ex instanceof ImageUploadFailedException || ex instanceof QRGenerationFailedException)
                ? ex.getMessage() : "Something went wrong, please try again later";

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, message, "ERR_500");
    }

    private void logErrorLocation(Exception ex) {
        StackTraceElement[] trace = ex.getStackTrace();
        if (trace.length > 0) {
            StackTraceElement element = trace[0];
            log.error("[Error Location] -> Class: {}, Method: {}, Line: {} | Message: {}",
                    element.getClassName(),
                    element.getMethodName(),
                    element.getLineNumber(),
                    ex.getMessage());
        }
    }

    private ResponseEntity<ApiResponse<Object>> buildResponse(HttpStatus status, String message, String errorCode) {
        return ResponseEntity.status(status).body(new ApiResponse<>(
                false,
                message,
                null,
                errorCode,
                LocalDateTime.now().toString()
        ));
    }
}