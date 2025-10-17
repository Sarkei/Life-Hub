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
    @Column(name = "show_dashboard")
    @Builder.Default
    private Boolean showDashboard = true;

    @Column(name = "show_todos")
    @Builder.Default
    private Boolean showTodos = true;

    @Column(name = "show_calendar")
    @Builder.Default
    private Boolean showCalendar = true;

    @Column(name = "show_contacts")
    @Builder.Default
    private Boolean showContacts = false;

    @Column(name = "show_profile")
    @Builder.Default
    private Boolean showProfile = true;

    // Private Items
    @Column(name = "show_fitness")
    @Builder.Default
    private Boolean showFitness = true;

    @Column(name = "show_weight")
    @Builder.Default
    private Boolean showWeight = true;

    @Column(name = "show_nutrition")
    @Builder.Default
    private Boolean showNutrition = true;

    @Column(name = "show_goals")
    @Builder.Default
    private Boolean showGoals = false;

    @Column(name = "show_diary")
    @Builder.Default
    private Boolean showDiary = false;

    @Column(name = "show_shopping")
    @Builder.Default
    private Boolean showShopping = false;

    @Column(name = "show_health")
    @Builder.Default
    private Boolean showHealth = false;

    @Column(name = "show_travel")
    @Builder.Default
    private Boolean showTravel = false;

    @Column(name = "show_movies")
    @Builder.Default
    private Boolean showMovies = false;

    @Column(name = "show_music")
    @Builder.Default
    private Boolean showMusic = false;

    @Column(name = "show_photos")
    @Builder.Default
    private Boolean showPhotos = false;

    @Column(name = "show_quick_notes")
    @Builder.Default
    private Boolean showQuickNotes = false;

    @Column(name = "show_habits")
    @Builder.Default
    private Boolean showHabits = false;

    @Column(name = "show_budget")
    @Builder.Default
    private Boolean showBudget = false;

    // Work Items
    @Column(name = "show_time_tracking")
    @Builder.Default
    private Boolean showTimeTracking = false;

    @Column(name = "show_statistics")
    @Builder.Default
    private Boolean showStatistics = false;

    @Column(name = "show_news")
    @Builder.Default
    private Boolean showNews = false;

    @Column(name = "show_projects")
    @Builder.Default
    private Boolean showProjects = false;

    // School Items - Main
    @Column(name = "show_school")
    @Builder.Default
    private Boolean showSchool = true;

    // School Items - Detailed
    @Column(name = "show_school_overview")
    @Builder.Default
    private Boolean showSchoolOverview = true;

    @Column(name = "show_school_notes")
    @Builder.Default
    private Boolean showSchoolNotes = true;

    @Column(name = "show_school_timetable")
    @Builder.Default
    private Boolean showSchoolTimetable = true;

    @Column(name = "show_school_subjects")
    @Builder.Default
    private Boolean showSchoolSubjects = true;

    @Column(name = "show_school_homework")
    @Builder.Default
    private Boolean showSchoolHomework = true;

    @Column(name = "show_school_exams")
    @Builder.Default
    private Boolean showSchoolExams = true;

    @Column(name = "show_school_grades")
    @Builder.Default
    private Boolean showSchoolGrades = true;

    @Column(name = "show_school_materials")
    @Builder.Default
    private Boolean showSchoolMaterials = true;

    @Column(name = "show_school_submissions")
    @Builder.Default
    private Boolean showSchoolSubmissions = true;

    @Column(name = "show_school_projects")
    @Builder.Default
    private Boolean showSchoolProjects = false;

    @Column(name = "show_school_flashcards")
    @Builder.Default
    private Boolean showSchoolFlashcards = false;

    @Column(name = "show_school_summaries")
    @Builder.Default
    private Boolean showSchoolSummaries = false;

    @Column(name = "show_school_study_sessions")
    @Builder.Default
    private Boolean showSchoolStudySessions = true;

    @Column(name = "show_school_absences")
    @Builder.Default
    private Boolean showSchoolAbsences = true;

    // Sidebar State
    @Column(name = "is_collapsed")
    @Builder.Default
    private Boolean isCollapsed = false;

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
