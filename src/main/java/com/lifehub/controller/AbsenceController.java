package com.lifehub.controller;

import com.lifehub.model.Absence;
import com.lifehub.repository.AbsenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/absences")
@CrossOrigin(origins = "*")
public class AbsenceController {
    
    @Autowired
    private AbsenceRepository absenceRepository;
    
    // Get all absences for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Absence>> getAllAbsences(@PathVariable Long userId) {
        List<Absence> absences = absenceRepository.findByUserIdOrderByAbsenceDateDesc(userId);
        return ResponseEntity.ok(absences);
    }
    
    // Get absences by subject
    @GetMapping("/{userId}/subject/{subject}")
    public ResponseEntity<List<Absence>> getAbsencesBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<Absence> absences = absenceRepository.findByUserIdAndSubjectOrderByAbsenceDateDesc(userId, subject);
        return ResponseEntity.ok(absences);
    }
    
    // Get absences in date range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<Absence>> getAbsencesInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Absence> absences = absenceRepository.findByUserIdAndAbsenceDateBetween(userId, startDate, endDate);
        return ResponseEntity.ok(absences);
    }
    
    // Get absence statistics
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getAbsenceStats(@PathVariable Long userId) {
        Long totalPeriods = absenceRepository.countTotalPeriods(userId);
        Long sickPeriods = absenceRepository.countPeriodsByType(userId, Absence.AbsenceType.SICK);
        Long excusedPeriods = absenceRepository.countPeriodsByType(userId, Absence.AbsenceType.EXCUSED);
        Long unexcusedPeriods = absenceRepository.countPeriodsByType(userId, Absence.AbsenceType.UNEXCUSED);
        Long latePeriods = absenceRepository.countPeriodsByType(userId, Absence.AbsenceType.LATE);
        
        Long excusedCount = absenceRepository.countByUserIdAndExcused(userId, true);
        Long unexcusedCount = absenceRepository.countByUserIdAndExcused(userId, false);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPeriods", totalPeriods != null ? totalPeriods : 0);
        stats.put("sickPeriods", sickPeriods != null ? sickPeriods : 0);
        stats.put("excusedPeriods", excusedPeriods != null ? excusedPeriods : 0);
        stats.put("unexcusedPeriods", unexcusedPeriods != null ? unexcusedPeriods : 0);
        stats.put("latePeriods", latePeriods != null ? latePeriods : 0);
        stats.put("excusedCount", excusedCount);
        stats.put("unexcusedCount", unexcusedCount);
        
        return ResponseEntity.ok(stats);
    }
    
    // Get absences by subject (summary)
    @GetMapping("/{userId}/by-subject")
    public ResponseEntity<List<Map<String, Object>>> getAbsencesBySubject(@PathVariable Long userId) {
        List<Object[]> results = absenceRepository.findAbsencesBySubject(userId);
        List<Map<String, Object>> summary = results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("subject", row[0]);
                    map.put("periods", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(summary);
    }
    
    // Get single absence
    @GetMapping("/{userId}/item/{absenceId}")
    public ResponseEntity<Absence> getAbsence(
            @PathVariable Long userId,
            @PathVariable Long absenceId) {
        return absenceRepository.findById(absenceId)
                .filter(absence -> absence.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new absence
    @PostMapping("/{userId}")
    public ResponseEntity<Absence> createAbsence(
            @PathVariable Long userId,
            @RequestBody Absence absence) {
        absence.setId(null);
        absence.setUserId(userId);
        Absence saved = absenceRepository.save(absence);
        return ResponseEntity.ok(saved);
    }
    
    // Update absence
    @PutMapping("/{userId}/{absenceId}")
    public ResponseEntity<Absence> updateAbsence(
            @PathVariable Long userId,
            @PathVariable Long absenceId,
            @RequestBody Absence absence) {
        return absenceRepository.findById(absenceId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    absence.setId(absenceId);
                    absence.setUserId(userId);
                    absence.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(absenceRepository.save(absence));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Mark as excused
    @PostMapping("/{userId}/{absenceId}/excuse")
    public ResponseEntity<Absence> markAsExcused(
            @PathVariable Long userId,
            @PathVariable Long absenceId,
            @RequestBody(required = false) Map<String, Boolean> data) {
        return absenceRepository.findById(absenceId)
                .filter(absence -> absence.getUserId().equals(userId))
                .map(absence -> {
                    absence.setExcused(true);
                    if (data != null && data.containsKey("noteSubmitted")) {
                        absence.setExcuseNoteSubmitted(data.get("noteSubmitted"));
                    }
                    return ResponseEntity.ok(absenceRepository.save(absence));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete absence
    @DeleteMapping("/{userId}/{absenceId}")
    public ResponseEntity<Void> deleteAbsence(
            @PathVariable Long userId,
            @PathVariable Long absenceId) {
        return absenceRepository.findById(absenceId)
                .filter(absence -> absence.getUserId().equals(userId))
                .map(absence -> {
                    absenceRepository.delete(absence);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
