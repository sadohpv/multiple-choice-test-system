package com.mezon.backend.constants;

import java.util.Arrays;

public enum Role {
    ADMIN(100, "ADMIN"),
    MODERATOR(50, "MODERATOR"),
    USER(10, "USER");

    private final int level;
    private final String authority;

    Role(int level, String authority) {
        this.level = level;
        this.authority = authority;
    }

    public int getLevel() {
        return level;
    }

    public String getAuthority() {
        return authority;
    }

    // Convert từ level (DB) -> enum
    public static Role fromLevel(int level) {
        return Arrays.stream(values())
                .filter(r -> r.level == level)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid role level: " + level));
    }

    // Check permission theo level
    public boolean hasPermission(Role required) {
        return this.level >= required.level;
    }
}