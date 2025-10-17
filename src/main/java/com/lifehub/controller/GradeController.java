package com.lifehub.controller;

import com.lifehub.model.Grade;
import com.lifehub.repository.GradeRepository;
import com.lifehub.repository.SchoolSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "*")
public class GradeController {
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private SchoolSubjectRepository subjectRepository;
    
    // Get all grades for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Grade>> getAllGrades(@PathVariable Long userId) {
        List<Grade> grades = gradeRepository.findByUserIdOrderByReceivedDateDesc(userId);
        return ResponseEntity.ok(grades);
    }
    
    // Get grades by subject
    @GetMapping("/{userId}/subject/{subject}")
    public ResponseEntity<List<Grade>> getGradesBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<Grade> grades = gradeRepository.findByUserIdAndSubjectOrderByReceivedDateDesc(userId, subject);
        return ResponseEntity.ok(grades);
    }
    
    // Get grades by semester
    @GetMapping("/{userId}/semester/{semester}")
    public ResponseEntity<List<Grade>> getGradesBySemester(
            @PathVariable Long userId,
            @PathVariable String semester) {
        List<Grade> grades = gradeRepository.findByUserIdAndSemesterOrderByReceivedDateDesc(userId, semester);
        return ResponseEntity.ok(grades);
    }
    
    // Get grades by school year
    @GetMapping("/{userId}/school-year/{schoolYear}")
    public ResponseEntity<List<Grade>> getGradesBySchoolYear(
            @PathVariable Long userId,
            @PathVariable String schoolYear) {
        List<Grade> grades = gradeRepository.findByUserIdAndSchoolYearOrderBySubjectAscReceivedDateDesc(userId, schoolYear);
        return ResponseEntity.ok(grades);
    }
    
    // Get grades in date range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<Grade>> getGradesInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Grade> grades = gradeRepository.findByUserIdAndReceivedDateBetween(userId, startDate, endDate);
        return ResponseEntity.ok(grades);
    }
    
    // Get weighted average by subject
    @GetMapping("/{userId}/averages")
    public ResponseEntity<List<Map<String, Object>>> getWeightedAverages(@PathVariable Long userId) {
        List<Object[]> results = gradeRepository.findWeightedAverageBySubject(userId);
        List<Map<String, Object>> averages = results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("subject", row[0]);
                    map.put("average", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(averages);
    }
    
    // Get weighted average for specific subject
    @GetMapping("/{userId}/subject/{subject}/average")
    public ResponseEntity<Map<String, Object>> getSubjectAverage(
            @PathVariable Long userId,
            @PathVariable String subject) {
        BigDecimal average = gradeRepository.findWeightedAverageByUserIdAndSubject(userId, subject);
        Map<String, Object> response = new HashMap<>();
        response.put("subject", subject);
        response.put("average", average);
        return ResponseEntity.ok(response);
    }
    
    // Get statistics for subject
    @GetMapping("/{userId}/subject/{subject}/stats")
    public ResponseEntity<Map<String, Object>> getSubjectStats(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<Object[]> results = gradeRepository.findStatisticsBySubject(userId, subject);
        Map<String, Object> stats = new HashMap<>();
        
        if (!results.isEmpty()) {
            Object[] row = results.get(0);
            stats.put("count", row[0]);
            stats.put("average", row[1]);
            stats.put("best", row[2]);
            stats.put("worst", row[3]);
        }
        
        // Update subject's current average
        BigDecimal average = gradeRepository.findWeightedAverageByUserIdAndSubject(userId, subject);
        subjectRepository.findByUserIdAndName(userId, subject).ifPresent(subj -> {
            subj.setCurrentAverage(average);
            subjectRepository.save(subj);
        });
        
        return ResponseEntity.ok(stats);
    }
    
    // Get overall statistics
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getOverallStats(@PathVariable Long userId) {
        List<Grade> allGrades = gradeRepository.findByUserIdOrderByReceivedDateDesc(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", allGrades.size());
        
        if (!allGrades.isEmpty()) {
            // Calculate overall average
            double sum = allGrades.stream()
                    .mapToDouble(g -> g.getGrade().doubleValue() * g.getWeight().doubleValue())
                    .sum();
            double weightSum = allGrades.stream()
                    .mapToDouble(g -> g.getWeight().doubleValue())
                    .sum();
            stats.put("overallAverage", BigDecimal.valueOf(sum / weightSum));
            
            // Best and worst grades
            Grade best = allGrades.stream()
                    .min((g1, g2) -> g1.getGrade().compareTo(g2.getGrade()))
                    .orElse(null);
            Grade worst = allGrades.stream()
                    .max((g1, g2) -> g1.getGrade().compareTo(g2.getGrade()))
                    .orElse(null);
            
            stats.put("bestGrade", best != null ? best.getGrade() : null);
            stats.put("worstGrade", worst != null ? worst.getGrade() : null);
        }
        
        return ResponseEntity.ok(stats);
    }
    
    // Get single grade
    @GetMapping("/{userId}/item/{gradeId}")
    public ResponseEntity<Grade> getGrade(
            @PathVariable Long userId,
            @PathVariable Long gradeId) {
        return gradeRepository.findById(gradeId)
                .filter(grade -> grade.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new grade
    @PostMapping("/{userId}")
    public ResponseEntity<Grade> createGrade(
            @PathVariable Long userId,
            @RequestBody Grade grade) {
        grade.setId(null);
        grade.setUserId(userId);
        Grade saved = gradeRepository.save(grade);
        
        // Update subject's current average
        BigDecimal average = gradeRepository.findWeightedAverageByUserIdAndSubject(userId, grade.getSubject());
        subjectRepository.findByUserIdAndName(userId, grade.getSubject()).ifPresent(subj -> {
            subj.setCurrentAverage(average);
            subjectRepository.save(subj);
        });
        
        return ResponseEntity.ok(saved);
    }
    
    // Update grade
    @PutMapping("/{userId}/{gradeId}")
    public ResponseEntity<Grade> updateGrade(
            @PathVariable Long userId,
            @PathVariable Long gradeId,
            @RequestBody Grade grade) {
        return gradeRepository.findById(gradeId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    grade.setId(gradeId);
                    grade.setUserId(userId);
                    grade.setCreatedAt(existing.getCreatedAt());
                    Grade saved = gradeRepository.save(grade);
                    
                    // Update subject's current average
                    BigDecimal average = gradeRepository.findWeightedAverageByUserIdAndSubject(userId, grade.getSubject());
                    subjectRepository.findByUserIdAndName(userId, grade.getSubject()).ifPresent(subj -> {
                        subj.setCurrentAverage(average);
                        subjectRepository.save(subj);
                    });
                    
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete grade
    @DeleteMapping("/{userId}/{gradeId}")
    public ResponseEntity<Void> deleteGrade(
            @PathVariable Long userId,
            @PathVariable Long gradeId) {
        return gradeRepository.findById(gradeId)
                .filter(grade -> grade.getUserId().equals(userId))
                .map(grade -> {
                    String subject = grade.getSubject();
                    gradeRepository.delete(grade);
                    
                    // Update subject's current average
                    BigDecimal average = gradeRepository.findWeightedAverageByUserIdAndSubject(userId, subject);
                    subjectRepository.findByUserIdAndName(userId, subject).ifPresent(subj -> {
                        subj.setCurrentAverage(average);
                        subjectRepository.save(subj);
                    });
                    
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
