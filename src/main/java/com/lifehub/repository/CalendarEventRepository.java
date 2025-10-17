package com.lifehub.repository;

import com.lifehub.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    
    // Basic queries
    List<CalendarEvent> findByUserId(Long userId);
    List<CalendarEvent> findByUserIdAndCategory(Long userId, String category);
    List<CalendarEvent> findByUserIdAndStatus(Long userId, CalendarEvent.EventStatus status);
    
    // Events in date range
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId AND e.startDate BETWEEN :startDate AND :endDate ORDER BY e.startDate, e.startTime")
    List<CalendarEvent> findByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate);
    
    // Upcoming events (next 7 days)
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId AND e.startDate BETWEEN :today AND :endDate AND e.status <> 'CANCELLED' ORDER BY e.startDate, e.startTime")
    List<CalendarEvent> findUpcomingEvents(Long userId, LocalDate today, LocalDate endDate);
    
    // Today's events
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId AND e.startDate = :today AND e.status <> 'CANCELLED' ORDER BY e.startTime")
    List<CalendarEvent> findTodaysEvents(Long userId, LocalDate today);
    
    // Events by related entity
    List<CalendarEvent> findByUserIdAndRelatedEntityTypeAndRelatedEntityId(Long userId, String entityType, Long entityId);
    
    // Count upcoming
    @Query("SELECT COUNT(e) FROM CalendarEvent e WHERE e.userId = :userId AND e.startDate >= :today AND e.status <> 'CANCELLED'")
    Long countUpcomingEvents(Long userId, LocalDate today);
}
