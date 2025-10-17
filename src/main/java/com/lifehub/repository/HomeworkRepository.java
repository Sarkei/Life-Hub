package com.lifehub.repository;

import com.lifehub.model.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    
    List<Homework> findByUserIdOrderByDueDateAsc(Long userId);
    
    List<Homework> findByUserIdAndCompletedOrderByDueDateAsc(Long userId, Boolean completed);
    
    List<Homework> findByUserIdAndStatusOrderByDueDateAsc(Long userId, Homework.HomeworkStatus status);
    
    List<Homework> findByUserIdAndSubjectOrderByDueDateAsc(Long userId, String subject);
    
    @Query("SELECT h FROM Homework h WHERE h.userId = :userId " +
           "AND h.dueDate BETWEEN :startDate AND :endDate " +
           "ORDER BY h.dueDate, h.priority DESC")
    List<Homework> findByUserIdAndDueDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT h FROM Homework h WHERE h.userId = :userId " +
           "AND h.completed = false AND h.dueDate < :today " +
           "ORDER BY h.dueDate")
    List<Homework> findOverdueHomework(Long userId, LocalDate today);
    
    @Query("SELECT h FROM Homework h WHERE h.userId = :userId " +
           "AND h.completed = false AND h.dueDate >= :today " +
           "ORDER BY h.dueDate, h.priority DESC")
    List<Homework> findUpcomingHomework(Long userId, LocalDate today);
    
    Long countByUserIdAndCompleted(Long userId, Boolean completed);
    
    void deleteByUserIdAndId(Long userId, Long id);
}
