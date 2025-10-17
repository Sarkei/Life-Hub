package com.lifehub.repository;

import com.lifehub.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdAndCategory(Long userId, String category);
    List<Note> findByUserId(Long userId);
    List<Note> findByUserIdAndProfileId(Long userId, Long profileId);
}
