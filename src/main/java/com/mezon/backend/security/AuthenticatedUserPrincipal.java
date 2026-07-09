package com.mezon.backend.security;

public record AuthenticatedUserPrincipal(
        Long id,
        String username,
        String email) {
}
