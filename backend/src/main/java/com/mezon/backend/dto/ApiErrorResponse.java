package com.mezon.backend.dto;

public class ApiErrorResponse {

    private String code;
    private String message;

    public ApiErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(code, message);
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}