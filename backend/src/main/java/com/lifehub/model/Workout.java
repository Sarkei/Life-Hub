package com.lifehub.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Workout {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long trainingPlanId;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String dayOfWeek; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    
    @Column(length = 100)
    private String type; // e.g., "Krafttraining", "Cardio", "Stretching"
    
    @Column
    private Integer durationMinutes;
    
    @Column
    private Integer caloriesBurned;
    
    @Column(nullable = false)
    private Boolean completed = false;
    
    @Column
    private LocalDateTime completedAt;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
