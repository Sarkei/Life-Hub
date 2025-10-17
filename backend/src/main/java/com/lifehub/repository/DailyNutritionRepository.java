package com.lifehub.repository;

import com.lifehub.model.DailyNutrition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyNutritionRepository extends JpaRepository<DailyNutrition, Long> {
    Optional<DailyNutrition> findByUserIdAndDate(Long userId, LocalDate date);
    
    List<DailyNutrition> findByUserIdOrderByDateDesc(Long userId);
    
    List<DailyNutrition> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT d FROM DailyNutrition d WHERE d.userId = :userId ORDER BY d.date DESC LIMIT 7")
    List<DailyNutrition> findLast7DaysByUserId(Long userId);
    
    @Query("SELECT d FROM DailyNutrition d WHERE d.userId = :userId ORDER BY d.date DESC LIMIT 30")
    List<DailyNutrition> findLast30DaysByUserId(Long userId);
}
