package com.mezon.backend.service;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Component
public class TextNormalizer {

    private static final Pattern QUESTION_NUMBER_PATTERN =
            Pattern.compile("(?m)^\\s*(câu?\\s*\\d+|\\p{InDevanagari}?\\d+[.、。)\\]])");

    private static final Pattern OPTION_PATTERN =
            Pattern.compile("(?i)^\\s*([a-d]\\s*[.、。:：)]|đáp án\\s*[a-d])");

    public List<String> splitIntoParagraphs(String rawText) {
        List<String> paragraphs = new ArrayList<>();
        String[] lines = rawText.split("\\r?\\n");

        StringBuilder current = new StringBuilder();
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                if (current.length() > 0) {
                    paragraphs.add(current.toString().trim());
                    current.setLength(0);
                }
            } else {
                current.append(trimmed).append(" ");
            }
        }
        if (current.length() > 0) {
            paragraphs.add(current.toString().trim());
        }
        return paragraphs;
    }

    public String normalizeText(String text) {
        if (text == null) return "";
        return text
                .replaceAll("[\\u2018\\u2019]", "'")
                .replaceAll("[\\u201C\\u201D]", "\"")
                .replaceAll("[\\u00A0\\u200B\\u200C\\u200D]", " ")
                .replaceAll("\\s+", " ")
                .replaceAll("[ \\t]+", " ")
                .trim();
    }

    public String extractQuestionNumber(String text) {
        Matcher m = QUESTION_NUMBER_PATTERN.matcher(text);
        if (m.find()) {
            return m.group(1).trim();
        }
        return null;
    }

    public boolean isLikelyQuestion(String paragraph) {
        if (paragraph == null || paragraph.length() < 10) return false;
        String lower = paragraph.toLowerCase();
        return lower.contains("?")
                || lower.startsWith("câu")
                || lower.matches("^\\s*\\d+[.、。)\\]].*");
    }

    public List<String> splitQuestionAndOptions(String paragraph) {
        List<String> parts = new ArrayList<>();
        String[] lines = paragraph.split("\\r?\\n");

        StringBuilder questionPart = new StringBuilder();
        List<String> optionLines = new ArrayList<>();
        boolean inOptions = false;

        for (String line : lines) {
            String trimmed = line.trim();
            Matcher m = OPTION_PATTERN.matcher(trimmed);

            if (m.find() || trimmed.matches("^[a-dA-D][.、。:：)].*")) {
                inOptions = true;
            }

            if (inOptions) {
                if (!trimmed.isEmpty()) {
                    optionLines.add(trimmed);
                }
            } else {
                if (!trimmed.isEmpty()) {
                    questionPart.append(trimmed).append(" ");
                }
            }
        }

        parts.add(questionPart.toString().trim());
        parts.addAll(optionLines);
        return parts;
    }

    public String extractLabel(String optionLine) {
        Matcher m = Pattern.compile("^\\s*([a-dA-D])[.、。:：)]").matcher(optionLine);
        if (m.find()) {
            return m.group(1).toUpperCase();
        }
        Matcher m2 = Pattern.compile("(?i)^\\s*(đáp án\\s*)?([a-d])").matcher(optionLine);
        if (m2.find()) {
            return m2.group(2).toUpperCase();
        }
        return null;
    }

    public String extractContent(String optionLine) {
        return optionLine
                .replaceFirst("(?i)^\\s*đáp án\\s*[a-d][.、。:：)]\\s*", "")
                .replaceFirst("^\\s*[a-dA-D][.、。:：)]\\s*", "")
                .trim();
    }

    public String normalizeDifficulty(String difficulty) {
        if (difficulty == null) return "MEDIUM";
        String d = difficulty.toUpperCase().trim();
        return switch (d) {
            case "DE", "DỄ", "EASY", "1" -> "EASY";
            case "TRUNG BÌNH", "TB", "MEDIUM", "AVERAGE", "2" -> "MEDIUM";
            case "KHO", "KHÓ", "HARD", "DIFFICULT", "3" -> "HARD";
            default -> "MEDIUM";
        };
    }
}
