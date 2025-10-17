package com.lifehub.repository;

import com.lifehub.model.SchoolNoteFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolNoteFolderRepository extends JpaRepository<SchoolNoteFolder, Long> {
    
    List<SchoolNoteFolder> findByUserId(Long userId);
    
    List<SchoolNoteFolder> findByUserIdAndParentFolderId(Long userId, Long parentFolderId);
    
    List<SchoolNoteFolder> findByUserIdAndParentFolderIdIsNull(Long userId); // Root folders
    
    Optional<SchoolNoteFolder> findByUserIdAndId(Long userId, Long id);
    
    boolean existsByUserIdAndNameAndParentFolderId(Long userId, String name, Long parentFolderId);
}
