package com.mezon.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.mezon.backend.entity.Subject;
import com.mezon.backend.exception.DuplicateFieldException;
import com.mezon.backend.exception.ErrorCode;

@Repository
public class SubjectRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<Subject> findAll() {
		String sql = "SELECT * FROM \"Subject\"";
		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			Subject subject = new Subject(rs);
			return subject;
		});
	}

	public Subject createSubject(Subject subject) {
		// Sử dụng RETURNING * để lấy lại tất cả các cột sau khi insert thành công
		String sql = "INSERT INTO \"Subject\" (slug, name, \"createdAt\") VALUES (?, ?, ?)" + "RETURNING *";

		try {
			return jdbcTemplate.queryForObject(
					sql,
					(rs, rowNum) -> new Subject(rs),
					subject.getSlug(),
					subject.getName(),
					System.currentTimeMillis());

		} catch (DataIntegrityViolationException e) {

			// slug bị trùng UNIQUE
			throw new DuplicateFieldException(ErrorCode.SUBJECT_SLUG_DUPLICATE,
					"Subject slug already exists");

		} catch (DataAccessException e) {

			// lỗi database chung
			System.out.print("============DataAccessException================ " + e);

			throw new RuntimeException("Failed to create subject", e);
		}
	}
}