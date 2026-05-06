package com.mezon.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Sinh Getter Setter
@NoArgsConstructor // Sinh contructor không có tham số VD : public Role()
@AllArgsConstructor // Sinh contructor có tham số VD : public Role(id,name,desc......)
public class Role {
    private Long id;
    private String roleName;
    private String description;
    private Integer roleLevel;
    private Long createdAt;
    private Long updatedAt;
    // private List<Permission> permissions; // WAIT FOR UPGRADE
}
