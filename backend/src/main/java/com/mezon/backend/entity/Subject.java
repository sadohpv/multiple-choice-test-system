package com.mezon.backend.entity;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Subject {
    private Long id;
    private String slug;
    private String name;
    private Long createdAt;

    // Constructor không tham số
    public Subject() {
    }

    public Subject(ResultSet rs) throws SQLException { // Check ResultSet có value
        this.id = rs.getObject("id", Long.class);
        this.slug = rs.getString("slug");
        this.name = rs.getString("name");
        this.createdAt = rs.getObject("createdAt", Long.class);
    }

    // Các hàm Setter thực thụ để JDBC đổ data vào
    public void setId(Long id) {
        this.id = id;
    }

    public void setSubjectName(String subjectName) {
        this.name = subjectName;
    }

    public void setSubjectSlug(String subjectSlug) {
        this.slug = subjectSlug;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public String getSubjectName() {
        return name;
    }

    @JsonProperty("nameSlug")
    public String getSubjectName1() {
        return name + slug;
    }
}