package com.lifehub.repository;

import com.lifehub.model.TodoComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoCommentRepository extends JpaRepository<TodoComment, Long> {
    
    List<TodoComment> findByTodoIdOrderByCreatedAtDesc(Long todoId);
    
    void deleteByTodoId(Long todoId);
}
