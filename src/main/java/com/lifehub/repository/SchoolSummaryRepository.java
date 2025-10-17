package com.lifehub.repository;

import com.lifehub.model.SchoolSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolSummaryRepository extends JpaRepository<SchoolSummary, Long> {
    
    List<SchoolSummary> findByUserId(Long userId);
    
    List<SchoolSummary> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolSummary> findByUserIdAndIsFavorite(Long userId, Boolean isFavorite);
    
    List<SchoolSummary> findByUserIdOrderByUpdatedAtDesc(Long userId);
    
    List<SchoolSummary> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);
}
