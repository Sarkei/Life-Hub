package com.lifehub.controller;

import com.lifehub.dto.SidebarConfigResponse;
import com.lifehub.model.SidebarConfig;
import com.lifehub.repository.SidebarConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sidebar")
@RequiredArgsConstructor
public class SidebarController {

    private final SidebarConfigRepository sidebarConfigRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<SidebarConfigResponse> getSidebarConfig(@PathVariable Long userId) {
        SidebarConfig config = sidebarConfigRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultConfig(userId));

        return ResponseEntity.ok(mapToResponse(config));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<SidebarConfigResponse> updateSidebarConfig(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> updates) {

        SidebarConfig config = sidebarConfigRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultConfig(userId));

        // Update nur die übergebenen Felder
        updates.forEach((key, value) -> {
            switch (key) {
                // General
                case "showDashboard" -> config.setShowDashboard(value);
                case "showTodos" -> config.setShowTodos(value);
                case "showCalendar" -> config.setShowCalendar(value);
                case "showContacts" -> config.setShowContacts(value);
                case "showProfile" -> config.setShowProfile(value);
                
                // Private
                case "showFitness" -> config.setShowFitness(value);
                case "showWeight" -> config.setShowWeight(value);
                case "showNutrition" -> config.setShowNutrition(value);
                case "showGoals" -> config.setShowGoals(value);
                case "showDiary" -> config.setShowDiary(value);
                case "showShopping" -> config.setShowShopping(value);
                case "showHealth" -> config.setShowHealth(value);
                case "showTravel" -> config.setShowTravel(value);
                case "showMovies" -> config.setShowMovies(value);
                case "showMusic" -> config.setShowMusic(value);
                case "showPhotos" -> config.setShowPhotos(value);
                case "showQuickNotes" -> config.setShowQuickNotes(value);
                case "showHabits" -> config.setShowHabits(value);
                case "showBudget" -> config.setShowBudget(value);
                
                // Work
                case "showTimeTracking" -> config.setShowTimeTracking(value);
                case "showStatistics" -> config.setShowStatistics(value);
                case "showNews" -> config.setShowNews(value);
                case "showProjects" -> config.setShowProjects(value);
                
                // School - Main
                case "showSchool" -> config.setShowSchool(value);
                case "showSchoolOverview" -> config.setShowSchoolOverview(value);
                case "showSchoolSubjects" -> config.setShowSchoolSubjects(value);
                
                // School - Detailed Features
                case "showSchoolNotes" -> config.setShowSchoolNotes(value);
                case "showSchoolTimetable" -> config.setShowSchoolTimetable(value);
                case "showSchoolHomework" -> config.setShowSchoolHomework(value);
                case "showSchoolExams" -> config.setShowSchoolExams(value);
                case "showSchoolGrades" -> config.setShowSchoolGrades(value);
                case "showSchoolMaterials" -> config.setShowSchoolMaterials(value);
                case "showSchoolSubmissions" -> config.setShowSchoolSubmissions(value);
                case "showSchoolProjects" -> config.setShowSchoolProjects(value);
                case "showSchoolFlashcards" -> config.setShowSchoolFlashcards(value);
                case "showSchoolSummaries" -> config.setShowSchoolSummaries(value);
                case "showSchoolStudySessions" -> config.setShowSchoolStudySessions(value);
                case "showSchoolAbsences" -> config.setShowSchoolAbsences(value);
                
                // State
                case "isCollapsed" -> config.setIsCollapsed(value);
            }
        });

