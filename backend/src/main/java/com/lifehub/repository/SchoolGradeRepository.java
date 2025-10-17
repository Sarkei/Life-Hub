package com.lifehub.repository;

import com.lifehub.model.SchoolGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SchoolGradeRepository extends JpaRepository<SchoolGrade, Long> {
    
    List<SchoolGrade> findByUserId(Long userId);
    
    List<SchoolGrade> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolGrade> findByUserIdAndSemester(Long userId, String semester);
    
    List<SchoolGrade> findByUserIdAndGradeType(Long userId, String gradeType);
    
    List<SchoolGrade> findByUserIdOrderByReceivedDateDesc(Long userId);
    
    // Durchschnitt berechnen (gewichtet)
    @Query("SELECT AVG(g.gradeValue * g.weight) FROM SchoolGrade g WHERE g.userId = :userId AND g.subjectId = :subjectId")
    BigDecimal calculateWeightedAverageBySubject(Long userId, Long subjectId);
    
    @Query("SELECT AVG(g.gradeValue) FROM SchoolGrade g WHERE g.userId = :userId")
    BigDecimal calculateOverallAverage(Long userId);
}
