package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "school_subjects", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "name"})
})
public class SchoolSubject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(name = "short_name", length = 10)
    private String shortName;
    
    @Column(length = 100)
    private String teacher;
    
    @Column(length = 50)
    private String room;
    
    @Column(length = 7)
    @Builder.Default
    private String color = "#3B82F6";
    
    @Column(length = 50)
    private String icon;
    
    @Column(name = "hours_per_week", precision = 3, scale = 1)
    private BigDecimal hoursPerWeek;
    
    @Column(name = "credit_points")
    private Integer creditPoints;
    
    @Column
    @Builder.Default
    private Boolean active = true;
    
    @Column(length = 20)
    private String semester;
    
    @Column(name = "target_grade", precision = 3, scale = 2)
    private BigDecimal targetGrade;
    
    @Column(name = "current_average", precision = 3, scale = 2)
    private BigDecimal currentAverage;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
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
