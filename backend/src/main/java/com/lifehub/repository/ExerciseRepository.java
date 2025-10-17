package com.lifehub.repository;

import com.lifehub.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByIsCustomFalse(); // Predefined exercises
    List<Exercise> findByUserIdOrderByNameAsc(Long userId); // User's custom exercises
    List<Exercise> findByIsCustomFalseOrUserId(Long userId); // All available exercises for user
    List<Exercise> findByCategory(Exercise.Category category);
    List<Exercise> findByMuscleGroup(Exercise.MuscleGroup muscleGroup);
}
