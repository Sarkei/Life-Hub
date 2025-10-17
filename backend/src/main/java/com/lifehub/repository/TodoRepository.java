package com.lifehub.repository;

import com.lifehub.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByUserIdAndArchivedOrderByPositionAsc(Long userId, Boolean archived);
    
    List<Todo> findByUserIdAndStatusAndArchivedOrderByPositionAsc(Long userId, String status, Boolean archived);
    
    List<Todo> findByUserIdAndCategoryAndArchivedOrderByPositionAsc(Long userId, String category, Boolean archived);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.archived = false AND t.dueDate BETWEEN :start AND :end ORDER BY t.dueDate ASC")
    List<Todo> findUpcomingTodos(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.archived = false AND t.dueDate < :now AND t.status != 'done' ORDER BY t.dueDate ASC")
    List<Todo> findOverdueTodos(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(t) FROM Todo t WHERE t.userId = :userId AND t.status = :status AND t.archived = false")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
    
    @Query("SELECT t FROM Todo t WHERE t.userId = :userId AND t.archived = false AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Todo> searchTodos(@Param("userId") Long userId, @Param("search") String search);
}
