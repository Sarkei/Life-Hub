package com.lifehub.repository;

import com.lifehub.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    // Basic queries
    List<Todo> findByUserId(Long userId);
    List<Todo> findByUserIdAndCategory(Long userId, String category);
    List<Todo> findByUserIdAndStatus(Long userId, Todo.Status status);
    List<Todo> findByUserIdAndCompleted(Long userId, Boolean completed);
    
    // Open todos (not completed)
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.completed = false ORDER BY t.dueDate ASC, t.priority DESC")
    List<Todo> findOpenTodosByUserId(Long userId);
    
    // Open todos with due date
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.completed = false AND t.dueDate IS NOT NULL ORDER BY t.dueDate ASC")
    List<Todo> findOpenTodosWithDueDateByUserId(Long userId);
    
    // Overdue todos
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.completed = false AND t.dueDate < :today ORDER BY t.dueDate ASC")
    List<Todo> findOverdueTodos(Long userId, LocalDate today);
    
    // Due soon (next 7 days)
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.completed = false AND t.dueDate BETWEEN :startDate AND :endDate ORDER BY t.dueDate ASC")
    List<Todo> findDueSoon(Long userId, LocalDate startDate, LocalDate endDate);
    
    // Count by status
    Long countByUserIdAndCompleted(Long userId, Boolean completed);
    Long countByUserIdAndStatus(Long userId, Todo.Status status);
}
