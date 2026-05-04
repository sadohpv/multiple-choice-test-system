package com.mezon.backend.dto;

import java.util.Map;

public record ApiErrorResponse(
        String message,
        Map<String, String> fieldErrors) {

    public static ApiErrorResponse of(String message) {
        return new ApiErrorResponse(message, null);
    }
}
