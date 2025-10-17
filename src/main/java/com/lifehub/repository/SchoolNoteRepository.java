package com.lifehub.repository;

import com.lifehub.model.SchoolNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolNoteRepository extends JpaRepository<SchoolNote, Long> {
    
    List<SchoolNote> findByUserId(Long userId);
    
    List<SchoolNote> findByUserIdAndFolderId(Long userId, Long folderId);
    
    List<SchoolNote> findByUserIdAndFolderIdIsNull(Long userId); // Notes without folder
    
    List<SchoolNote> findByUserIdAndIsFavorite(Long userId, Boolean isFavorite);
    
    List<SchoolNote> findByUserIdOrderByUpdatedAtDesc(Long userId);
    
    Optional<SchoolNote> findByUserIdAndId(Long userId, Long id);
    
    List<SchoolNote> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);
}
