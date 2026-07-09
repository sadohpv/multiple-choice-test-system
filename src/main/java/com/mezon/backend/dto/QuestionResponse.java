package com.mezon.backend.dto;

import java.util.List;

import com.mezon.backend.entity.Answer;
import com.mezon.backend.entity.Question;

public record QuestionResponse(
		Question question,
		List<Answer> answers) {
}