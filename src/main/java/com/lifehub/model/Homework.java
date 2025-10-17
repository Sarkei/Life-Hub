package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "homework")
public class Homework {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private HomeworkStatus status = HomeworkStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority = Priority.MEDIUM;
    
    @Column
    private Boolean completed = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Map<String, String>> attachments;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        updateStatus();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updateStatus();
        if (completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
    
    private void updateStatus() {
        if (completed) {
            status = HomeworkStatus.COMPLETED;
        } else if (dueDate.isBefore(LocalDate.now())) {
            status = HomeworkStatus.OVERDUE;
        }
    }
    
    public enum HomeworkStatus {
        PENDING, IN_PROGRESS, COMPLETED, OVERDUE
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}
