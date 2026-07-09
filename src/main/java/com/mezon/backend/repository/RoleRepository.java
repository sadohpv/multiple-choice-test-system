package com.mezon.backend.repository;

import com.mezon.backend.entity.Role;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RoleRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Role> roleRowMapper = (rs, rowNum) -> {
        Role role = new Role();
        role.setId(rs.getLong("id"));
        role.setRoleName(rs.getString("role_name"));
        role.setDescription(rs.getString("description"));
        role.setRoleLevel(rs.getInt("role_level"));
        role.setCreatedAt(rs.getLong("createdAt"));
        role.setUpdatedAt(rs.getLong("updatedAt"));
        return role;
    };

    public RoleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Role> findAll() {
        String sql = "SELECT * FROM \"Roles\" ORDER BY role_level DESC, id ASC";
        return jdbcTemplate.query(sql, roleRowMapper);
    }

    public int getMaxRoleLevelByUserId(Long userId) {
        String sql = """
                SELECT COALESCE(MAX(r.role_level), MAX(ur.max_role_level), 0)
                FROM "Users_Roles" ur
                JOIN "Roles" r ON r.id = ur.role_id
                WHERE ur.user_id = ?
                """;
        Integer roleLevel = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return roleLevel != null ? roleLevel : 0;
    }

    public List<Role> findRolesByUserId(Long userId) {
        String sql = """
                SELECT r.*
                FROM "Roles" r
                JOIN "Users_Roles" ur ON r.id = ur.role_id
                WHERE ur.user_id = ?
                ORDER BY r.role_level DESC, r.id ASC
                """;
        return jdbcTemplate.query(sql, roleRowMapper, userId);
    }

    public Optional<Role> findById(Long id) {
        String sql = "SELECT * FROM \"Roles\" WHERE id = ?";
        return jdbcTemplate.query(sql, roleRowMapper, id).stream().findFirst();
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

    public Role save(Role role) {
        String sql = """
                INSERT INTO "Roles" (id, role_name, description, role_level, "createdAt", "updatedAt")
                VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM "Roles"), ?, ?, ?, ?, ?)
                RETURNING *
                """;
        long now = System.currentTimeMillis();
        return jdbcTemplate.queryForObject(
                sql,
                roleRowMapper,
                role.getRoleName(),
                role.getDescription(),
                role.getRoleLevel(),
                now,
                now);
    }

    public int update(Long id, Role role) {
        String sql = """
                UPDATE "Roles"
                SET role_name = ?, description = ?, role_level = ?, "updatedAt" = ?
                WHERE id = ?
                """;
        return jdbcTemplate.update(
                sql,
                role.getRoleName(),
                role.getDescription(),
                role.getRoleLevel(),
                System.currentTimeMillis(),
                id);
    }

    public int deleteById(Long id) {
        String sql = "DELETE FROM \"Roles\" WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    public void assignRolesToUser(Long userId, List<Long> roleIds) {
        String deleteSql = "DELETE FROM \"Users_Roles\" WHERE user_id = ?";
        jdbcTemplate.update(deleteSql, userId);

        if (roleIds == null || roleIds.isEmpty()) {
            return;
        }

        long now = System.currentTimeMillis();
        for (Long roleId : roleIds) {
            int roleLevel = findById(roleId)
                    .map(Role::getRoleLevel)
                    .orElse(0);
            String insertSql = """
                    INSERT INTO "Users_Roles" (id, user_id, role_id, "createdAt", max_role_level)
                    VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM "Users_Roles"), ?, ?, ?, ?)
                    """;
            jdbcTemplate.update(insertSql, userId, roleId, now, roleLevel);
        }
    }
}
