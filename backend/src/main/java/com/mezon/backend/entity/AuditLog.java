package com.mezon.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    private Long id;
    private Long userId;
    private String username;
    private String action;
    private String targetType;
    private String targetId;
    private String detail;
    private Long createdAt;
}
