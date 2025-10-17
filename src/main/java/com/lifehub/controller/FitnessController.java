package com.lifehub.controller;

import com.lifehub.model.WorkoutLog;
import com.lifehub.model.WorkoutTemplate;
import com.lifehub.repository.ProfileRepository;
import com.lifehub.repository.WorkoutLogRepository;
import com.lifehub.repository.WorkoutTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/fitness")
@RequiredArgsConstructor
public class FitnessController {

    private final WorkoutTemplateRepository workoutTemplateRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final ProfileRepository profileRepository;

    // Workout Templates
    @GetMapping("/templates")
    public ResponseEntity<List<WorkoutTemplate>> getTemplates(@RequestParam Long profileId) {
        return ResponseEntity.ok(workoutTemplateRepository.findByProfileId(profileId));
    }

    @PostMapping("/templates")
    public ResponseEntity<WorkoutTemplate> createTemplate(@RequestBody WorkoutTemplate templateRequest) {
        var profile = profileRepository.findById(templateRequest.getProfile().getId()).orElseThrow();
        
        WorkoutTemplate template = WorkoutTemplate.builder()
                .name(templateRequest.getName())
                .description(templateRequest.getDescription())
                .profile(profile)
                .exercises(templateRequest.getExercises())
                .build();
        
        if (template.getExercises() != null) {
            template.getExercises().forEach(exercise -> exercise.setTemplate(template));
        }
        
        return ResponseEntity.ok(workoutTemplateRepository.save(template));
    }

    @PutMapping("/templates/{id}")
    public ResponseEntity<WorkoutTemplate> updateTemplate(@PathVariable Long id, @RequestBody WorkoutTemplate templateRequest) {
        var template = workoutTemplateRepository.findById(id).orElseThrow();
        
        template.setName(templateRequest.getName());
        template.setDescription(templateRequest.getDescription());
        
        return ResponseEntity.ok(workoutTemplateRepository.save(template));
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        workoutTemplateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Workout Logs
    @GetMapping("/logs")
    public ResponseEntity<List<WorkoutLog>> getLogs(
            @RequestParam Long profileId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        if (start != null && end != null) {
            return ResponseEntity.ok(workoutLogRepository.findByProfileIdAndWorkoutDateBetween(profileId, start, end));
        }
        return ResponseEntity.ok(workoutLogRepository.findByProfileId(profileId));
    }

    @PostMapping("/logs")
    public ResponseEntity<WorkoutLog> createLog(@RequestBody WorkoutLog logRequest) {
        var profile = profileRepository.findById(logRequest.getProfile().getId()).orElseThrow();
        
        WorkoutLog log = WorkoutLog.builder()
                .name(logRequest.getName())
                .notes(logRequest.getNotes())
                .profile(profile)
                .template(logRequest.getTemplate())
                .exercises(logRequest.getExercises())
                .workoutDate(logRequest.getWorkoutDate())
                .durationMinutes(logRequest.getDurationMinutes())
                .build();
        
        if (log.getExercises() != null) {
            log.getExercises().forEach(exercise -> exercise.setWorkoutLog(log));
        }
        
        return ResponseEntity.ok(workoutLogRepository.save(log));
    }

    @PutMapping("/logs/{id}")
    public ResponseEntity<WorkoutLog> updateLog(@PathVariable Long id, @RequestBody WorkoutLog logRequest) {
        var log = workoutLogRepository.findById(id).orElseThrow();
        
        log.setName(logRequest.getName());
        log.setNotes(logRequest.getNotes());
        log.setWorkoutDate(logRequest.getWorkoutDate());
        log.setDurationMinutes(logRequest.getDurationMinutes());
        
        return ResponseEntity.ok(workoutLogRepository.save(log));
    }

    @DeleteMapping("/logs/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        workoutLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
