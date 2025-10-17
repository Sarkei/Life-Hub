package com.lifehub.model;

import com.lifehub.model.enums.AreaType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "widgets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Widget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AreaType area;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WidgetType type;

    @Column(nullable = false)
    private Integer gridX = 0;

    @Column(nullable = false)
    private Integer gridY = 0;

    @Column(nullable = false)
    private Integer gridWidth = 2;

    @Column(nullable = false)
    private Integer gridHeight = 2;

    @Column(columnDefinition = "TEXT")
    private String configuration; // JSON for widget-specific settings

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum WidgetType {
        TODO_LIST,
        CALENDAR,
        WORKOUT_STATS,
        WEIGHT_TRACKER,
        MEAL_SUMMARY,
        QUICK_NOTES,
        UPCOMING_EVENTS,
        TASK_PROGRESS,
        HABIT_TRACKER
    }
}
