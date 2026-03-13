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


    @ExceptionHandler({InvalidPasswordException.class, UnauthorizedAccessException.class})
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(Exception ex) {
        logErrorLocation(ex);
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), "AUTH_002");
    }

    @ExceptionHandler({StudentCanNotHaveSubjectsException.class})
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(Exception ex) {
        logErrorLocation(ex);
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), "AUTH_003");
    }

    @ExceptionHandler({UserNotFoundException.class, SubjectNotFoundException.class, BatchNotFoundException.class})
    public ResponseEntity<ApiResponse<Object>> handleNotFound(Exception ex) {
        logErrorLocation(ex);
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), "AUTH_001");
    }

    @ExceptionHandler({Exception.class, QRCodeToImageConverationFailedException.class, QRGenerationFailedException.class})
    public ResponseEntity<ApiResponse<Object>> handleAllOtherExceptions(Exception ex) {
        logErrorLocation(ex);
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong, please try again later",
                "ERR_500"
        );
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
        } else {
            log.error("[Error] -> {}", ex.getMessage());
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