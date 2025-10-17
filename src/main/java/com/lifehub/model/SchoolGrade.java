package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "school_grades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SchoolGrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "exam_id")
    private Long examId;

    @Column(name = "grade_value", nullable = false, precision = 3, scale = 2)
    private BigDecimal gradeValue; // 1.0 - 6.0

    @Column(name = "grade_type", length = 50)
    private String gradeType; // exam, oral, homework, project, final

    @Builder.Default
    @Column(precision = 3, scale = 2)
    private BigDecimal weight = new BigDecimal("1.0"); // Gewichtung für Durchschnitt

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "max_points", precision = 6, scale = 2)
    private BigDecimal maxPoints;

    @Column(name = "achieved_points", precision = 6, scale = 2)
    private BigDecimal achievedPoints;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(length = 50)
    private String semester;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
