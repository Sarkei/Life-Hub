package com.lifehub.repository;

import com.lifehub.model.TodoSubtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoSubtaskRepository extends JpaRepository<TodoSubtask, Long> {
    
    List<TodoSubtask> findByTodoIdOrderByPositionAsc(Long todoId);
    
    void deleteByTodoId(Long todoId);
}
