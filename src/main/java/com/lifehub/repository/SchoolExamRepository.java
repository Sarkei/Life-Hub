package com.lifehub.repository;

import com.lifehub.model.SchoolExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SchoolExamRepository extends JpaRepository<SchoolExam, Long> {
    
    List<SchoolExam> findByUserId(Long userId);
    
    List<SchoolExam> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolExam> findByUserIdOrderByExamDateAsc(Long userId);
    
    List<SchoolExam> findByUserIdAndExamDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<SchoolExam> findByUserIdAndExamDateAfter(Long userId, LocalDate date);
    
    List<SchoolExam> findByUserIdAndIsGraded(Long userId, Boolean isGraded);
}
