package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "calendar_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "all_day", nullable = false)
    @Builder.Default
    private Boolean allDay = false;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "event_type", length = 50)
    private String eventType;

    @Column(length = 7)
    @Builder.Default
    private String color = "#3B82F6";

    @Builder.Default
    private Boolean recurring = false;

    @Column(name = "recurrence_rule")
    private String recurrenceRule;

    @Column(name = "reminder_minutes")
    private Integer reminderMinutes;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private EventStatus status = EventStatus.CONFIRMED;

    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType; // EXAM, TRAINING, HOMEWORK

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "created_at", nullable = false, updatable = false)
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

    // Enum
    public enum EventStatus {
        CONFIRMED, TENTATIVE, CANCELLED
    }
}
