package com.lifehub.controller;

import com.lifehub.model.TrainingPlan;
import com.lifehub.model.Workout;
import com.lifehub.model.WorkoutExercise;
import com.lifehub.model.CalendarEvent;
import com.lifehub.repository.TrainingPlanRepository;
import com.lifehub.repository.WorkoutRepository;
import com.lifehub.repository.WorkoutExerciseRepository;
import com.lifehub.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/training")
@CrossOrigin(origins = "*")
public class TrainingPlanController {
    
    @Autowired
    private TrainingPlanRepository planRepository;
    
    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private WorkoutExerciseRepository exerciseRepository;
    
    @Autowired
    private CalendarEventRepository calendarEventRepository;
    
    // ===== TRAINING PLANS =====
    
    @GetMapping("/plans")
    public ResponseEntity<List<TrainingPlan>> getTrainingPlans(@RequestParam Long userId) {
        List<TrainingPlan> plans = planRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/plans/{id}")
    public ResponseEntity<TrainingPlan> getTrainingPlan(@PathVariable Long id) {
        return planRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/plans/active")
    public ResponseEntity<TrainingPlan> getActivePlan(@RequestParam Long userId) {
        return planRepository.findByUserIdAndActiveTrue(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/plans")
    public ResponseEntity<TrainingPlan> createTrainingPlan(@RequestBody TrainingPlan plan) {
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        if (plan.getActive() == null) {
            plan.setActive(false);
        }
        TrainingPlan savedPlan = planRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }
    
    @PutMapping("/plans/{id}")
    public ResponseEntity<TrainingPlan> updateTrainingPlan(
            @PathVariable Long id,
            @RequestBody TrainingPlan planDetails) {
        
        return planRepository.findById(id)
                .map(plan -> {
                    plan.setName(planDetails.getName());
                    plan.setDescription(planDetails.getDescription());
                    plan.setGoal(planDetails.getGoal());
                    plan.setDurationWeeks(planDetails.getDurationWeeks());
                    plan.setUpdatedAt(LocalDateTime.now());
                    
                    TrainingPlan updatedPlan = planRepository.save(plan);
                    return ResponseEntity.ok(updatedPlan);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/plans/{id}/activate")
    @Transactional
    public ResponseEntity<TrainingPlan> activateTrainingPlan(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        return planRepository.findById(id)
                .map(plan -> {
                    // Deactivate all other plans for this user
                    List<TrainingPlan> allPlans = planRepository.findByUserIdOrderByCreatedAtDesc(userId);
                    allPlans.forEach(p -> {
                        if (p.getActive() && !p.getId().equals(id)) {
                            p.setActive(false);
                            planRepository.save(p);
                        }
                    });
                    
                    // Activate this plan
                    plan.setActive(true);
                    plan.setUpdatedAt(LocalDateTime.now());
                    TrainingPlan activatedPlan = planRepository.save(plan);
                    
                    // Generate calendar events for current and next week
                    generateCalendarEventsForPlan(plan, userId);
                    
                    return ResponseEntity.ok(activatedPlan);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/plans/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteTrainingPlan(@PathVariable Long id) {
        if (!planRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Delete all workouts and exercises
        List<Workout> workouts = workoutRepository.findByTrainingPlanIdOrderByDayOfWeekAsc(id);
        for (Workout workout : workouts) {
            exerciseRepository.deleteByWorkoutId(workout.getId());
        }
        workouts.forEach(w -> workoutRepository.deleteById(w.getId()));
        
        planRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Training plan deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ===== WORKOUTS =====
    
    @GetMapping("/plans/{planId}/workouts")
    public ResponseEntity<List<Workout>> getWorkouts(@PathVariable Long planId) {
        List<Workout> workouts = workoutRepository.findByTrainingPlanIdOrderByDayOfWeekAsc(planId);
        return ResponseEntity.ok(workouts);
    }
    
    @GetMapping("/workouts/{id}")
    public ResponseEntity<Workout> getWorkout(@PathVariable Long id) {
        return workoutRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/plans/{planId}/workouts")
    public ResponseEntity<Workout> createWorkout(
            @PathVariable Long planId,
            @RequestBody Workout workout) {
        workout.setTrainingPlanId(planId);
        workout.setCreatedAt(LocalDateTime.now());
        workout.setUpdatedAt(LocalDateTime.now());
        if (workout.getCompleted() == null) {
            workout.setCompleted(false);
        }
        
        Workout savedWorkout = workoutRepository.save(workout);
        
        // Update calendar events if plan is active
        planRepository.findById(planId).ifPresent(plan -> {
            if (plan.getActive()) {
                generateCalendarEventsForPlan(plan, plan.getUserId());
            }
        });
        
        return ResponseEntity.ok(savedWorkout);
    }
    
    @PutMapping("/workouts/{id}")
    public ResponseEntity<Workout> updateWorkout(
            @PathVariable Long id,
            @RequestBody Workout workoutDetails) {
        
        return workoutRepository.findById(id)
                .map(workout -> {
                    workout.setName(workoutDetails.getName());
                    workout.setDescription(workoutDetails.getDescription());
                    workout.setDayOfWeek(workoutDetails.getDayOfWeek());
                    workout.setType(workoutDetails.getType());
                    workout.setDurationMinutes(workoutDetails.getDurationMinutes());
                    workout.setCaloriesBurned(workoutDetails.getCaloriesBurned());
                    workout.setUpdatedAt(LocalDateTime.now());
                    
                    Workout updatedWorkout = workoutRepository.save(workout);
                    
                    // Update calendar events if plan is active
                    planRepository.findById(workout.getTrainingPlanId()).ifPresent(plan -> {
                        if (plan.getActive()) {
                            generateCalendarEventsForPlan(plan, plan.getUserId());
                        }
                    });
                    
                    return ResponseEntity.ok(updatedWorkout);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/workouts/{id}/complete")
    @Transactional
    public ResponseEntity<Workout> completeWorkout(@PathVariable Long id) {
        return workoutRepository.findById(id)
                .map(workout -> {
                    workout.setCompleted(true);
                    workout.setCompletedAt(LocalDateTime.now());
                    workout.setUpdatedAt(LocalDateTime.now());
                    Workout completedWorkout = workoutRepository.save(workout);
                    
                    // Create calendar event in "Fitness" category
                    planRepository.findById(workout.getTrainingPlanId()).ifPresent(plan -> {
                        CalendarEvent event = new CalendarEvent();
                        event.setUserId(plan.getUserId());
                        event.setTitle("✅ " + workout.getName());
                        event.setDescription(workout.getDescription());
                        event.setStartTime(workout.getCompletedAt());
                        event.setEndTime(workout.getCompletedAt().plusMinutes(workout.getDurationMinutes() != null ? workout.getDurationMinutes() : 60));
                        event.setCategory("fitness");
                        event.setColor("#10b981"); // Green
                        event.setAllDay(false);
                        calendarEventRepository.save(event);
                    });
                    
                    // Regenerate calendar events for remaining workouts
                    planRepository.findById(workout.getTrainingPlanId()).ifPresent(plan -> {
                        if (plan.getActive()) {
                            generateCalendarEventsForPlan(plan, plan.getUserId());
                        }
                    });
                    
                    return ResponseEntity.ok(completedWorkout);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/workouts/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteWorkout(@PathVariable Long id) {
        if (!workoutRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        exerciseRepository.deleteByWorkoutId(id);
        
        Workout workout = workoutRepository.findById(id).orElse(null);
        workoutRepository.deleteById(id);
        
        // Update calendar events if plan is active
        if (workout != null) {
            planRepository.findById(workout.getTrainingPlanId()).ifPresent(plan -> {
                if (plan.getActive()) {
                    generateCalendarEventsForPlan(plan, plan.getUserId());
                }
            });
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Workout deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ===== EXERCISES =====
    
    @GetMapping("/workouts/{workoutId}/exercises")
    public ResponseEntity<List<WorkoutExercise>> getExercises(@PathVariable Long workoutId) {
        List<WorkoutExercise> exercises = exerciseRepository.findByWorkoutIdOrderByPositionAsc(workoutId);
        return ResponseEntity.ok(exercises);
    }
    
    @PostMapping("/workouts/{workoutId}/exercises")
    public ResponseEntity<WorkoutExercise> createExercise(
            @PathVariable Long workoutId,
            @RequestBody WorkoutExercise exercise) {
        exercise.setWorkoutId(workoutId);
        exercise.setCreatedAt(LocalDateTime.now());
        WorkoutExercise savedExercise = exerciseRepository.save(exercise);
        return ResponseEntity.ok(savedExercise);
    }
    
    @PutMapping("/exercises/{id}")
    public ResponseEntity<WorkoutExercise> updateExercise(
            @PathVariable Long id,
            @RequestBody WorkoutExercise exerciseDetails) {
        
        return exerciseRepository.findById(id)
                .map(exercise -> {
                    exercise.setName(exerciseDetails.getName());
                    exercise.setSets(exerciseDetails.getSets());
                    exercise.setReps(exerciseDetails.getReps());
                    exercise.setWeight(exerciseDetails.getWeight());
                    exercise.setDurationSeconds(exerciseDetails.getDurationSeconds());
                    exercise.setNotes(exerciseDetails.getNotes());
                    exercise.setPosition(exerciseDetails.getPosition());
                    
                    WorkoutExercise updatedExercise = exerciseRepository.save(exercise);
                    return ResponseEntity.ok(updatedExercise);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Map<String, String>> deleteExercise(@PathVariable Long id) {
        if (!exerciseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        exerciseRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Exercise deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ===== CALENDAR INTEGRATION =====
    
    private void generateCalendarEventsForPlan(TrainingPlan plan, Long userId) {
        // Delete existing "trainingsplan" events for this user
        List<CalendarEvent> existingEvents = calendarEventRepository.findByUserIdAndCategoryOrderByStartTimeAsc(userId, "trainingsplan");
        existingEvents.forEach(event -> calendarEventRepository.deleteById(event.getId()));
        
        // Get all workouts for this plan
        List<Workout> workouts = workoutRepository.findByTrainingPlanIdAndCompletedFalseOrderByDayOfWeekAsc(plan.getId());
        
        // Generate events for current and next week only
        LocalDate today = LocalDate.now();
        LocalDate endOfNextWeek = today.with(TemporalAdjusters.next(DayOfWeek.SUNDAY)).plusWeeks(1);
        
        for (Workout workout : workouts) {
            LocalDate workoutDate = getNextOccurrence(today, workout.getDayOfWeek());
            
            // Create events for both current and next week
            for (int week = 0; week < 2; week++) {
                LocalDate eventDate = workoutDate.plusWeeks(week);
                
                if (!eventDate.isAfter(endOfNextWeek)) {
                    CalendarEvent event = new CalendarEvent();
                    event.setUserId(userId);
                    event.setTitle("🏋️ " + workout.getName());
                    event.setDescription(workout.getDescription());
                    event.setStartTime(eventDate.atTime(9, 0)); // Default 9:00 AM
                    event.setEndTime(eventDate.atTime(9, 0).plusMinutes(workout.getDurationMinutes() != null ? workout.getDurationMinutes() : 60));
                    event.setCategory("trainingsplan");
                    event.setColor("#f59e0b"); // Orange
                    event.setAllDay(false);
                    calendarEventRepository.save(event);
                }
            }
        }
    }
    
    private LocalDate getNextOccurrence(LocalDate from, String dayOfWeek) {
        DayOfWeek targetDay = DayOfWeek.valueOf(dayOfWeek.toUpperCase());
        LocalDate date = from;
        
        // If today is the target day, return today
        if (date.getDayOfWeek() == targetDay) {
            return date;
        }
        
        // Otherwise find next occurrence
        return date.with(TemporalAdjusters.next(targetDay));
    }
}
