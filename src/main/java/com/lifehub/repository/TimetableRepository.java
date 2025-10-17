package com.lifehub.repository;

import com.lifehub.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    
    List<TimetableEntry> findByUserIdOrderByDayOfWeekAscStartTimeAsc(Long userId);
    
    List<TimetableEntry> findByUserIdAndDayOfWeekOrderByStartTimeAsc(Long userId, DayOfWeek dayOfWeek);
    
    @Query("SELECT t FROM TimetableEntry t WHERE t.userId = :userId " +
           "AND (t.validFrom IS NULL OR t.validFrom <= :date) " +
           "AND (t.validUntil IS NULL OR t.validUntil >= :date) " +
           "ORDER BY t.startTime")
    List<TimetableEntry> findValidEntriesForUserAndDate(Long userId, LocalDate date);
    
    List<TimetableEntry> findByUserIdAndSubject(Long userId, String subject);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
