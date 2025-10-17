package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "school_absences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SchoolAbsence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "absence_date", nullable = false)
    private LocalDate absenceDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(length = 255)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "absence_type", length = 20)
    private String absenceType = "SICK"; // SICK, EXCUSED, UNEXCUSED, VACATION

    @Builder.Default
    @Column(name = "is_excused")
    private Boolean isExcused = false;

    @Builder.Default
    @Column(name = "certificate_required")
    private Boolean certificateRequired = false;

    @Builder.Default
    @Column(name = "certificate_submitted")
    private Boolean certificateSubmitted = false;

    @Builder.Default
    @Column(name = "teacher_notified")
    private Boolean teacherNotified = false;

    @Builder.Default
    @Column(name = "parent_notified")
    private Boolean parentNotified = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
