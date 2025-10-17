package com.lifehub.controller;

import com.lifehub.model.MealLog;
import com.lifehub.repository.MealLogRepository;
import com.lifehub.repository.ProfileRepository;
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
    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<MealLog>> getMeals(
            @RequestParam Long profileId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        if (date != null) {
            return ResponseEntity.ok(mealLogRepository.findByProfileIdAndDate(profileId, date));
        } else if (start != null && end != null) {
            return ResponseEntity.ok(mealLogRepository.findByProfileIdAndDateBetween(profileId, start, end));
        }
        return ResponseEntity.ok(mealLogRepository.findByProfileId(profileId));
    }

    @PostMapping
    public ResponseEntity<MealLog> createMeal(@RequestBody MealLog mealRequest) {
        var profile = profileRepository.findById(mealRequest.getProfile().getId()).orElseThrow();
        
        MealLog meal = MealLog.builder()
                .profile(profile)
                .mealName(mealRequest.getMealName())
                .description(mealRequest.getDescription())
                .date(mealRequest.getDate())
                .mealType(mealRequest.getMealType())
                .calories(mealRequest.getCalories())
                .protein(mealRequest.getProtein())
                .carbs(mealRequest.getCarbs())
                .fats(mealRequest.getFats())
                .build();
        
        return ResponseEntity.ok(mealLogRepository.save(meal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealLog> updateMeal(@PathVariable Long id, @RequestBody MealLog mealRequest) {
        var meal = mealLogRepository.findById(id).orElseThrow();
        
        meal.setMealName(mealRequest.getMealName());
        meal.setDescription(mealRequest.getDescription());
        meal.setDate(mealRequest.getDate());
        meal.setMealType(mealRequest.getMealType());
        meal.setCalories(mealRequest.getCalories());
        meal.setProtein(mealRequest.getProtein());
        meal.setCarbs(mealRequest.getCarbs());
        meal.setFats(mealRequest.getFats());
        
        return ResponseEntity.ok(mealLogRepository.save(meal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
