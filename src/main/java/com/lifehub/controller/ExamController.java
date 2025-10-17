package com.lifehub.controller;

import com.lifehub.model.Exam;
import com.lifehub.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {
    
    @Autowired
    private ExamRepository examRepository;
    
    // Get all exams for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Exam>> getAllExams(@PathVariable Long userId) {
        List<Exam> exams = examRepository.findByUserIdOrderByExamDateDesc(userId);
        return ResponseEntity.ok(exams);
    }
    
    // Get exams by subject
    @GetMapping("/{userId}/subject/{subject}")
    public ResponseEntity<List<Exam>> getExamsBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<Exam> exams = examRepository.findByUserIdAndSubjectOrderByExamDateDesc(userId, subject);
        return ResponseEntity.ok(exams);
    }
    
    // Get exams in date range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<Exam>> getExamsInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Exam> exams = examRepository.findByUserIdAndExamDateBetween(userId, startDate, endDate);
        return ResponseEntity.ok(exams);
    }
    
    // Get upcoming exams
    @GetMapping("/{userId}/upcoming")
    public ResponseEntity<List<Exam>> getUpcomingExams(@PathVariable Long userId) {
        List<Exam> exams = examRepository.findUpcomingExams(userId, LocalDate.now());
        return ResponseEntity.ok(exams);
    }
    
    // Get past exams
    @GetMapping("/{userId}/past")
    public ResponseEntity<List<Exam>> getPastExams(@PathVariable Long userId) {
        List<Exam> exams = examRepository.findPastExams(userId, LocalDate.now());
        return ResponseEntity.ok(exams);
    }
    
    // Get graded exams
    @GetMapping("/{userId}/graded")
    public ResponseEntity<List<Exam>> getGradedExams(@PathVariable Long userId) {
        List<Exam> exams = examRepository.findGradedExams(userId);
        return ResponseEntity.ok(exams);
    }
    
    // Get average grade by subject
    @GetMapping("/{userId}/subject/{subject}/average")
    public ResponseEntity<Map<String, Object>> getAverageGradeBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        BigDecimal average = examRepository.findAverageGradeBySubject(userId, subject);
        Map<String, Object> response = new HashMap<>();
        response.put("subject", subject);
        response.put("averageGrade", average);
        return ResponseEntity.ok(response);
    }
    
    // Get exam statistics
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getExamStats(@PathVariable Long userId) {
        List<Exam> allExams = examRepository.findByUserIdOrderByExamDateDesc(userId);
        List<Exam> upcoming = examRepository.findUpcomingExams(userId, LocalDate.now());
        List<Exam> graded = examRepository.findGradedExams(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", allExams.size());
        stats.put("upcomingCount", upcoming.size());
        stats.put("gradedCount", graded.size());
        stats.put("ungradedCount", allExams.size() - graded.size());
        
        // Calculate average grade
        if (!graded.isEmpty()) {
            double avgGrade = graded.stream()
                    .filter(e -> e.getGrade() != null)
                    .mapToDouble(e -> e.getGrade().doubleValue())
                    .average()
                    .orElse(0.0);
            stats.put("averageGrade", BigDecimal.valueOf(avgGrade));
        }
        
        return ResponseEntity.ok(stats);
    }
    
    // Get single exam
    @GetMapping("/{userId}/item/{examId}")
    public ResponseEntity<Exam> getExam(
            @PathVariable Long userId,
            @PathVariable Long examId) {
        return examRepository.findById(examId)
                .filter(exam -> exam.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new exam
    @PostMapping("/{userId}")
    public ResponseEntity<Exam> createExam(
            @PathVariable Long userId,
            @RequestBody Exam exam) {
        exam.setId(null);
        exam.setUserId(userId);
        Exam saved = examRepository.save(exam);
        return ResponseEntity.ok(saved);
    }
    
    // Update exam
    @PutMapping("/{userId}/{examId}")
    public ResponseEntity<Exam> updateExam(
            @PathVariable Long userId,
            @PathVariable Long examId,
            @RequestBody Exam exam) {
        return examRepository.findById(examId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    exam.setId(examId);
                    exam.setUserId(userId);
                    exam.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(examRepository.save(exam));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Add grade to exam
    @PostMapping("/{userId}/{examId}/grade")
    public ResponseEntity<Exam> addGrade(
            @PathVariable Long userId,
            @PathVariable Long examId,
            @RequestBody Map<String, Object> gradeData) {
        return examRepository.findById(examId)
                .filter(exam -> exam.getUserId().equals(userId))
                .map(exam -> {
                    if (gradeData.containsKey("grade")) {
                        exam.setGrade(new BigDecimal(gradeData.get("grade").toString()));
                    }
                    if (gradeData.containsKey("points")) {
                        exam.setPoints((Integer) gradeData.get("points"));
                    }
                    if (gradeData.containsKey("maxPoints")) {
                        exam.setMaxPoints((Integer) gradeData.get("maxPoints"));
                    }
                    return ResponseEntity.ok(examRepository.save(exam));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Add study time
    @PostMapping("/{userId}/{examId}/study-time")
    public ResponseEntity<Exam> addStudyTime(
            @PathVariable Long userId,
            @PathVariable Long examId,
            @RequestBody Map<String, Integer> data) {
        return examRepository.findById(examId)
                .filter(exam -> exam.getUserId().equals(userId))
                .map(exam -> {
                    Integer minutes = data.get("minutes");
                    exam.setStudyTimeMinutes((exam.getStudyTimeMinutes() == null ? 0 : exam.getStudyTimeMinutes()) + minutes);
                    return ResponseEntity.ok(examRepository.save(exam));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete exam
    @DeleteMapping("/{userId}/{examId}")
    public ResponseEntity<Void> deleteExam(
            @PathVariable Long userId,
            @PathVariable Long examId) {
        return examRepository.findById(examId)
                .filter(exam -> exam.getUserId().equals(userId))
                .map(exam -> {
                    examRepository.delete(exam);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
