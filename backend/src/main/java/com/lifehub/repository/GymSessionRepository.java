package com.lifehub.repository;

import com.lifehub.model.GymSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GymSessionRepository extends JpaRepository<GymSession, Long> {
    List<GymSession> findByUserIdOrderByStartTimeDesc(Long userId);
    
    List<GymSession> findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(
            Long userId, LocalDateTime startTime, LocalDateTime endTime);
    
    Optional<GymSession> findFirstByUserIdAndEndTimeIsNullOrderByStartTimeDesc(Long userId);
    
    @Query("SELECT g FROM GymSession g WHERE g.userId = :userId ORDER BY g.startTime DESC LIMIT 10")
    List<GymSession> findLast10SessionsByUserId(Long userId);
    
    long countByUserId(Long userId);
}
