package com.mezon.backend.config;

import com.mezon.backend.exception.DuplicateFieldException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// catch errors globally
@RestControllerAdvice
public class GlobalExceptionHandler {

    // trigger on custom dup error
    @ExceptionHandler(DuplicateFieldException.class)
    public ResponseEntity<String> handleDuplicate(DuplicateFieldException ex) {
        // return 409 conflict status
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }
}