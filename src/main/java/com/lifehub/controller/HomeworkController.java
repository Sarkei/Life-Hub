package com.lifehub.controller;

import com.lifehub.model.Homework;
import com.lifehub.repository.HomeworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/homework")
@CrossOrigin(origins = "*")
public class HomeworkController {
    
    @Autowired
    private HomeworkRepository homeworkRepository;
    
    // Get all homework for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Homework>> getAllHomework(@PathVariable Long userId) {
        List<Homework> homework = homeworkRepository.findByUserIdOrderByDueDateAsc(userId);
        return ResponseEntity.ok(homework);
    }
    
    // Get homework by completion status
    @GetMapping("/{userId}/completed/{completed}")
    public ResponseEntity<List<Homework>> getHomeworkByStatus(
            @PathVariable Long userId,
            @PathVariable Boolean completed) {
        List<Homework> homework = homeworkRepository.findByUserIdAndCompletedOrderByDueDateAsc(userId, completed);
        return ResponseEntity.ok(homework);
    }
    
    // Get homework by status enum
    @GetMapping("/{userId}/status/{status}")
    public ResponseEntity<List<Homework>> getHomeworkByStatusEnum(
            @PathVariable Long userId,
            @PathVariable Homework.HomeworkStatus status) {
        List<Homework> homework = homeworkRepository.findByUserIdAndStatusOrderByDueDateAsc(userId, status);
        return ResponseEntity.ok(homework);
    }
    
    // Get homework by subject
    @GetMapping("/{userId}/subject/{subject}")
    public ResponseEntity<List<Homework>> getHomeworkBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<Homework> homework = homeworkRepository.findByUserIdAndSubjectOrderByDueDateAsc(userId, subject);
        return ResponseEntity.ok(homework);
    }
    
    // Get homework due in date range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<Homework>> getHomeworkInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Homework> homework = homeworkRepository.findByUserIdAndDueDateBetween(userId, startDate, endDate);
        return ResponseEntity.ok(homework);
    }
    
    // Get overdue homework
    @GetMapping("/{userId}/overdue")
    public ResponseEntity<List<Homework>> getOverdueHomework(@PathVariable Long userId) {
        List<Homework> homework = homeworkRepository.findOverdueHomework(userId, LocalDate.now());
        return ResponseEntity.ok(homework);
    }
    
    // Get upcoming homework
    @GetMapping("/{userId}/upcoming")
    public ResponseEntity<List<Homework>> getUpcomingHomework(@PathVariable Long userId) {
        List<Homework> homework = homeworkRepository.findUpcomingHomework(userId, LocalDate.now());
        return ResponseEntity.ok(homework);
    }
    
    // Get homework statistics
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getHomeworkStats(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", homeworkRepository.count());
        stats.put("completedCount", homeworkRepository.countByUserIdAndCompleted(userId, true));
        stats.put("pendingCount", homeworkRepository.countByUserIdAndCompleted(userId, false));
        stats.put("overdueCount", homeworkRepository.findOverdueHomework(userId, LocalDate.now()).size());
        return ResponseEntity.ok(stats);
    }
    
    // Get single homework
    @GetMapping("/{userId}/item/{homeworkId}")
    public ResponseEntity<Homework> getHomework(
            @PathVariable Long userId,
            @PathVariable Long homeworkId) {
        return homeworkRepository.findById(homeworkId)
                .filter(hw -> hw.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new homework
    @PostMapping("/{userId}")
    public ResponseEntity<Homework> createHomework(
            @PathVariable Long userId,
            @RequestBody Homework homework) {
        homework.setId(null);
        homework.setUserId(userId);
        Homework saved = homeworkRepository.save(homework);
        return ResponseEntity.ok(saved);
    }
    
    // Update homework
    @PutMapping("/{userId}/{homeworkId}")
    public ResponseEntity<Homework> updateHomework(
            @PathVariable Long userId,
            @PathVariable Long homeworkId,
            @RequestBody Homework homework) {
        return homeworkRepository.findById(homeworkId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    homework.setId(homeworkId);
                    homework.setUserId(userId);
                    homework.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(homeworkRepository.save(homework));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Mark as completed
    @PostMapping("/{userId}/{homeworkId}/complete")
    public ResponseEntity<Homework> markAsCompleted(
            @PathVariable Long userId,
            @PathVariable Long homeworkId) {
        return homeworkRepository.findById(homeworkId)
                .filter(hw -> hw.getUserId().equals(userId))
                .map(hw -> {
                    hw.setCompleted(true);
                    hw.setStatus(Homework.HomeworkStatus.COMPLETED);
                    return ResponseEntity.ok(homeworkRepository.save(hw));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Mark as incomplete
    @PostMapping("/{userId}/{homeworkId}/uncomplete")
    public ResponseEntity<Homework> markAsIncomplete(
            @PathVariable Long userId,
            @PathVariable Long homeworkId) {
        return homeworkRepository.findById(homeworkId)
                .filter(hw -> hw.getUserId().equals(userId))
                .map(hw -> {
                    hw.setCompleted(false);
                    hw.setCompletedAt(null);
                    hw.setStatus(Homework.HomeworkStatus.PENDING);
                    return ResponseEntity.ok(homeworkRepository.save(hw));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete homework
    @DeleteMapping("/{userId}/{homeworkId}")
    public ResponseEntity<Void> deleteHomework(
            @PathVariable Long userId,
            @PathVariable Long homeworkId) {
        return homeworkRepository.findById(homeworkId)
                .filter(hw -> hw.getUserId().equals(userId))
                .map(hw -> {
                    homeworkRepository.delete(hw);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
