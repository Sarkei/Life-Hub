package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sidebar_config")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SidebarConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // General Items
    @Column(name = "dashboard")
    @Builder.Default
    private Boolean dashboard = true;

    @Column(name = "todos")
    @Builder.Default
    private Boolean todos = true;

    @Column(name = "calendar")
    @Builder.Default
    private Boolean calendar = true;

    @Column(name = "contacts")
    @Builder.Default
    private Boolean contacts = false;

    // Private Items
    @Column(name = "fitness")
    @Builder.Default
    private Boolean fitness = true;

    @Column(name = "weight")
    @Builder.Default
    private Boolean weight = true;

    @Column(name = "nutrition")
    @Builder.Default
    private Boolean nutrition = true;

    @Column(name = "goals")
    @Builder.Default
    private Boolean goals = false;

    @Column(name = "diary")
    @Builder.Default
    private Boolean diary = false;

    @Column(name = "shopping")
    @Builder.Default
    private Boolean shopping = false;

    @Column(name = "health")
    @Builder.Default
    private Boolean health = false;

    @Column(name = "travel")
    @Builder.Default
    private Boolean travel = false;

    @Column(name = "movies")
    @Builder.Default
    private Boolean movies = false;

    @Column(name = "music")
    @Builder.Default
    private Boolean music = false;

    @Column(name = "photos")
    @Builder.Default
    private Boolean photos = false;

    @Column(name = "quick_notes")
    @Builder.Default
    private Boolean quickNotes = false;

    // Work Items
    @Column(name = "time_tracking")
    @Builder.Default
    private Boolean timeTracking = false;

    @Column(name = "statistics")
    @Builder.Default
    private Boolean statistics = false;

    @Column(name = "news")
    @Builder.Default
    private Boolean news = false;

    @Column(name = "projects")
    @Builder.Default
    private Boolean projects = false;

    // School Items
    @Column(name = "grades")
    @Builder.Default
    private Boolean grades = false;

    @Column(name = "habits")
    @Builder.Default
    private Boolean habits = false;

    @Column(name = "budget")
    @Builder.Default
    private Boolean budget = false;

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
