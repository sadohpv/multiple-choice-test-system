package com.mezon.backend.dto;

public record AnswerRequest(
		String description,
		Boolean valid,
		Long question_id) {
}
