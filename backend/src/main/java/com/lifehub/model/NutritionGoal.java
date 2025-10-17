package com.lifehub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nutrition_goals")
public class NutritionGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private Double currentWeight; // in kg

    @Column(nullable = false)
    private Integer height; // in cm

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GoalType goalType;

    @Column(nullable = false)
    private Integer dailyCalories; // calculated based on BMR, TDEE, and goal

    private Integer proteinGrams;
    private Integer carbsGrams;
    private Integer fatGrams;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enums
    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum ActivityLevel {
        SEDENTARY,      // 1.2 - Wenig bis keine Bewegung
        LIGHT,          // 1.375 - Leichte Aktivität 1-3 Tage/Woche
        MODERATE,       // 1.55 - Moderate Aktivität 3-5 Tage/Woche
        VERY_ACTIVE,    // 1.725 - Intensive Aktivität 6-7 Tage/Woche
        EXTREMELY_ACTIVE // 1.9 - Sehr intensive Aktivität + körperliche Arbeit
    }

    public enum GoalType {
        LOSE_WEIGHT,    // Abnehmen (-500 kcal)
        MAINTAIN,       // Halten (TDEE)
        GAIN_WEIGHT     // Zunehmen (+500 kcal)
    }

    // Constructors
    public NutritionGoal() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public GoalType getGoalType() {
        return goalType;
    }

    public void setGoalType(GoalType goalType) {
        this.goalType = goalType;
    }

    public Integer getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(Integer dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public Integer getProteinGrams() {
        return proteinGrams;
    }

    public void setProteinGrams(Integer proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public Integer getCarbsGrams() {
        return carbsGrams;
    }

    public void setCarbsGrams(Integer carbsGrams) {
        this.carbsGrams = carbsGrams;
    }

    public Integer getFatGrams() {
        return fatGrams;
    }

    public void setFatGrams(Integer fatGrams) {
        this.fatGrams = fatGrams;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper method to get activity multiplier
    public double getActivityMultiplier() {
        return switch (activityLevel) {
            case SEDENTARY -> 1.2;
            case LIGHT -> 1.375;
            case MODERATE -> 1.55;
            case VERY_ACTIVE -> 1.725;
            case EXTREMELY_ACTIVE -> 1.9;
        };
    }

    // Helper method to get goal adjustment
    public int getGoalAdjustment() {
        return switch (goalType) {
            case LOSE_WEIGHT -> -500;
            case MAINTAIN -> 0;
            case GAIN_WEIGHT -> 500;
        };
    }
}
