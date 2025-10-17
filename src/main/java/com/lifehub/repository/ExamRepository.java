package com.lifehub.repository;

import com.lifehub.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    
    List<Exam> findByUserIdOrderByExamDateDesc(Long userId);
    
    List<Exam> findByUserIdAndSubjectOrderByExamDateDesc(Long userId, String subject);
    
    @Query("SELECT e FROM Exam e WHERE e.userId = :userId " +
           "AND e.examDate BETWEEN :startDate AND :endDate " +
           "ORDER BY e.examDate, e.startTime")
    List<Exam> findByUserIdAndExamDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT e FROM Exam e WHERE e.userId = :userId " +
           "AND e.examDate >= :today " +
           "ORDER BY e.examDate, e.startTime")
    List<Exam> findUpcomingExams(Long userId, LocalDate today);
    
    @Query("SELECT e FROM Exam e WHERE e.userId = :userId " +
           "AND e.examDate < :today " +
           "ORDER BY e.examDate DESC")
    List<Exam> findPastExams(Long userId, LocalDate today);
    
    @Query("SELECT e FROM Exam e WHERE e.userId = :userId " +
           "AND e.grade IS NOT NULL " +
           "ORDER BY e.examDate DESC")
    List<Exam> findGradedExams(Long userId);
    
    @Query("SELECT AVG(e.grade) FROM Exam e WHERE e.userId = :userId " +
           "AND e.subject = :subject AND e.grade IS NOT NULL")
    BigDecimal findAverageGradeBySubject(Long userId, String subject);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
