package com.lifehub.repository;

import com.lifehub.model.Weight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeightRepository extends JpaRepository<Weight, Long> {
    List<Weight> findByUserIdOrderByDateDesc(Long userId);
    
    List<Weight> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);
    
    Optional<Weight> findByUserIdAndDate(Long userId, LocalDate date);
    
    Optional<Weight> findFirstByUserIdOrderByDateDesc(Long userId);
    
    @Query("SELECT w FROM Weight w WHERE w.userId = :userId ORDER BY w.date DESC LIMIT 30")
    List<Weight> findLast30DaysByUserId(Long userId);
    
    long countByUserId(Long userId);
}
