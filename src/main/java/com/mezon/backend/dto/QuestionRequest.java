package com.mezon.backend.dto;

import java.util.List;

public record QuestionRequest(String description,
		String content,
		String type,
		Integer difficult,
		Long subjectId,
		List<AnswerRequest> answers) {

}
