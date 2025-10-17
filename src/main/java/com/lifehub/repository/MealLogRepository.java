package com.lifehub.repository;

import com.lifehub.model.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealLogRepository extends JpaRepository<MealLog, Long> {
    List<MealLog> findByUserId(Long userId);
    List<MealLog> findByUserIdAndDate(Long userId, LocalDate date);
    List<MealLog> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
    List<MealLog> findByUserIdOrderByDateDesc(Long userId);
}
