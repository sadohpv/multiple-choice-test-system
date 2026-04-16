package com.mezon.backend.repository;

import com.mezon.backend.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public class RoleRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Role> findAll() {
        // SQL phải khớp với tên bảng "Roles" trong pgAdmin của bạn 
        String sql = "SELECT * FROM \"Roles\""; 
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Role role = new Role();
            role.setId(rs.getLong("id"));
            role.setRoleName(rs.getString("role_name"));
            role.setDescription(rs.getString("description"));
            role.setCreatedAt(rs.getLong("createdAt"));
            role.setUpdatedAt(rs.getLong("updatedAt"));
            return role;
        });
    }
}