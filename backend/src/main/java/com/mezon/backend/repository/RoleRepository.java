package com.mezon.backend.repository;

import com.mezon.backend.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
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
            role.setRoleLevel(rs.getInt("role_level"));
            role.setCreatedAt(rs.getLong("createdAt"));
            role.setUpdatedAt(rs.getLong("updatedAt"));
            return role;
        });
    }
    public int getMaxRoleLevelByUserId(Long userId) {
        String snakeCaseSql = """
                SELECT COALESCE(MAX(r.role_level), 0)
                FROM "Users_Roles" ur
                JOIN "Roles" r ON r.id = ur.role_id
                WHERE ur.user_id = ?
                """;

        try {
            Integer roleLevel = jdbcTemplate.queryForObject(snakeCaseSql, Integer.class, userId);
            return roleLevel != null ? roleLevel : 0;
        } catch (DataAccessException ignored) {
            String camelCaseSql = """
                    SELECT COALESCE(MAX(r.role_level), 0)
                    FROM "Users_Roles" ur
                    JOIN "Roles" r ON r.id = ur."roleId"
                    WHERE ur."userId" = ?
                    """;
            Integer roleLevel = jdbcTemplate.queryForObject(camelCaseSql, Integer.class, userId);
            return roleLevel != null ? roleLevel : 0;
        }
    }
    // READ: Lấy theo ID
    public Optional<Role> findById(Long id) {
        String sqlRole = "SELECT * FROM \"Roles\" WHERE id = ?";

        return jdbcTemplate.query(sqlRole, (rs, rowNum) -> {
            Role role = new Role();
            role.setId(rs.getLong("id"));
            role.setRoleName(rs.getString("role_name"));
            role.setDescription(rs.getString("description"));
            role.setRoleLevel(rs.getInt("role_level"));
            role.setCreatedAt(rs.getLong("createdAt"));
            role.setUpdatedAt(rs.getLong("updatedAt"));
            return role;
        }, id).stream().findFirst();
    }

    public boolean existsByRoleNameIgnoreCase(String roleName) {
        String sql = "SELECT COUNT(id) FROM \"Roles\" WHERE LOWER(role_name) = LOWER(?)";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roleName);
        return count != null && count > 0;
    }

    public boolean existsByRoleNameIgnoreCaseAndIdNot(String roleName, Long id) {
        String sql = "SELECT COUNT(id) FROM \"Roles\" WHERE LOWER(role_name) = LOWER(?) AND id <> ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roleName, id);
        return count != null && count > 0;
    }

    // CREATE: Lưu mới
    public int save(Role role) {
        String sql = """
                INSERT INTO "Roles" (id, role_name, description, role_level, "createdAt", "updatedAt")
                VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM "Roles"), ?, ?, ?, ?, ?)
                """;
        long now = System.currentTimeMillis();
        return jdbcTemplate.update(sql, role.getRoleName(), role.getDescription(), role.getRoleLevel(), now, now);
    }

    // UPDATE: Cập nhật
    public int update(Long id, Role role) {
        String sql = "UPDATE \"Roles\" SET role_name = ?, description = ?, role_level = ?, \"updatedAt\" = ? WHERE id = ?";
        return jdbcTemplate.update(sql, role.getRoleName(), role.getDescription(), role.getRoleLevel(), System.currentTimeMillis(), id);
    }

    // DELETE: Xóa
    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Roles\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

}