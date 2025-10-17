package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "grades")
public class Grade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "grade_type", length = 50)
    private String gradeType;
    
    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal grade;
    
    @Column
    private Integer points;
    
    @Column(name = "max_points")
    private Integer maxPoints;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;
    
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal weight = BigDecimal.ONE;
    
    @Column(name = "received_date", nullable = false)
    private LocalDate receivedDate;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(length = 100)
    private String teacher;
    
    @Column(length = 20)
    private String semester;
    
    @Column(name = "school_year", length = 20)
    private String schoolYear;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculatePercentage();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculatePercentage();
    }
    
    private void calculatePercentage() {
        if (points != null && maxPoints != null && maxPoints > 0) {
            percentage = BigDecimal.valueOf(points)
                .divide(BigDecimal.valueOf(maxPoints), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        }
    }
}
