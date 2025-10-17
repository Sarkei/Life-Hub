package com.lifehub.controller;

import com.lifehub.model.MealLog;
import com.lifehub.repository.MealLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealLogRepository mealLogRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<MealLog>> getMeals(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        if (date != null) {
            return ResponseEntity.ok(mealLogRepository.findByUserIdAndDate(userId, date));
        } else if (start != null && end != null) {
            return ResponseEntity.ok(mealLogRepository.findByUserIdAndDateBetween(userId, start, end));
        }
        return ResponseEntity.ok(mealLogRepository.findByUserId(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<MealLog> createMeal(
            @PathVariable Long userId,
            @RequestBody MealLog mealRequest) {
        
        mealRequest.setUserId(userId);
        return ResponseEntity.ok(mealLogRepository.save(mealRequest));
    }

    @PutMapping("/{userId}/{id}")
    public ResponseEntity<MealLog> updateMeal(
            @PathVariable Long userId,
            @PathVariable Long id, 
            @RequestBody MealLog mealRequest) {
        
        return mealLogRepository.findById(id)
                .filter(meal -> meal.getUserId().equals(userId))
                .map(meal -> {
                    meal.setMealName(mealRequest.getMealName());
                    meal.setDescription(mealRequest.getDescription());
                    meal.setDate(mealRequest.getDate());
                    meal.setMealType(mealRequest.getMealType());
                    meal.setCalories(mealRequest.getCalories());
                    meal.setProtein(mealRequest.getProtein());
                    meal.setCarbs(mealRequest.getCarbs());
                    meal.setFats(mealRequest.getFats());
                    return ResponseEntity.ok(mealLogRepository.save(meal));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> deleteMeal(
            @PathVariable Long userId,
            @PathVariable Long id) {
        
        return mealLogRepository.findById(id)
                .filter(meal -> meal.getUserId().equals(userId))
                .map(meal -> {
                    mealLogRepository.delete(meal);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
