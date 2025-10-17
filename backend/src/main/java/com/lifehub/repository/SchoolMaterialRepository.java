package com.lifehub.repository;

import com.lifehub.model.SchoolMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolMaterialRepository extends JpaRepository<SchoolMaterial, Long> {
    
    List<SchoolMaterial> findByUserId(Long userId);
    
    List<SchoolMaterial> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolMaterial> findByUserIdAndIsFavorite(Long userId, Boolean isFavorite);
    
    List<SchoolMaterial> findByUserIdOrderByUploadedAtDesc(Long userId);
    
    Optional<SchoolMaterial> findByUserIdAndId(Long userId, Long id);
}
