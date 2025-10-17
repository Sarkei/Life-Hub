package com.lifehub.repository;

import com.lifehub.model.SchoolHomework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SchoolHomeworkRepository extends JpaRepository<SchoolHomework, Long> {
    
    List<SchoolHomework> findByUserId(Long userId);
    
    List<SchoolHomework> findByUserIdAndStatus(Long userId, String status);
    
    List<SchoolHomework> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolHomework> findByUserIdOrderByDueDateAsc(Long userId);
    
    List<SchoolHomework> findByUserIdAndDueDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    List<SchoolHomework> findByUserIdAndDueDateBeforeAndStatus(Long userId, LocalDate date, String status);
}
