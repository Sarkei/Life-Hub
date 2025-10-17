package com.lifehub.repository;

import com.lifehub.model.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Long> {
    
    List<Absence> findByUserIdOrderByAbsenceDateDesc(Long userId);
    
    List<Absence> findByUserIdAndSubjectOrderByAbsenceDateDesc(Long userId, String subject);
    
    @Query("SELECT a FROM Absence a WHERE a.userId = :userId " +
           "AND a.absenceDate BETWEEN :startDate AND :endDate " +
           "ORDER BY a.absenceDate DESC")
    List<Absence> findByUserIdAndAbsenceDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(a.periods) FROM Absence a " +
           "WHERE a.userId = :userId AND a.absenceType = :type")
    Long countPeriodsByType(Long userId, Absence.AbsenceType type);
    
    @Query("SELECT SUM(a.periods) FROM Absence a WHERE a.userId = :userId")
    Long countTotalPeriods(Long userId);
    
    @Query("SELECT a.subject, SUM(a.periods) " +
           "FROM Absence a WHERE a.userId = :userId " +
           "GROUP BY a.subject " +
           "ORDER BY SUM(a.periods) DESC")
    List<Object[]> findAbsencesBySubject(Long userId);
    
    Long countByUserIdAndExcused(Long userId, Boolean excused);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
