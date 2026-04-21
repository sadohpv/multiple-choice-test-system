package com.mezon.backend.repository;

import com.mezon.backend.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class RoleRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // READ: Lấy tất cả
    public List<Role> findAll() {
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

    // READ: Lấy theo ID
    public Optional<Role> findById(Long id) {
        String sql = "SELECT * FROM \"Roles\" WHERE id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Role role = new Role();
            role.setId(rs.getLong("id"));
            role.setRoleName(rs.getString("role_name"));
            role.setDescription(rs.getString("description"));
            role.setCreatedAt(rs.getLong("createdAt"));
            role.setUpdatedAt(rs.getLong("updatedAt"));
            return role;
        }, id).stream().findFirst();
    }

    // CREATE: Lưu mới
    public int save(Role role) {
        String sql = "INSERT INTO \"Roles\" (role_name, description, \"createdAt\", \"updatedAt\") VALUES (?, ?, ?, ?)";
        long now = System.currentTimeMillis();
        return jdbcTemplate.update(sql, role.getRoleName(), role.getDescription(), now, now);
    }

    // UPDATE: Cập nhật
    public int update(Long id, Role role) {
        String sql = "UPDATE \"Roles\" SET role_name = ?, description = ?, \"updatedAt\" = ? WHERE id = ?";
        return jdbcTemplate.update(sql, role.getRoleName(), role.getDescription(), System.currentTimeMillis(), id);
    }

    // DELETE: Xóa
    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Roles\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}