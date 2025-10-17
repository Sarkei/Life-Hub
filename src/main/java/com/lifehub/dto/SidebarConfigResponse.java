package com.lifehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SidebarConfigResponse {
    // General Items
    private Boolean showDashboard;
    private Boolean showTodos;
    private Boolean showCalendar;
    private Boolean showContacts;
    private Boolean showProfile;

    // Private Items
    private Boolean showFitness;
    private Boolean showWeight;
    private Boolean showNutrition;
    private Boolean showGoals;
    private Boolean showDiary;
    private Boolean showShopping;
    private Boolean showHealth;
    private Boolean showTravel;
    private Boolean showMovies;
    private Boolean showMusic;
    private Boolean showPhotos;
    private Boolean showQuickNotes;
    private Boolean showHabits;
    private Boolean showBudget;

    // Work Items
    private Boolean showTimeTracking;
    private Boolean showStatistics;
    private Boolean showNews;
    private Boolean showProjects;

    // School Items - Main
    private Boolean showSchool;
    private Boolean showSchoolOverview;
    private Boolean showSchoolSubjects;
    
    // School Items - Detailed
    private Boolean showSchoolNotes;
    private Boolean showSchoolTimetable;
    private Boolean showSchoolHomework;
    private Boolean showSchoolExams;
    private Boolean showSchoolGrades;
    private Boolean showSchoolMaterials;
    private Boolean showSchoolSubmissions;
    private Boolean showSchoolProjects;
    private Boolean showSchoolFlashcards;
    private Boolean showSchoolSummaries;
    private Boolean showSchoolStudySessions;
    private Boolean showSchoolAbsences;
    
    // State
    private Boolean isCollapsed;
}
