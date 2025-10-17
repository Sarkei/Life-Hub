package com.lifehub.repository;

import com.lifehub.model.SchoolProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolProjectRepository extends JpaRepository<SchoolProject, Long> {
    
    List<SchoolProject> findByUserId(Long userId);
    
    List<SchoolProject> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolProject> findByUserIdAndStatus(Long userId, SchoolProject.ProjectStatus status);
    
    List<SchoolProject> findByUserIdOrderByDueDateAsc(Long userId);
    
    Optional<SchoolProject> findByUserIdAndId(Long userId, Long id);
}
