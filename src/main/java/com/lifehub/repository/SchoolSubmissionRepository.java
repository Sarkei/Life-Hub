package com.lifehub.repository;

import com.lifehub.model.SchoolSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolSubmissionRepository extends JpaRepository<SchoolSubmission, Long> {
    
    List<SchoolSubmission> findByUserId(Long userId);
    
    List<SchoolSubmission> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolSubmission> findByUserIdAndStatus(Long userId, SchoolSubmission.SubmissionStatus status);
    
    List<SchoolSubmission> findByUserIdAndDueDateBetween(Long userId, LocalDate start, LocalDate end);
    
    List<SchoolSubmission> findByUserIdOrderByDueDateAsc(Long userId);
    
    Optional<SchoolSubmission> findByUserIdAndId(Long userId, Long id);
}
