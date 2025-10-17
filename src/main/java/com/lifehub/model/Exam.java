package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exams")
public class Exam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "exam_type", length = 50)
    private String examType;
    
    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;
    
    @Column(name = "start_time")
    private LocalTime startTime;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(length = 50)
    private String room;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> topics;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal grade;
    
    @Column
    private Integer points;
    
    @Column(name = "max_points")
    private Integer maxPoints;
    
    @Column(name = "study_time_minutes")
    private Integer studyTimeMinutes = 0;
    
    @Column(name = "confidence_level")
    private Integer confidenceLevel;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
