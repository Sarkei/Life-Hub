package com.lifehub.repository;

import com.lifehub.model.SchoolStudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SchoolStudySessionRepository extends JpaRepository<SchoolStudySession, Long> {
    
    List<SchoolStudySession> findByUserId(Long userId);
    
    List<SchoolStudySession> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolStudySession> findByUserIdOrderByStartTimeDesc(Long userId);
    
    List<SchoolStudySession> findByUserIdAndStartTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(s.durationMinutes) FROM SchoolStudySession s WHERE s.userId = :userId AND s.subjectId = :subjectId")
    Long getTotalStudyTimeBySubject(Long userId, Long subjectId);
    
    @Query("SELECT SUM(s.durationMinutes) FROM SchoolStudySession s WHERE s.userId = :userId")
    Long getTotalStudyTime(Long userId);
}
