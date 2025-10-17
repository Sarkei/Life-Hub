package com.lifehub.repository;

import com.lifehub.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    
    List<CalendarEvent> findByUserIdOrderByStartTimeAsc(Long userId);
    
    List<CalendarEvent> findByUserIdAndCategoryOrderByStartTimeAsc(Long userId, String category);
    
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId " +
           "AND e.startTime >= :start AND e.startTime <= :end " +
           "ORDER BY e.startTime ASC")
    List<CalendarEvent> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
    
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId " +
           "AND e.category = :category " +
           "AND e.startTime >= :start AND e.startTime <= :end " +
           "ORDER BY e.startTime ASC")
    List<CalendarEvent> findByUserIdAndCategoryAndDateRange(
        @Param("userId") Long userId,
        @Param("category") String category,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
    
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId " +
           "AND e.startTime >= :now " +
           "ORDER BY e.startTime ASC")
    List<CalendarEvent> findUpcomingEvents(
        @Param("userId") Long userId,
        @Param("now") LocalDateTime now
    );
}
