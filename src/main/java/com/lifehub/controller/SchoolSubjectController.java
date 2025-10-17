package com.lifehub.controller;

import com.lifehub.model.SchoolSubject;
import com.lifehub.repository.SchoolSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SchoolSubjectController {
    
    @Autowired
    private SchoolSubjectRepository subjectRepository;
    
    // Get all subjects for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<SchoolSubject>> getAllSubjects(@PathVariable Long userId) {
        List<SchoolSubject> subjects = subjectRepository.findByUserIdOrderByNameAsc(userId);
        return ResponseEntity.ok(subjects);
    }
    
    // Get active subjects
    @GetMapping("/{userId}/active")
    public ResponseEntity<List<SchoolSubject>> getActiveSubjects(@PathVariable Long userId) {
        List<SchoolSubject> subjects = subjectRepository.findByUserIdAndActiveOrderByNameAsc(userId, true);
        return ResponseEntity.ok(subjects);
    }
    
    // Get subjects by semester
    @GetMapping("/{userId}/semester/{semester}")
    public ResponseEntity<List<SchoolSubject>> getSubjectsBySemester(
            @PathVariable Long userId,
            @PathVariable String semester) {
        List<SchoolSubject> subjects = subjectRepository.findByUserIdAndSemesterOrderByNameAsc(userId, semester);
        return ResponseEntity.ok(subjects);
    }
    
    // Get single subject
    @GetMapping("/{userId}/item/{subjectId}")
    public ResponseEntity<SchoolSubject> getSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId) {
        return subjectRepository.findByUserIdAndId(userId, subjectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get subject by name
    @GetMapping("/{userId}/name/{name}")
    public ResponseEntity<SchoolSubject> getSubjectByName(
            @PathVariable Long userId,
            @PathVariable String name) {
        return subjectRepository.findByUserIdAndName(userId, name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new subject
    @PostMapping("/{userId}")
    public ResponseEntity<?> createSubject(
            @PathVariable Long userId,
            @RequestBody SchoolSubject subject) {
        // Check if subject with this name already exists
        if (subjectRepository.existsByUserIdAndName(userId, subject.getName())) {
            return ResponseEntity.badRequest().body("Subject with this name already exists");
        }
        
        subject.setId(null);
        subject.setUserId(userId);
        SchoolSubject saved = subjectRepository.save(subject);
        return ResponseEntity.ok(saved);
    }
    
    // Update subject
    @PutMapping("/{userId}/{subjectId}")
    public ResponseEntity<?> updateSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId,
            @RequestBody SchoolSubject subject) {
        return subjectRepository.findByUserIdAndId(userId, subjectId)
                .map(existing -> {
                    // Check name uniqueness if changed
                    if (!existing.getName().equals(subject.getName()) &&
                        subjectRepository.existsByUserIdAndName(userId, subject.getName())) {
                        return ResponseEntity.badRequest().body("Subject with this name already exists");
                    }
                    
                    subject.setId(subjectId);
                    subject.setUserId(userId);
                    subject.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(subjectRepository.save(subject));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Archive subject (set inactive)
    @PostMapping("/{userId}/{subjectId}/archive")
    public ResponseEntity<SchoolSubject> archiveSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId) {
        return subjectRepository.findByUserIdAndId(userId, subjectId)
                .map(subject -> {
                    subject.setActive(false);
                    return ResponseEntity.ok(subjectRepository.save(subject));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Activate subject
    @PostMapping("/{userId}/{subjectId}/activate")
    public ResponseEntity<SchoolSubject> activateSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId) {
        return subjectRepository.findByUserIdAndId(userId, subjectId)
                .map(subject -> {
                    subject.setActive(true);
                    return ResponseEntity.ok(subjectRepository.save(subject));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete subject
    @DeleteMapping("/{userId}/{subjectId}")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable Long userId,
            @PathVariable Long subjectId) {
        return subjectRepository.findByUserIdAndId(userId, subjectId)
                .map(subject -> {
                    subjectRepository.delete(subject);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Bulk create (for initial setup)
    @PostMapping("/{userId}/bulk")
    public ResponseEntity<List<SchoolSubject>> createBulk(
            @PathVariable Long userId,
            @RequestBody List<SchoolSubject> subjects) {
        subjects.forEach(subject -> {
            subject.setId(null);
            subject.setUserId(userId);
        });
        List<SchoolSubject> saved = subjectRepository.saveAll(subjects);
        return ResponseEntity.ok(saved);
    }
}
