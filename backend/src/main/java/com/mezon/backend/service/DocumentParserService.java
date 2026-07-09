package com.mezon.backend.service;
import com.mezon.backend.dto.DocumentParseResult;
import com.mezon.backend.dto.ParsedQuestionDTO;
import com.mezon.backend.dto.ParsedQuestionDTO.AnswerOption;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DocumentParserService {

    private final TextNormalizer normalizer;

    private static final Pattern OPTIONS_BLOCK_PATTERN = Pattern.compile(
            "(?i)([a-dA-D][.、。:：)]\\s*[^\\n]*\\n?){4}",
            Pattern.DOTALL
    );

    private static final Pattern ANSWER_MARK_PATTERN = Pattern.compile(
            "(?i)(?:đáp án|đúng|chọn|correct|answer)\\s*:?\\s*([a-dA-D])",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern OPTION_LABEL_PATTERN = Pattern.compile(
            "^[\\s]*([a-dA-D])[.、。:：)]",
            Pattern.MULTILINE
    );

    private static final Pattern QUESTION_END_PATTERN = Pattern.compile(
            "(?i)(?:đáp án|chọn|correct|answer)\\s*:?\\s*[a-d]",
            Pattern.CASE_INSENSITIVE
    );

    public DocumentParserService(TextNormalizer normalizer) {
        this.normalizer = normalizer;
    }

    public DocumentParseResult parseDocument(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            return new DocumentParseResult(false, null, "Tên file không hợp lệ", 0);
        }

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        try {
            String rawText = switch (ext) {
                case "pdf" -> extractTextFromPDF(file.getInputStream());
                case "docx" -> extractTextFromDOCX(file.getInputStream());
                case "doc" -> extractTextFromDOCX(file.getInputStream());
                default -> null;
            };

            if (rawText == null || rawText.isBlank()) {
                return new DocumentParseResult(false, null,
                        "Không đọc được nội dung file. Định dạng được hỗ trợ: PDF, DOCX", 0);
            }

            List<ParsedQuestionDTO> questions = extractQuestions(rawText);
            if (questions.isEmpty()) {
                return new DocumentParseResult(false, null,
                        "Không tìm thấy câu hỏi trắc nghiệm trong tài liệu. " +
                        "Đảm bảo định dạng: câu hỏi - đáp án A B C D", 0);
            }

            return new DocumentParseResult(true, questions,
                    "Đã phân tích thành công " + questions.size() + " câu hỏi", questions.size());

        } catch (IOException e) {
            return new DocumentParseResult(false, null,
                    "Lỗi khi đọc file: " + e.getMessage(), 0);
        }
    }

    private String extractTextFromPDF(InputStream inputStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        }
    }

    private String extractTextFromDOCX(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream)) {
            StringBuilder sb = new StringBuilder();
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                String text = paragraph.getText();
                if (text != null && !text.isBlank()) {
                    sb.append(text).append("\n");
                }
            }
            return sb.toString();
        }
    }

    private List<ParsedQuestionDTO> extractQuestions(String rawText) {
        List<ParsedQuestionDTO> questions = new ArrayList<>();

        String normalized = rawText
                .replaceAll("\\r\\n", "\n")
                .replaceAll("\\r", "\n");

        String[] blocks = splitIntoQuestionBlocks(normalized);

        for (String block : blocks) {
            ParsedQuestionDTO parsed = parseSingleBlock(block.trim());
            if (parsed != null) {
                questions.add(parsed);
            }
        }

        return questions;
    }

    private String[] splitIntoQuestionBlocks(String text) {
        List<String> blocks = new ArrayList<>();
        StringBuilder current = new StringBuilder();

        String[] lines = text.split("\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String trimmed = line.trim();

            if (isNewQuestionStart(trimmed, i)) {
                if (current.length() > 0) {
                    blocks.add(current.toString().trim());
                    current.setLength(0);
                }
            }

            if (!trimmed.isEmpty() || current.length() > 0) {
                current.append(line).append("\n");
            }
        }

        if (current.length() > 0) {
            blocks.add(current.toString().trim());
        }

        return blocks.toArray(new String[0]);
    }

    private boolean isNewQuestionStart(String line, int lineIndex) {
        if (line.isEmpty()) return false;

        if (line.toLowerCase().matches("(?i)^\\s*(câu|question)\\s*\\d+.*")) {
            return true;
        }

        if (line.matches("^\\s*\\d+[.、。)\\]].*") && line.length() < 100) {
            return true;
        }

        if (lineIndex > 0 && line.matches("^\\s*\\d+\\s*$")) {
            return true;
        }

        return false;
    }

    private ParsedQuestionDTO parseSingleBlock(String block) {
        if (block == null || block.isEmpty()) return null;

        String[] lines = block.split("\n");
        if (lines.length < 2) return null;

        int questionEndIndex = findQuestionEndIndex(lines);
        if (questionEndIndex < 0) return null;

        StringBuilder questionText = new StringBuilder();
        for (int i = 0; i <= questionEndIndex; i++) {
            String l = lines[i].trim();
            if (!l.isEmpty()) {
                questionText.append(l).append(" ");
            }
        }

        List<AnswerOption> options = new ArrayList<>();
        int correctIndex = -1;

        for (int i = questionEndIndex + 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;

            Matcher labelMatcher = OPTION_LABEL_PATTERN.matcher(line);
            if (labelMatcher.find()) {
                String label = labelMatcher.group(1).toUpperCase();
                String content = normalizer.extractContent(line);

                int optionIndex = label.charAt(0) - 'A';
                options.add(new AnswerOption(label, content));

                if (isCorrectOption(line, i, lines)) {
                    correctIndex = optionIndex;
                }
            }
        }

        if (questionText.length() < 5) return null;
        if (options.size() < 2) return null;

        return new ParsedQuestionDTO(
                normalizer.normalizeText(questionText.toString()),
                options,
                correctIndex >= 0 ? correctIndex : null,
                "MEDIUM",
                null
        );
    }

    private int findQuestionEndIndex(String[] lines) {
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim().toLowerCase();
            if (line.isEmpty()) continue;

            Matcher answerMatcher = ANSWER_MARK_PATTERN.matcher(line);
            if (answerMatcher.find()) {
                return i;
            }

            if (line.matches("^[a-dA-D][.、。:：)].*") && i > 0) {
                return i - 1;
            }

            if (i > 0 && lines[i].trim().matches("^[a-dA-D]\\s*[/|=|→]\\s*[a-dA-D].*")) {
                return i - 1;
            }
        }
        return lines.length - 1;
    }

    private boolean isCorrectOption(String line, int currentIndex, String[] allLines) {
        Matcher m = ANSWER_MARK_PATTERN.matcher(line);
        if (m.find()) {
            String correct = m.group(1).toUpperCase();
            return line.contains(correct);
        }

        String lower = line.toLowerCase();
        if (lower.contains("đúng") || lower.contains("(đ)") || lower.contains("*") || lower.contains("✓")) {
            return true;
        }

        if (currentIndex + 1 < allLines.length) {
            String nextLine = allLines[currentIndex + 1].trim().toLowerCase();
            Matcher nextMatcher = ANSWER_MARK_PATTERN.matcher(nextLine);
            if (nextMatcher.find()) {
                return true;
            }
        }

        return false;
    }

    public String previewParse(MultipartFile file) throws IOException {
        DocumentParseResult result = parseDocument(file);
        if (!result.isSuccess()) {
            return "Lỗi: " + result.getMessage();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("=== XEM TRƯỚC (Preview) ===\n");
        sb.append("Tổng số câu hỏi: ").append(result.getTotalParsed()).append("\n\n");

        List<ParsedQuestionDTO> questions = result.getQuestions();
        for (int i = 0; i < questions.size(); i++) {
            ParsedQuestionDTO q = questions.get(i);
            sb.append("--- Câu ").append(i + 1).append(" ---\n");
            sb.append("Câu hỏi: ").append(q.getQuestion()).append("\n");

            List<AnswerOption> opts = q.getOptions();
            for (int j = 0; j < opts.size(); j++) {
                AnswerOption opt = opts.get(j);
                String marker = (q.getCorrectIndex() != null && q.getCorrectIndex() == j) ? " [ĐÚNG]" : "";
                sb.append(opt.getLabel()).append(". ").append(opt.getContent()).append(marker).append("\n");
            }
            sb.append("\n");
        }

        return sb.toString();
    }
}
