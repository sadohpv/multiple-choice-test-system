package com.mezon.backend.exception;

public class DuplicateFieldException extends RuntimeException {

    private final ErrorCode errorCode;

    public DuplicateFieldException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}