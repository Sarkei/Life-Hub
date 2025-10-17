package com.lifehub.repository;

import com.lifehub.model.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Long> {
    List<ExerciseLog> findByGymSessionId(Long gymSessionId);
    
    @Query("SELECT el FROM ExerciseLog el WHERE el.exercise.id = :exerciseId " +
           "AND el.gymSession.userId = :userId ORDER BY el.createdAt DESC")
    List<ExerciseLog> findByExerciseIdAndUserId(Long exerciseId, Long userId);
    
    @Query("SELECT el FROM ExerciseLog el WHERE el.exercise.id = :exerciseId " +
           "AND el.gymSession.userId = :userId ORDER BY el.createdAt DESC LIMIT 20")
    List<ExerciseLog> findLast20LogsByExerciseAndUser(Long exerciseId, Long userId);
}
