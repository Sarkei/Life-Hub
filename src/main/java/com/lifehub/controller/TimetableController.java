package com.lifehub.controller;

import com.lifehub.model.TimetableEntry;
import com.lifehub.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
public class TimetableController {
    
    @Autowired
    private TimetableRepository timetableRepository;
    
    // Get all timetable entries for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<TimetableEntry>> getAllEntries(@PathVariable Long userId) {
        List<TimetableEntry> entries = timetableRepository.findByUserIdOrderByDayOfWeekAscStartTimeAsc(userId);
        return ResponseEntity.ok(entries);
    }
    
    // Get entries for specific day
    @GetMapping("/{userId}/day/{dayOfWeek}")
    public ResponseEntity<List<TimetableEntry>> getEntriesByDay(
            @PathVariable Long userId,
            @PathVariable DayOfWeek dayOfWeek) {
        List<TimetableEntry> entries = timetableRepository.findByUserIdAndDayOfWeekOrderByStartTimeAsc(userId, dayOfWeek);
        return ResponseEntity.ok(entries);
    }
    
    // Get valid entries for a specific date (respects validFrom/validUntil)
    @GetMapping("/{userId}/date/{date}")
    public ResponseEntity<List<TimetableEntry>> getEntriesByDate(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TimetableEntry> entries = timetableRepository.findValidEntriesForUserAndDate(userId, date);
        return ResponseEntity.ok(entries);
    }
    
    // Get entries by subject
    @GetMapping("/{userId}/subject/{subject}")
    public ResponseEntity<List<TimetableEntry>> getEntriesBySubject(
            @PathVariable Long userId,
            @PathVariable String subject) {
        List<TimetableEntry> entries = timetableRepository.findByUserIdAndSubject(userId, subject);
        return ResponseEntity.ok(entries);
    }
    
    // Get single entry
    @GetMapping("/{userId}/entry/{entryId}")
    public ResponseEntity<TimetableEntry> getEntry(
            @PathVariable Long userId,
            @PathVariable Long entryId) {
        return timetableRepository.findById(entryId)
                .filter(entry -> entry.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new entry
    @PostMapping("/{userId}")
    public ResponseEntity<TimetableEntry> createEntry(
            @PathVariable Long userId,
            @RequestBody TimetableEntry entry) {
        entry.setId(null);
        entry.setUserId(userId);
        TimetableEntry saved = timetableRepository.save(entry);
        return ResponseEntity.ok(saved);
    }
    
    // Update entry
    @PutMapping("/{userId}/{entryId}")
    public ResponseEntity<TimetableEntry> updateEntry(
            @PathVariable Long userId,
            @PathVariable Long entryId,
            @RequestBody TimetableEntry entry) {
        return timetableRepository.findById(entryId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    entry.setId(entryId);
                    entry.setUserId(userId);
                    entry.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(timetableRepository.save(entry));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete entry
    @DeleteMapping("/{userId}/{entryId}")
    public ResponseEntity<Void> deleteEntry(
            @PathVariable Long userId,
            @PathVariable Long entryId) {
        return timetableRepository.findById(entryId)
                .filter(entry -> entry.getUserId().equals(userId))
                .map(entry -> {
                    timetableRepository.delete(entry);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Bulk create (for importing)
    @PostMapping("/{userId}/bulk")
    public ResponseEntity<List<TimetableEntry>> createBulk(
            @PathVariable Long userId,
            @RequestBody List<TimetableEntry> entries) {
        entries.forEach(entry -> {
            entry.setId(null);
            entry.setUserId(userId);
        });
        List<TimetableEntry> saved = timetableRepository.saveAll(entries);
        return ResponseEntity.ok(saved);
    }
}
