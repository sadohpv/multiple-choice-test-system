package com.mezon.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor // final || @NonNull sẽ sinh constructor
@Builder
@AllArgsConstructor
public class Test {
	private final Long id; // Sẽ có trong constructor
	@NonNull
	private String roleName; // Sẽ có trong constructor
	private String description; // KHÔNG CÓ

}
// CÁCH DỪNG BUILDER
// Role myRole = Role.builder()
// .id(1L)
// .roleName("ADMIN")
// .description("Quyền quản trị")
// .build();

// BẢN CHẤT BUILDER
// public static class RoleBuilder {
// private Long id;
// private String roleName;

// RoleBuilder() {}

//
// public RoleBuilder id(Long id) {
// this.id = id;
// return this; // Trả về chính đối tượng builder để gọi tiếp phương thức khác
// }

// public RoleBuilder roleName(String roleName) {
// this.roleName = roleName;
// return this;
// }

//
// public Role build() {
// return new Role(this.id, this.roleName);
// }
// }