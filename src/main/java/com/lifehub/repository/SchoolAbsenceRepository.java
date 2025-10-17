package com.lifehub.repository;

import com.lifehub.model.SchoolAbsence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SchoolAbsenceRepository extends JpaRepository<SchoolAbsence, Long> {
    
    List<SchoolAbsence> findByUserId(Long userId);
    
    List<SchoolAbsence> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolAbsence> findByUserIdAndAbsenceType(Long userId, String absenceType);
    
    List<SchoolAbsence> findByUserIdAndIsExcused(Long userId, Boolean isExcused);
    
    List<SchoolAbsence> findByUserIdOrderByAbsenceDateDesc(Long userId);
    
    List<SchoolAbsence> findByUserIdAndAbsenceDateBetween(Long userId, LocalDate start, LocalDate end);
    
    long countByUserIdAndAbsenceType(Long userId, String absenceType);
}
