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
                case "dashboard" -> config.setDashboard(value);
                case "todos" -> config.setTodos(value);
                case "calendar" -> config.setCalendar(value);
                case "contacts" -> config.setContacts(value);
                
                // Private
                case "fitness" -> config.setFitness(value);
                case "weight" -> config.setWeight(value);
                case "nutrition" -> config.setNutrition(value);
                case "goals" -> config.setGoals(value);
                case "diary" -> config.setDiary(value);
                case "shopping" -> config.setShopping(value);
                case "health" -> config.setHealth(value);
                case "travel" -> config.setTravel(value);
                case "movies" -> config.setMovies(value);
                case "music" -> config.setMusic(value);
                case "photos" -> config.setPhotos(value);
                case "quickNotes" -> config.setQuickNotes(value);
                
                // Work
                case "timeTracking" -> config.setTimeTracking(value);
                case "statistics" -> config.setStatistics(value);
                case "news" -> config.setNews(value);
                case "projects" -> config.setProjects(value);
                
                // School
                case "school" -> config.setSchool(value);
                case "grades" -> config.setGrades(value);
                case "habits" -> config.setHabits(value);
                case "budget" -> config.setBudget(value);
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
        config.setDashboard(true);
        config.setTodos(true);
        config.setCalendar(true);
        config.setContacts(false);
        config.setFitness(true);
        config.setWeight(true);
        config.setNutrition(true);
        config.setGoals(false);
        config.setDiary(false);
        config.setShopping(false);
        config.setHealth(false);
        config.setTravel(false);
        config.setMovies(false);
        config.setMusic(false);
        config.setPhotos(false);
        config.setQuickNotes(false);
        config.setTimeTracking(false);
        config.setStatistics(false);
        config.setNews(false);
        config.setProjects(false);
        config.setSchool(true);
        config.setGrades(false);
        config.setHabits(false);
        config.setBudget(false);

        SidebarConfig savedConfig = sidebarConfigRepository.save(config);
        return ResponseEntity.ok(mapToResponse(savedConfig));
    }

    private SidebarConfig createDefaultConfig(Long userId) {
        return SidebarConfig.builder()
                .userId(userId)
                .dashboard(true)
                .todos(true)
                .calendar(true)
                .contacts(false)
                .fitness(true)
                .weight(true)
                .nutrition(true)
                .goals(false)
                .diary(false)
                .shopping(false)
                .health(false)
                .travel(false)
                .movies(false)
                .music(false)
                .photos(false)
                .quickNotes(false)
                .timeTracking(false)
                .statistics(false)
                .news(false)
                .projects(false)
                .school(true)
                .grades(false)
                .habits(false)
                .budget(false)
                .build();
    }

    private SidebarConfigResponse mapToResponse(SidebarConfig config) {
        return SidebarConfigResponse.builder()
                .dashboard(config.getDashboard())
                .todos(config.getTodos())
                .calendar(config.getCalendar())
                .contacts(config.getContacts())
                .fitness(config.getFitness())
                .weight(config.getWeight())
                .nutrition(config.getNutrition())
                .goals(config.getGoals())
                .diary(config.getDiary())
                .shopping(config.getShopping())
                .health(config.getHealth())
                .travel(config.getTravel())
                .movies(config.getMovies())
                .music(config.getMusic())
                .photos(config.getPhotos())
                .quickNotes(config.getQuickNotes())
                .timeTracking(config.getTimeTracking())
                .statistics(config.getStatistics())
                .news(config.getNews())
                .projects(config.getProjects())
                .school(config.getSchool())
                .grades(config.getGrades())
                .habits(config.getHabits())
                .budget(config.getBudget())
                .build();
    }
}
