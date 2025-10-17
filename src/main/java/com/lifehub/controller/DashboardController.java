package com.lifehub.controller;

import com.lifehub.model.Todo;
import com.lifehub.model.CalendarEvent;
import com.lifehub.repository.TodoRepository;
import com.lifehub.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private TodoRepository todoRepository;
    
    @Autowired
    private CalendarEventRepository calendarEventRepository;
    
    /**
     * Get dashboard overview data
     * - Open todos (not completed)
     * - Upcoming events (next 7 days)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardData(@PathVariable Long userId) {
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Get open todos (ordered by due date and priority)
        List<Todo> openTodos = todoRepository.findOpenTodosByUserId(userId);
        dashboardData.put("openTodos", openTodos);
        dashboardData.put("openTodosCount", openTodos.size());
        
        // Get upcoming events (next 7 days)
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(7);
        List<CalendarEvent> upcomingEvents = calendarEventRepository.findUpcomingEvents(userId, today, endDate);
        dashboardData.put("upcomingEvents", upcomingEvents);
        dashboardData.put("upcomingEventsCount", upcomingEvents.size());
        
        // Get today's events
        List<CalendarEvent> todaysEvents = calendarEventRepository.findTodaysEvents(userId, today);
        dashboardData.put("todaysEvents", todaysEvents);
        
        // Get overdue todos
        List<Todo> overdueTodos = todoRepository.findOverdueTodos(userId, today);
        dashboardData.put("overdueTodos", overdueTodos);
        dashboardData.put("overdueTodosCount", overdueTodos.size());
        
        // Get todos due soon (next 7 days)
        List<Todo> todosDueSoon = todoRepository.findDueSoon(userId, today, endDate);
        dashboardData.put("todosDueSoon", todosDueSoon);
        
        return ResponseEntity.ok(dashboardData);
    }
    
    /**
     * Get quick stats for dashboard
     */
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        
        // Todo stats
        Long openTodosCount = todoRepository.countByUserIdAndCompleted(userId, false);
        Long completedTodosCount = todoRepository.countByUserIdAndCompleted(userId, true);
        Long overdueTodosCount = (long) todoRepository.findOverdueTodos(userId, today).size();
        
        stats.put("openTodosCount", openTodosCount);
        stats.put("completedTodosCount", completedTodosCount);
        stats.put("overdueTodosCount", overdueTodosCount);
        
        // Event stats
        Long upcomingEventsCount = calendarEventRepository.countUpcomingEvents(userId, today);
        Long todaysEventsCount = (long) calendarEventRepository.findTodaysEvents(userId, today).size();
        
        stats.put("upcomingEventsCount", upcomingEventsCount);
        stats.put("todaysEventsCount", todaysEventsCount);
        
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Get open todos only
     */
    @GetMapping("/{userId}/todos/open")
    public ResponseEntity<List<Todo>> getOpenTodos(@PathVariable Long userId) {
        List<Todo> openTodos = todoRepository.findOpenTodosByUserId(userId);
        return ResponseEntity.ok(openTodos);
    }
    
    /**
     * Get upcoming events (next 7 days)
     */
    @GetMapping("/{userId}/events/upcoming")
    public ResponseEntity<List<CalendarEvent>> getUpcomingEvents(@PathVariable Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(7);
        List<CalendarEvent> upcomingEvents = calendarEventRepository.findUpcomingEvents(userId, today, endDate);
        return ResponseEntity.ok(upcomingEvents);
    }
    
    /**
     * Get today's events
     */
    @GetMapping("/{userId}/events/today")
    public ResponseEntity<List<CalendarEvent>> getTodaysEvents(@PathVariable Long userId) {
        List<CalendarEvent> todaysEvents = calendarEventRepository.findTodaysEvents(userId, LocalDate.now());
        return ResponseEntity.ok(todaysEvents);
    }
    
    /**
     * Get overdue todos
     */
    @GetMapping("/{userId}/todos/overdue")
    public ResponseEntity<List<Todo>> getOverdueTodos(@PathVariable Long userId) {
        List<Todo> overdueTodos = todoRepository.findOverdueTodos(userId, LocalDate.now());
        return ResponseEntity.ok(overdueTodos);
    }
}
