package com.mezon.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    private Long id;
    private String roleName;
    private String description;
    private Integer roleLevel;
    private Long createdAt;
    private Long updatedAt;
    // private List<Permission> permissions; // WAIT FOR UPGRADE
}
