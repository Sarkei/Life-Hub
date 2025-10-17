package com.lifehub.controller;

import com.lifehub.model.StudySession;
import com.lifehub.repository.StudySessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/study-sessions")
@CrossOrigin(origins = "*")
public class StudySessionController {
    
    @Autowired
    private StudySessionRepository studySessionRepository;
    
    // Get all study sessions for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<StudySession>> getAllStudySessions(@PathVariable Long userId) {
        List<StudySession> sessions = studySessionRepository.findByUserIdOrderByStartTimeDesc(userId);
        return ResponseEntity.ok(sessions);
    }
    
    // Get study sessions by subject
    @GetMapping("/{userId}/subject/{subject}")
    public ResponseEntity<List<StudySession>> getStudySessionsBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<StudySession> sessions = studySessionRepository.findByUserIdAndSubjectOrderByStartTimeDesc(userId, subject);
        return ResponseEntity.ok(sessions);
    }
    
    // Get study sessions in time range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<StudySession>> getStudySessionsInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<StudySession> sessions = studySessionRepository.findByUserIdAndStartTimeBetween(userId, startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
    
    // Get active study sessions
    @GetMapping("/{userId}/active")
    public ResponseEntity<List<StudySession>> getActiveStudySessions(@PathVariable Long userId) {
        List<StudySession> sessions = studySessionRepository.findActiveStudySessions(userId);
        return ResponseEntity.ok(sessions);
    }
    
    // Get total study time by subject
    @GetMapping("/{userId}/subject/{subject}/total-time")
    public ResponseEntity<Map<String, Object>> getTotalStudyTimeBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        Long totalMinutes = studySessionRepository.findTotalStudyTimeBySubject(userId, subject);
        Map<String, Object> response = new HashMap<>();
        response.put("subject", subject);
        response.put("totalMinutes", totalMinutes != null ? totalMinutes : 0);
        response.put("totalHours", totalMinutes != null ? totalMinutes / 60.0 : 0.0);
        return ResponseEntity.ok(response);
    }
    
    // Get study time in period
    @GetMapping("/{userId}/period-total")
    public ResponseEntity<Map<String, Object>> getTotalStudyTimeInPeriod(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Long totalMinutes = studySessionRepository.findTotalStudyTimeInPeriod(userId, startDate, endDate);
        Map<String, Object> response = new HashMap<>();
        response.put("totalMinutes", totalMinutes != null ? totalMinutes : 0);
        response.put("totalHours", totalMinutes != null ? totalMinutes / 60.0 : 0.0);
        return ResponseEntity.ok(response);
    }
    
    // Get study time breakdown by subject
    @GetMapping("/{userId}/breakdown")
    public ResponseEntity<List<Map<String, Object>>> getStudyTimeBreakdown(@PathVariable Long userId) {
        List<Object[]> results = studySessionRepository.findStudyTimeBySubject(userId);
        List<Map<String, Object>> breakdown = results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("subject", row[0]);
                    Long minutes = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                    map.put("totalMinutes", minutes);
                    map.put("totalHours", minutes / 60.0);
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(breakdown);
    }
    
    // Get study session statistics
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getStudySessionStats(@PathVariable Long userId) {
        List<StudySession> allSessions = studySessionRepository.findByUserIdOrderByStartTimeDesc(userId);
        List<StudySession> completedSessions = allSessions.stream()
                .filter(s -> s.getEndTime() != null)
                .collect(Collectors.toList());
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", allSessions.size());
        stats.put("completedSessions", completedSessions.size());
        stats.put("activeSessions", allSessions.size() - completedSessions.size());
        
        // Calculate total study time
        long totalMinutes = completedSessions.stream()
                .mapToLong(s -> s.getDurationMinutes() != null ? s.getDurationMinutes() : 0)
                .sum();
        stats.put("totalMinutes", totalMinutes);
        stats.put("totalHours", totalMinutes / 60.0);
        
        // Average session length
        if (!completedSessions.isEmpty()) {
            double avgMinutes = completedSessions.stream()
                    .filter(s -> s.getDurationMinutes() != null)
                    .mapToInt(StudySession::getDurationMinutes)
                    .average()
                    .orElse(0.0);
            stats.put("averageSessionMinutes", avgMinutes);
        }
        
        return ResponseEntity.ok(stats);
    }
    
    // Get single study session
    @GetMapping("/{userId}/item/{sessionId}")
    public ResponseEntity<StudySession> getStudySession(
            @PathVariable Long userId,
            @PathVariable Long sessionId) {
        return studySessionRepository.findById(sessionId)
                .filter(session -> session.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Start new study session
    @PostMapping("/{userId}/start")
    public ResponseEntity<StudySession> startStudySession(
            @PathVariable Long userId,
            @RequestBody StudySession session) {
        session.setId(null);
        session.setUserId(userId);
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(null);
        StudySession saved = studySessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }
    
    // End study session
    @PostMapping("/{userId}/{sessionId}/end")
    public ResponseEntity<StudySession> endStudySession(
            @PathVariable Long userId,
            @PathVariable Long sessionId,
            @RequestBody(required = false) Map<String, Object> data) {
        return studySessionRepository.findById(sessionId)
                .filter(session -> session.getUserId().equals(userId))
                .map(session -> {
                    session.setEndTime(LocalDateTime.now());
                    
                    if (data != null) {
                        if (data.containsKey("effectivenessRating")) {
                            session.setEffectivenessRating((Integer) data.get("effectivenessRating"));
                        }
                        if (data.containsKey("focusLevel")) {
                            session.setFocusLevel((Integer) data.get("focusLevel"));
                        }
                        if (data.containsKey("goalAchieved")) {
                            session.setGoalAchieved((Boolean) data.get("goalAchieved"));
                        }
                        if (data.containsKey("notes")) {
                            session.setNotes((String) data.get("notes"));
                        }
                    }
                    
                    return ResponseEntity.ok(studySessionRepository.save(session));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create study session (manual entry with start and end time)
    @PostMapping("/{userId}")
    public ResponseEntity<StudySession> createStudySession(
            @PathVariable Long userId,
            @RequestBody StudySession session) {
        session.setId(null);
        session.setUserId(userId);
        StudySession saved = studySessionRepository.save(session);
        return ResponseEntity.ok(saved);
    }
    
    // Update study session
    @PutMapping("/{userId}/{sessionId}")
    public ResponseEntity<StudySession> updateStudySession(
            @PathVariable Long userId,
            @PathVariable Long sessionId,
            @RequestBody StudySession session) {
        return studySessionRepository.findById(sessionId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    session.setId(sessionId);
                    session.setUserId(userId);
                    session.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(studySessionRepository.save(session));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete study session
    @DeleteMapping("/{userId}/{sessionId}")
    public ResponseEntity<Void> deleteStudySession(
            @PathVariable Long userId,
            @PathVariable Long sessionId) {
        return studySessionRepository.findById(sessionId)
                .filter(session -> session.getUserId().equals(userId))
                .map(session -> {
                    studySessionRepository.delete(session);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
