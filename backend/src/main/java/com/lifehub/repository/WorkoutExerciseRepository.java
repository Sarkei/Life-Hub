package com.lifehub.repository;

import com.lifehub.model.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {
    
    List<WorkoutExercise> findByWorkoutIdOrderByPositionAsc(Long workoutId);
    
    void deleteByWorkoutId(Long workoutId);
}
