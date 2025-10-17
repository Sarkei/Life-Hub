package com.lifehub.repository;

import com.lifehub.model.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealLogRepository extends JpaRepository<MealLog, Long> {
    List<MealLog> findByProfileId(Long profileId);
    List<MealLog> findByProfileIdAndDate(Long profileId, LocalDate date);
    List<MealLog> findByProfileIdAndDateBetween(Long profileId, LocalDate start, LocalDate end);
}
