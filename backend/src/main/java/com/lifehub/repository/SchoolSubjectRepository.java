package com.lifehub.repository;

import com.lifehub.model.SchoolSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolSubjectRepository extends JpaRepository<SchoolSubject, Long> {
    
    List<SchoolSubject> findByUserIdOrderByNameAsc(Long userId);
    
    List<SchoolSubject> findByUserIdAndActiveOrderByNameAsc(Long userId, Boolean active);
    
    List<SchoolSubject> findByUserIdAndSemesterOrderByNameAsc(Long userId, String semester);
    
    Optional<SchoolSubject> findByUserIdAndName(Long userId, String name);
    
    Optional<SchoolSubject> findByUserIdAndId(Long userId, Long id);
    
    boolean existsByUserIdAndName(Long userId, String name);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
