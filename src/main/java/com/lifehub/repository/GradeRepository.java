package com.lifehub.repository;

import com.lifehub.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    
    List<Grade> findByUserIdOrderByReceivedDateDesc(Long userId);
    
    List<Grade> findByUserIdAndSubjectOrderByReceivedDateDesc(Long userId, String subject);
    
    List<Grade> findByUserIdAndSemesterOrderByReceivedDateDesc(Long userId, String semester);
    
    List<Grade> findByUserIdAndSchoolYearOrderBySubjectAscReceivedDateDesc(Long userId, String schoolYear);
    
    @Query("SELECT g FROM Grade g WHERE g.userId = :userId " +
           "AND g.receivedDate BETWEEN :startDate AND :endDate " +
           "ORDER BY g.receivedDate DESC")
    List<Grade> findByUserIdAndReceivedDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT g.subject, AVG(g.grade * g.weight) / AVG(g.weight) as weightedAverage " +
           "FROM Grade g WHERE g.userId = :userId " +
           "GROUP BY g.subject " +
           "ORDER BY g.subject")
    List<Object[]> findWeightedAverageBySubject(Long userId);
    
    @Query("SELECT g.subject, AVG(g.grade * g.weight) / AVG(g.weight) as weightedAverage " +
           "FROM Grade g WHERE g.userId = :userId AND g.semester = :semester " +
           "GROUP BY g.subject " +
           "ORDER BY g.subject")
    List<Object[]> findWeightedAverageBySubjectAndSemester(Long userId, String semester);
    
    @Query("SELECT AVG(g.grade * g.weight) / AVG(g.weight) " +
           "FROM Grade g WHERE g.userId = :userId AND g.subject = :subject")
    BigDecimal findWeightedAverageByUserIdAndSubject(Long userId, String subject);
    
    @Query("SELECT COUNT(g), AVG(g.grade), MIN(g.grade), MAX(g.grade) " +
           "FROM Grade g WHERE g.userId = :userId AND g.subject = :subject")
    List<Object[]> findStatisticsBySubject(Long userId, String subject);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
