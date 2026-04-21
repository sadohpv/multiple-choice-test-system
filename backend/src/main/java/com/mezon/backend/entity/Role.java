package com.mezon.backend.entity;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
public class Role {
    private Long id;
    private String roleName;
    private String description;
    private Integer roleLevel;
    private Long createdAt;
    private Long updatedAt;
    private List<Permission> permissions;

    // Constructor không tham số
    public Role() {}

    // Các hàm Setter thực thụ để JDBC đổ data vào
    public void setId(Long id) {
        this.id = id;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }
     public void setRoleLevel(Integer roleLevel) {
        this.roleLevel = roleLevel;
    }
    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
    // Bạn cũng cần thêm Getter để Controller có thể lấy dữ liệu ra trả về cho Frontend
    public String getRoleName() { return roleName; }
    // ... tương tự cho các biến khác
    public String getDescription() {
    return description;
}
}
