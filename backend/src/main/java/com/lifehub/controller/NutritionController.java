package com.lifehub.controller;

import com.lifehub.model.NutritionGoal;
import com.lifehub.model.DailyNutrition;
import com.lifehub.repository.NutritionGoalRepository;
import com.lifehub.repository.DailyNutritionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/nutrition")
@CrossOrigin(origins = "http://localhost:5173")
public class NutritionController {

    @Autowired
    private NutritionGoalRepository nutritionGoalRepository;

    @Autowired
    private DailyNutritionRepository dailyNutritionRepository;

    // ========== Nutrition Goals ==========

    @GetMapping("/goal")
    public ResponseEntity<?> getGoal(@RequestParam Long userId) {
        Optional<NutritionGoal> goal = nutritionGoalRepository.findByUserId(userId);
        return goal.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/goal")
    public ResponseEntity<?> createOrUpdateGoal(@RequestBody NutritionGoal goal) {
        try {
            // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
            double bmr;
            if (goal.getGender() == NutritionGoal.Gender.MALE) {
                bmr = (10 * goal.getCurrentWeight()) + (6.25 * goal.getHeight()) - (5 * goal.getAge()) + 5;
            } else {
                bmr = (10 * goal.getCurrentWeight()) + (6.25 * goal.getHeight()) - (5 * goal.getAge()) - 161;
            }

            // Calculate TDEE (Total Daily Energy Expenditure)
            double tdee = bmr * goal.getActivityMultiplier();

            // Apply goal adjustment
            int dailyCalories = (int) Math.round(tdee + goal.getGoalAdjustment());
            goal.setDailyCalories(dailyCalories);

            // Calculate macros (if not provided)
            if (goal.getProteinGrams() == null || goal.getCarbsGrams() == null || goal.getFatGrams() == null) {
                // Standard macro split: 30% protein, 40% carbs, 30% fat
                int proteinCalories = (int) (dailyCalories * 0.30);
                int carbsCalories = (int) (dailyCalories * 0.40);
                int fatCalories = (int) (dailyCalories * 0.30);

                goal.setProteinGrams(proteinCalories / 4); // 4 calories per gram
                goal.setCarbsGrams(carbsCalories / 4);     // 4 calories per gram
                goal.setFatGrams(fatCalories / 9);         // 9 calories per gram
            }

            // Check if goal already exists
            Optional<NutritionGoal> existing = nutritionGoalRepository.findByUserId(goal.getUserId());
            if (existing.isPresent()) {
                NutritionGoal existingGoal = existing.get();
                existingGoal.setCurrentWeight(goal.getCurrentWeight());
                existingGoal.setHeight(goal.getHeight());
                existingGoal.setAge(goal.getAge());
                existingGoal.setGender(goal.getGender());
                existingGoal.setActivityLevel(goal.getActivityLevel());
                existingGoal.setGoalType(goal.getGoalType());
                existingGoal.setDailyCalories(goal.getDailyCalories());
                existingGoal.setProteinGrams(goal.getProteinGrams());
                existingGoal.setCarbsGrams(goal.getCarbsGrams());
                existingGoal.setFatGrams(goal.getFatGrams());
                
                NutritionGoal saved = nutritionGoalRepository.save(existingGoal);
                return ResponseEntity.ok(saved);
            } else {
                NutritionGoal saved = nutritionGoalRepository.save(goal);
                return ResponseEntity.ok(saved);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving nutrition goal: " + e.getMessage());
        }
    }

    @DeleteMapping("/goal/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        try {
            if (!nutritionGoalRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            nutritionGoalRepository.deleteById(id);
            return ResponseEntity.ok().body("Nutrition goal deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting nutrition goal: " + e.getMessage());
        }
    }

    // ========== Daily Nutrition ==========

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyNutrition(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Optional<DailyNutrition> nutrition = dailyNutritionRepository.findByUserIdAndDate(userId, date);
        return nutrition.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/daily/today")
    public ResponseEntity<?> getTodayNutrition(@RequestParam Long userId) {
        Optional<DailyNutrition> nutrition = dailyNutritionRepository.findByUserIdAndDate(userId, LocalDate.now());
        
        if (nutrition.isPresent()) {
            return ResponseEntity.ok(nutrition.get());
        } else {
            // Return empty nutrition with today's date
            DailyNutrition empty = new DailyNutrition(userId, LocalDate.now(), 0);
            empty.setProtein(0);
            empty.setCarbs(0);
            empty.setFat(0);
            return ResponseEntity.ok(empty);
        }
    }

    @GetMapping("/daily/history")
    public ResponseEntity<List<DailyNutrition>> getNutritionHistory(@RequestParam Long userId) {
        List<DailyNutrition> history = dailyNutritionRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/daily/recent")
    public ResponseEntity<List<DailyNutrition>> getRecentNutrition(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "7") int days) {
        List<DailyNutrition> recent;
        if (days <= 7) {
            recent = dailyNutritionRepository.findLast7DaysByUserId(userId);
        } else {
            recent = dailyNutritionRepository.findLast30DaysByUserId(userId);
        }
        return ResponseEntity.ok(recent);
    }

    @GetMapping("/daily/range")
    public ResponseEntity<List<DailyNutrition>> getNutritionByDateRange(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DailyNutrition> nutrition = dailyNutritionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        return ResponseEntity.ok(nutrition);
    }

    @PostMapping("/daily")
    public ResponseEntity<?> addDailyNutrition(@RequestBody DailyNutrition nutrition) {
        try {
            // Validate calories
            if (nutrition.getCalories() == null || nutrition.getCalories() < 0) {
                return ResponseEntity.badRequest().body("Invalid calorie value");
            }

            // Set date to today if not provided
            if (nutrition.getDate() == null) {
                nutrition.setDate(LocalDate.now());
            }

            // Check if entry already exists
            Optional<DailyNutrition> existing = dailyNutritionRepository.findByUserIdAndDate(
                    nutrition.getUserId(), nutrition.getDate());
            
            if (existing.isPresent()) {
                // Update existing entry
                DailyNutrition existingNutrition = existing.get();
                existingNutrition.setCalories(nutrition.getCalories());
                existingNutrition.setProtein(nutrition.getProtein());
                existingNutrition.setCarbs(nutrition.getCarbs());
                existingNutrition.setFat(nutrition.getFat());
                existingNutrition.setNotes(nutrition.getNotes());
                
                DailyNutrition saved = dailyNutritionRepository.save(existingNutrition);
                return ResponseEntity.ok(saved);
            } else {
                DailyNutrition saved = dailyNutritionRepository.save(nutrition);
                return ResponseEntity.ok(saved);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving daily nutrition: " + e.getMessage());
        }
    }

    @PutMapping("/daily/{id}")
    public ResponseEntity<?> updateDailyNutrition(@PathVariable Long id, @RequestBody DailyNutrition nutritionDetails) {
        try {
            Optional<DailyNutrition> nutritionOptional = dailyNutritionRepository.findById(id);
            
            if (nutritionOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            DailyNutrition nutrition = nutritionOptional.get();
            
            if (nutritionDetails.getCalories() != null) {
                nutrition.setCalories(nutritionDetails.getCalories());
            }
            if (nutritionDetails.getProtein() != null) {
                nutrition.setProtein(nutritionDetails.getProtein());
            }
            if (nutritionDetails.getCarbs() != null) {
                nutrition.setCarbs(nutritionDetails.getCarbs());
            }
            if (nutritionDetails.getFat() != null) {
                nutrition.setFat(nutritionDetails.getFat());
            }
            if (nutritionDetails.getNotes() != null) {
                nutrition.setNotes(nutritionDetails.getNotes());
            }

            DailyNutrition updated = dailyNutritionRepository.save(nutrition);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating daily nutrition: " + e.getMessage());
        }
    }

    @DeleteMapping("/daily/{id}")
    public ResponseEntity<?> deleteDailyNutrition(@PathVariable Long id) {
        try {
            if (!dailyNutritionRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            dailyNutritionRepository.deleteById(id);
            return ResponseEntity.ok().body("Daily nutrition deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting daily nutrition: " + e.getMessage());
        }
    }

    // ========== Statistics ==========

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getNutritionStats(@RequestParam Long userId) {
        Map<String, Object> stats = new HashMap<>();

        // Get goal
        Optional<NutritionGoal> goalOpt = nutritionGoalRepository.findByUserId(userId);
        if (goalOpt.isEmpty()) {
            return ResponseEntity.ok(stats);
        }

        NutritionGoal goal = goalOpt.get();
        stats.put("goal", goal);

        // Get today's nutrition
        Optional<DailyNutrition> todayOpt = dailyNutritionRepository.findByUserIdAndDate(userId, LocalDate.now());
        if (todayOpt.isPresent()) {
            DailyNutrition today = todayOpt.get();
            stats.put("today", today);
            stats.put("remainingCalories", goal.getDailyCalories() - today.getCalories());
            stats.put("calorieProgress", (double) today.getCalories() / goal.getDailyCalories() * 100);
        } else {
            stats.put("remainingCalories", goal.getDailyCalories());
            stats.put("calorieProgress", 0);
        }

        // Get 7-day average
        List<DailyNutrition> last7Days = dailyNutritionRepository.findLast7DaysByUserId(userId);
        if (!last7Days.isEmpty()) {
            double avgCalories = last7Days.stream()
                    .mapToInt(DailyNutrition::getCalories)
                    .average()
                    .orElse(0);
            stats.put("weeklyAverage", Math.round(avgCalories));
        }

        // Get 30-day stats
        List<DailyNutrition> last30Days = dailyNutritionRepository.findLast30DaysByUserId(userId);
        if (!last30Days.isEmpty()) {
            double avgCalories = last30Days.stream()
                    .mapToInt(DailyNutrition::getCalories)
                    .average()
                    .orElse(0);
            stats.put("monthlyAverage", Math.round(avgCalories));
            stats.put("daysTracked", last30Days.size());
        }

        return ResponseEntity.ok(stats);
    }
}
