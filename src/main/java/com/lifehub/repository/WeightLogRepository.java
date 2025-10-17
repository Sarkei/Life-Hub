package com.lifehub.repository;

import com.lifehub.model.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WeightLogRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findByUserId(Long userId);
    List<WeightLog> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
    List<WeightLog> findByUserIdOrderByDateDesc(Long userId);
}
