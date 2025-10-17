package com.lifehub.repository;

import com.lifehub.model.SchoolFlashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolFlashcardRepository extends JpaRepository<SchoolFlashcard, Long> {
    
    List<SchoolFlashcard> findByDeckId(Long deckId);
    
    List<SchoolFlashcard> findByDeckIdOrderByOrderIndexAsc(Long deckId);
    
    List<SchoolFlashcard> findByDeckIdAndDifficulty(Long deckId, String difficulty);
    
    long countByDeckId(Long deckId);
}