        SidebarConfig savedConfig = sidebarConfigRepository.save(config);
        return ResponseEntity.ok(mapToResponse(savedConfig));
    }

    @PostMapping("/{userId}/reset")
    public ResponseEntity<SidebarConfigResponse> resetToDefaults(@PathVariable Long userId) {
        SidebarConfig config = sidebarConfigRepository.findByUserId(userId)
                .orElseGet(() -> SidebarConfig.builder().userId(userId).build());

        // Setze alle auf Default-Werte
        // General
        config.setShowDashboard(true);
        config.setShowTodos(true);
        config.setShowCalendar(true);
        config.setShowContacts(false);
        config.setShowProfile(false);
        
        // Private
        config.setShowFitness(true);
        config.setShowWeight(true);
        config.setShowNutrition(true);
        config.setShowGoals(false);
        config.setShowDiary(false);
        config.setShowShopping(false);
        config.setShowHealth(false);
        config.setShowTravel(false);
        config.setShowMovies(false);
        config.setShowMusic(false);
        config.setShowPhotos(false);
        config.setShowQuickNotes(false);
        config.setShowHabits(false);
        config.setShowBudget(false);
        
        // Work
        config.setShowTimeTracking(false);
        config.setShowStatistics(false);
        config.setShowNews(false);
        config.setShowProjects(false);
        
        // School
        config.setShowSchool(true);
        config.setShowSchoolOverview(true);
        config.setShowSchoolSubjects(true);
        config.setShowSchoolNotes(true);
        config.setShowSchoolTimetable(true);
        config.setShowSchoolHomework(true);
        config.setShowSchoolExams(true);
        config.setShowSchoolGrades(true);
        config.setShowSchoolMaterials(false);
        config.setShowSchoolSubmissions(true);
        config.setShowSchoolProjects(false);
        config.setShowSchoolFlashcards(false);
        config.setShowSchoolSummaries(false);
        config.setShowSchoolStudySessions(true);
        config.setShowSchoolAbsences(true);
        
        // State
        config.setIsCollapsed(false);

        SidebarConfig savedConfig = sidebarConfigRepository.save(config);
        return ResponseEntity.ok(mapToResponse(savedConfig));
    }

    private SidebarConfig createDefaultConfig(Long userId) {
        return SidebarConfig.builder()
                .userId(userId)
                .showDashboard(true)
                .showTodos(true)
                .showCalendar(true)
                .showContacts(false)
                .showProfile(false)
                .showFitness(true)
                .showWeight(true)
                .showNutrition(true)
                .showGoals(false)
                .showDiary(false)
                .showShopping(false)
                .showHealth(false)
                .showTravel(false)
                .showMovies(false)
                .showMusic(false)
                .showPhotos(false)
                .showQuickNotes(false)
                .showHabits(false)
                .showBudget(false)
                .showTimeTracking(false)
                .showStatistics(false)
                .showNews(false)
                .showProjects(false)
                .showSchool(true)
                .showSchoolOverview(true)
                .showSchoolSubjects(true)
                .showSchoolNotes(true)
                .showSchoolTimetable(true)
                .showSchoolHomework(true)
                .showSchoolExams(true)
                .showSchoolGrades(true)
                .showSchoolMaterials(false)
                .showSchoolSubmissions(true)
                .showSchoolProjects(false)
                .showSchoolFlashcards(false)
                .showSchoolSummaries(false)
                .showSchoolStudySessions(true)
                .showSchoolAbsences(true)
                .isCollapsed(false)
                .build();
    }

    private SidebarConfigResponse mapToResponse(SidebarConfig config) {
        return SidebarConfigResponse.builder()
                .showDashboard(config.getShowDashboard())
                .showTodos(config.getShowTodos())
                .showCalendar(config.getShowCalendar())
                .showContacts(config.getShowContacts())
                .showProfile(config.getShowProfile())
                .showFitness(config.getShowFitness())
                .showWeight(config.getShowWeight())
                .showNutrition(config.getShowNutrition())
                .showGoals(config.getShowGoals())
                .showDiary(config.getShowDiary())
                .showShopping(config.getShowShopping())
                .showHealth(config.getShowHealth())
                .showTravel(config.getShowTravel())
                .showMovies(config.getShowMovies())
                .showMusic(config.getShowMusic())
                .showPhotos(config.getShowPhotos())
                .showQuickNotes(config.getShowQuickNotes())
                .showHabits(config.getShowHabits())
                .showBudget(config.getShowBudget())
                .showTimeTracking(config.getShowTimeTracking())
                .showStatistics(config.getShowStatistics())
                .showNews(config.getShowNews())
                .showProjects(config.getShowProjects())
                .showSchool(config.getShowSchool())
                .showSchoolOverview(config.getShowSchoolOverview())
                .showSchoolSubjects(config.getShowSchoolSubjects())
                .showSchoolNotes(config.getShowSchoolNotes())
                .showSchoolTimetable(config.getShowSchoolTimetable())
                .showSchoolHomework(config.getShowSchoolHomework())
                .showSchoolExams(config.getShowSchoolExams())
                .showSchoolGrades(config.getShowSchoolGrades())
                .showSchoolMaterials(config.getShowSchoolMaterials())
                .showSchoolSubmissions(config.getShowSchoolSubmissions())
                .showSchoolProjects(config.getShowSchoolProjects())
                .showSchoolFlashcards(config.getShowSchoolFlashcards())
                .showSchoolSummaries(config.getShowSchoolSummaries())
                .showSchoolStudySessions(config.getShowSchoolStudySessions())
                .showSchoolAbsences(config.getShowSchoolAbsences())
                .isCollapsed(config.getIsCollapsed())
                .build();
    }
}
