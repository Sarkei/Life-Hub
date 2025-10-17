package com.lifehub.repository;

import com.lifehub.model.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByProfileId(Long profileId);
    List<WorkoutLog> findByProfileIdAndWorkoutDateBetween(Long profileId, LocalDateTime start, LocalDateTime end);
}
