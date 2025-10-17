package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "study_sessions")
public class StudySession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column
    private String topic;
    
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> methods;
    
    @Column(name = "effectiveness_rating")
    private Integer effectivenessRating;
    
    @Column(name = "focus_level")
    private Integer focusLevel;
    
    @Column(name = "goal_achieved")
    private Boolean goalAchieved = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateDuration();
    }
    
    @PreUpdate
    protected void onUpdate() {
        calculateDuration();
    }
    
    private void calculateDuration() {
        if (startTime != null && endTime != null) {
            durationMinutes = (int) ChronoUnit.MINUTES.between(startTime, endTime);
        }
    }
}
