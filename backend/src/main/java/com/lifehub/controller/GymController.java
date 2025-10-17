package com.lifehub.controller;

import com.lifehub.model.Exercise;
import com.lifehub.model.GymSession;
import com.lifehub.model.ExerciseLog;
import com.lifehub.repository.ExerciseRepository;
import com.lifehub.repository.GymSessionRepository;
import com.lifehub.repository.ExerciseLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gym")
@CrossOrigin(origins = "http://localhost:5173")
public class GymController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private GymSessionRepository gymSessionRepository;

    @Autowired
    private ExerciseLogRepository exerciseLogRepository;

    // ========== Exercises ==========

    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises(@RequestParam Long userId) {
        // Get both predefined and user's custom exercises
        List<Exercise> predefined = exerciseRepository.findByIsCustomFalse();
        List<Exercise> custom = exerciseRepository.findByUserIdOrderByNameAsc(userId);
        
        List<Exercise> all = new ArrayList<>();
        all.addAll(predefined);
        all.addAll(custom);
        
        return ResponseEntity.ok(all);
    }

    @GetMapping("/exercises/category/{category}")
    public ResponseEntity<List<Exercise>> getExercisesByCategory(@PathVariable Exercise.Category category) {
        List<Exercise> exercises = exerciseRepository.findByCategory(category);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/exercises/muscle/{muscleGroup}")
    public ResponseEntity<List<Exercise>> getExercisesByMuscleGroup(@PathVariable Exercise.MuscleGroup muscleGroup) {
        List<Exercise> exercises = exerciseRepository.findByMuscleGroup(muscleGroup);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/exercises/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable Long id) {
        Optional<Exercise> exercise = exerciseRepository.findById(id);
        return exercise.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/exercises")
    public ResponseEntity<?> createCustomExercise(@RequestBody Exercise exercise) {
        try {
            exercise.setIsCustom(true);
            Exercise saved = exerciseRepository.save(exercise);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating exercise: " + e.getMessage());
        }
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @RequestBody Exercise exerciseDetails) {
        try {
            Optional<Exercise> exerciseOptional = exerciseRepository.findById(id);
            
            if (exerciseOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Exercise exercise = exerciseOptional.get();
            
            // Only allow updating custom exercises
            if (!exercise.getIsCustom()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Cannot modify predefined exercises");
            }

            exercise.setName(exerciseDetails.getName());
            exercise.setCategory(exerciseDetails.getCategory());
            exercise.setMuscleGroup(exerciseDetails.getMuscleGroup());
            exercise.setEquipment(exerciseDetails.getEquipment());
            exercise.setDescription(exerciseDetails.getDescription());

            Exercise updated = exerciseRepository.save(exercise);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating exercise: " + e.getMessage());
        }
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        try {
            Optional<Exercise> exercise = exerciseRepository.findById(id);
            
            if (exercise.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            if (!exercise.get().getIsCustom()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Cannot delete predefined exercises");
            }

            exerciseRepository.deleteById(id);
            return ResponseEntity.ok().body("Exercise deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting exercise: " + e.getMessage());
        }
    }

    // ========== Gym Sessions ==========

    @GetMapping("/sessions")
    public ResponseEntity<List<GymSession>> getAllSessions(@RequestParam Long userId) {
        List<GymSession> sessions = gymSessionRepository.findByUserIdOrderByStartTimeDesc(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/recent")
    public ResponseEntity<List<GymSession>> getRecentSessions(@RequestParam Long userId) {
        List<GymSession> sessions = gymSessionRepository.findLast10SessionsByUserId(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/active")
    public ResponseEntity<?> getActiveSession(@RequestParam Long userId) {
        Optional<GymSession> session = gymSessionRepository.findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId);
        return session.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Long id) {
        Optional<GymSession> session = gymSessionRepository.findById(id);
        
        if (session.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        GymSession gymSession = session.get();
        
        // Load exercise logs for this session
        List<ExerciseLog> logs = exerciseLogRepository.findByGymSessionId(id);
        gymSession.setExerciseLogs(logs);
        
        return ResponseEntity.ok(gymSession);
    }

    @PostMapping("/sessions/start")
    public ResponseEntity<?> startSession(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            
            // Check if there's already an active session
            Optional<GymSession> activeSession = gymSessionRepository
                    .findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId);
            
            if (activeSession.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("There is already an active session. Please end it first.");
            }

            GymSession session = new GymSession(userId, LocalDateTime.now());
            if (request.containsKey("workoutName")) {
                session.setWorkoutName(request.get("workoutName").toString());
            }

            GymSession saved = gymSessionRepository.save(session);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error starting session: " + e.getMessage());
        }
    }

    @PutMapping("/sessions/{id}/end")
    public ResponseEntity<?> endSession(@PathVariable Long id) {
        try {
            Optional<GymSession> sessionOptional = gymSessionRepository.findById(id);
            
            if (sessionOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            GymSession session = sessionOptional.get();
            
            if (session.getEndTime() != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Session is already ended");
            }

            LocalDateTime endTime = LocalDateTime.now();
            session.setEndTime(endTime);
            
            // Calculate duration
            Duration duration = Duration.between(session.getStartTime(), endTime);
            session.setDurationMinutes((int) duration.toMinutes());

            GymSession updated = gymSessionRepository.save(session);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error ending session: " + e.getMessage());
        }
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @RequestBody GymSession sessionDetails) {
        try {
            Optional<GymSession> sessionOptional = gymSessionRepository.findById(id);
            
            if (sessionOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            GymSession session = sessionOptional.get();
            
            if (sessionDetails.getWorkoutName() != null) {
                session.setWorkoutName(sessionDetails.getWorkoutName());
            }
            if (sessionDetails.getNotes() != null) {
                session.setNotes(sessionDetails.getNotes());
            }

            GymSession updated = gymSessionRepository.save(session);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating session: " + e.getMessage());
        }
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        try {
            if (!gymSessionRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            gymSessionRepository.deleteById(id);
            return ResponseEntity.ok().body("Session deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting session: " + e.getMessage());
        }
    }

    // ========== Exercise Logs ==========

    @GetMapping("/logs/session/{sessionId}")
    public ResponseEntity<List<ExerciseLog>> getLogsBySession(@PathVariable Long sessionId) {
        List<ExerciseLog> logs = exerciseLogRepository.findByGymSessionId(sessionId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/logs/exercise/{exerciseId}")
    public ResponseEntity<List<ExerciseLog>> getLogsByExercise(
            @PathVariable Long exerciseId,
            @RequestParam Long userId) {
        List<ExerciseLog> logs = exerciseLogRepository.findLast20LogsByExerciseAndUser(exerciseId, userId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/logs")
    public ResponseEntity<?> addExerciseLog(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            Long exerciseId = Long.valueOf(request.get("exerciseId").toString());
            Integer setNumber = Integer.valueOf(request.get("setNumber").toString());
            Integer reps = Integer.valueOf(request.get("reps").toString());
            
            Optional<GymSession> sessionOpt = gymSessionRepository.findById(sessionId);
            Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseId);
            
            if (sessionOpt.isEmpty() || exerciseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid session or exercise ID");
            }

            ExerciseLog log = new ExerciseLog(
                    sessionOpt.get(),
                    exerciseOpt.get(),
                    setNumber,
                    reps,
                    request.containsKey("weight") ? 
                            Double.valueOf(request.get("weight").toString()) : null
            );

            if (request.containsKey("notes")) {
                log.setNotes(request.get("notes").toString());
            }

            ExerciseLog saved = exerciseLogRepository.save(log);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding exercise log: " + e.getMessage());
        }
    }

    @PutMapping("/logs/{id}")
    public ResponseEntity<?> updateExerciseLog(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Optional<ExerciseLog> logOptional = exerciseLogRepository.findById(id);
            
            if (logOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ExerciseLog log = logOptional.get();
            
            if (request.containsKey("reps")) {
                log.setReps(Integer.valueOf(request.get("reps").toString()));
            }
            if (request.containsKey("weight")) {
                log.setWeight(Double.valueOf(request.get("weight").toString()));
            }
            if (request.containsKey("notes")) {
                log.setNotes(request.get("notes").toString());
            }

            ExerciseLog updated = exerciseLogRepository.save(log);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating exercise log: " + e.getMessage());
        }
    }

    @DeleteMapping("/logs/{id}")
    public ResponseEntity<?> deleteExerciseLog(@PathVariable Long id) {
        try {
            if (!exerciseLogRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            exerciseLogRepository.deleteById(id);
            return ResponseEntity.ok().body("Exercise log deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting exercise log: " + e.getMessage());
        }
    }

    // ========== Statistics ==========

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam Long userId) {
        Map<String, Object> stats = new HashMap<>();

        // Total sessions
        long totalSessions = gymSessionRepository.countByUserId(userId);
        stats.put("totalSessions", totalSessions);

        // Recent sessions
        List<GymSession> recentSessions = gymSessionRepository.findLast10SessionsByUserId(userId);
        stats.put("recentSessions", recentSessions.size());

        // Total workout time
        List<GymSession> allSessions = gymSessionRepository.findByUserIdOrderByStartTimeDesc(userId);
        int totalMinutes = allSessions.stream()
                .filter(s -> s.getDurationMinutes() != null)
                .mapToInt(GymSession::getDurationMinutes)
                .sum();
        stats.put("totalWorkoutMinutes", totalMinutes);
        stats.put("totalWorkoutHours", totalMinutes / 60.0);

        // Average workout duration
        double avgDuration = allSessions.stream()
                .filter(s -> s.getDurationMinutes() != null)
                .mapToInt(GymSession::getDurationMinutes)
                .average()
                .orElse(0);
        stats.put("averageWorkoutMinutes", Math.round(avgDuration));

        // Active session
        Optional<GymSession> activeSession = gymSessionRepository
                .findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(userId);
        stats.put("hasActiveSession", activeSession.isPresent());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/exercise/{exerciseId}")
    public ResponseEntity<Map<String, Object>> getExerciseStats(
            @PathVariable Long exerciseId,
            @RequestParam Long userId) {
        
        Map<String, Object> stats = new HashMap<>();
        
        List<ExerciseLog> logs = exerciseLogRepository.findByExerciseIdAndUserId(exerciseId, userId);
        
        if (logs.isEmpty()) {
            return ResponseEntity.ok(stats);
        }

        // Total sets
        stats.put("totalSets", logs.size());

        // Max weight
        OptionalDouble maxWeight = logs.stream()
                .filter(l -> l.getWeight() != null)
                .mapToDouble(ExerciseLog::getWeight)
                .max();
        if (maxWeight.isPresent()) {
            stats.put("maxWeight", maxWeight.getAsDouble());
        }

        // Max reps
        int maxReps = logs.stream()
                .mapToInt(ExerciseLog::getReps)
                .max()
                .orElse(0);
        stats.put("maxReps", maxReps);

        // Total volume (weight * reps)
        double totalVolume = logs.stream()
                .filter(l -> l.getWeight() != null)
                .mapToDouble(l -> l.getWeight() * l.getReps())
                .sum();
        stats.put("totalVolume", totalVolume);

        // Recent progress (last 20 logs)
        List<ExerciseLog> recent = logs.stream()
                .limit(20)
                .collect(Collectors.toList());
        stats.put("recentLogs", recent);

        return ResponseEntity.ok(stats);
    }
}
