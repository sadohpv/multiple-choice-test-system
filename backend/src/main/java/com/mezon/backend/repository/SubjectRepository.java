package com.mezon.backend.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.mezon.backend.entity.Subject;

@Repository
public class SubjectRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<Subject> findAll() {
		String sql = "SELECT * FROM \"Subject\"";
		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			Subject subject = new Subject();
			subject.setId(rs.getLong("id"));
			subject.setSubjectSlug(rs.getString("slug"));
			subject.setSubjectName(rs.getString("name"));
			subject.setCreatedAt(rs.getLong("createdAt"));
			return subject;
		});
	}
}