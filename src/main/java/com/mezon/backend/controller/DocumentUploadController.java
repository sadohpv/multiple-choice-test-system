package com.mezon.backend.controller;
import com.mezon.backend.dto.DocumentParseResult;
import com.mezon.backend.dto.ParsedQuestionDTO;
import com.mezon.backend.service.DocumentParserService;
import com.mezon.backend.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentUploadController {

    private final DocumentParserService parserService;
    private final QuestionService questionService;

    public DocumentUploadController(DocumentParserService parserService,
                                    QuestionService questionService) {
        this.parserService = parserService;
        this.questionService = questionService;
    }

    @PostMapping("/parse")
    public ResponseEntity<DocumentParseResult> parseDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subjectId", required = false) Long subjectId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new DocumentParseResult(false, null, "File không được để trống", 0));
        }

        String filename = file.getOriginalFilename();
        if (filename != null) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            if (!ext.matches("pdf|docx|doc")) {
                return ResponseEntity.badRequest().body(
                        new DocumentParseResult(false, null,
                                "Định dạng không được hỗ trợ. Chỉ chấp nhận: PDF, DOCX, DOC", 0));
            }
        }

        DocumentParseResult result = parserService.parseDocument(file);

        if (result.getQuestions() != null && subjectId != null) {
            for (ParsedQuestionDTO q : result.getQuestions()) {
                q.setSubjectId(subjectId);
            }
        }

        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importQuestions(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subjectId") Long subjectId,
            @RequestParam(value = "difficulty", defaultValue = "MEDIUM") String difficulty) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "File không được để trống"
            ));
        }

        DocumentParseResult parseResult = parserService.parseDocument(file);
        if (!parseResult.isSuccess()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", parseResult.getMessage()
            ));
        }

        List<ParsedQuestionDTO> questions = parseResult.getQuestions();
        for (ParsedQuestionDTO q : questions) {
            q.setSubjectId(subjectId);
            q.setDifficulty(difficulty);
        }

        int saved = questionService.importQuestions(questions);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã lưu thành công " + saved + " câu hỏi");
        response.put("totalParsed", questions.size());
        response.put("savedCount", saved);
        response.put("questions", questions);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/preview")
    public ResponseEntity<Map<String, Object>> previewDocument(
            @RequestParam("file") MultipartFile file) {
        try {
            String preview = parserService.previewParse(file);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("preview", preview);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xem trước: " + e.getMessage()
            ));
        }
    }
}
