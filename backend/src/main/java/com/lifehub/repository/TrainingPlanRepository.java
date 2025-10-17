package com.lifehub.repository;

import com.lifehub.model.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {
    
    List<TrainingPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<TrainingPlan> findByUserIdAndActiveTrue(Long userId);
    
    @Query("SELECT COUNT(t) FROM TrainingPlan t WHERE t.userId = :userId AND t.active = true")
    Long countActiveByUserId(@Param("userId") Long userId);
}
