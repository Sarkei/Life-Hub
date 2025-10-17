package com.lifehub.repository;

import com.lifehub.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    
    List<Workout> findByTrainingPlanIdOrderByDayOfWeekAsc(Long trainingPlanId);
    
    List<Workout> findByTrainingPlanIdAndCompletedFalseOrderByDayOfWeekAsc(Long trainingPlanId);
    
    List<Workout> findByTrainingPlanIdAndCompletedTrueOrderByCompletedAtDesc(Long trainingPlanId);
    
    @Query("SELECT w FROM Workout w WHERE w.trainingPlanId = :planId AND w.dayOfWeek = :day")
    List<Workout> findByTrainingPlanIdAndDay(@Param("planId") Long planId, @Param("day") String day);
    
    @Query("SELECT w FROM Workout w WHERE w.trainingPlanId = :planId AND w.completed = true AND w.completedAt BETWEEN :start AND :end")
    List<Workout> findCompletedInDateRange(@Param("planId") Long planId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
