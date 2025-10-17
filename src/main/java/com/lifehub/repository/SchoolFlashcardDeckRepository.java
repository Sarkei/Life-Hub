package com.lifehub.repository;

import com.lifehub.model.SchoolFlashcardDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolFlashcardDeckRepository extends JpaRepository<SchoolFlashcardDeck, Long> {
    
    List<SchoolFlashcardDeck> findByUserId(Long userId);
    
    List<SchoolFlashcardDeck> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolFlashcardDeck> findByUserIdAndIsFavorite(Long userId, Boolean isFavorite);
    
    List<SchoolFlashcardDeck> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
