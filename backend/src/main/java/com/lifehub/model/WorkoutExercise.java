package com.lifehub.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutExercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long workoutId;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column
    private Integer sets;
    
    @Column
    private Integer reps;
    
    @Column
    private Integer weight; // in kg
    
    @Column
    private Integer durationSeconds;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(nullable = false)
    private Integer position = 0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
