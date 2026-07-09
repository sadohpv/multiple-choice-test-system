package com.mezon.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(List<String> allowedOrigins) {

    public CorsProperties {
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            throw new IllegalStateException("At least one CORS origin must be configured");
        }
        allowedOrigins = allowedOrigins.stream()
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
        if (allowedOrigins.isEmpty()) {
            throw new IllegalStateException("At least one CORS origin must be configured");
        }
    }
}
