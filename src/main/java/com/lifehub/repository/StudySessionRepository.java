package com.lifehub.repository;

import com.lifehub.model.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    
    List<StudySession> findByUserIdOrderByStartTimeDesc(Long userId);
    
    List<StudySession> findByUserIdAndSubjectOrderByStartTimeDesc(Long userId, String subject);
    
    @Query("SELECT s FROM StudySession s WHERE s.userId = :userId " +
           "AND s.startTime BETWEEN :startDate AND :endDate " +
           "ORDER BY s.startTime DESC")
    List<StudySession> findByUserIdAndStartTimeBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT s FROM StudySession s WHERE s.userId = :userId " +
           "AND s.endTime IS NULL " +
           "ORDER BY s.startTime DESC")
    List<StudySession> findActiveStudySessions(Long userId);
    
    @Query("SELECT SUM(s.durationMinutes) FROM StudySession s " +
           "WHERE s.userId = :userId AND s.subject = :subject")
    Long findTotalStudyTimeBySubject(Long userId, String subject);
    
    @Query("SELECT SUM(s.durationMinutes) FROM StudySession s " +
           "WHERE s.userId = :userId " +
           "AND s.startTime BETWEEN :startDate AND :endDate")
    Long findTotalStudyTimeInPeriod(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT s.subject, SUM(s.durationMinutes) " +
           "FROM StudySession s WHERE s.userId = :userId " +
           "GROUP BY s.subject " +
           "ORDER BY SUM(s.durationMinutes) DESC")
    List<Object[]> findStudyTimeBySubject(Long userId);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
