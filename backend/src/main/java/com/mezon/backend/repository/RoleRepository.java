package com.mezon.backend.repository;

import com.mezon.backend.entity.Permission;
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
            role.setRoleLevel(rs.getInt("role_level"));
            role.setCreatedAt(rs.getLong("createdAt"));
            role.setUpdatedAt(rs.getLong("updatedAt"));
            return role;
        });
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
            
            // Query lấy permissions qua bảng trung gian
            String sqlPerms = "SELECT p.* FROM \"Permissions\" p " +
                              "JOIN \"Role_Permissions\" rp ON p.id = rp.permission_id " +
                              "WHERE rp.role_id = ?";
            
            List<Permission> perms = jdbcTemplate.query(sqlPerms, (rsP, rowNumP) -> {
                return new Permission(
                    rsP.getLong("id"),
                    rsP.getString("permission_name"),
                    rsP.getString("description")
                );
            }, id);
            
            role.setPermissions(perms);
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