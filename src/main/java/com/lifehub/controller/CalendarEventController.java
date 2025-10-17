package com.lifehub.controller;

import com.lifehub.model.CalendarEvent;
import com.lifehub.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class CalendarEventController {
    
    @Autowired
    private CalendarEventRepository eventRepository;
    
    // Get all events for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<CalendarEvent>> getAllEvents(@PathVariable Long userId) {
        List<CalendarEvent> events = eventRepository.findByUserId(userId);
        return ResponseEntity.ok(events);
    }
    
    // Get events by category
    @GetMapping("/{userId}/category/{category}")
    public ResponseEntity<List<CalendarEvent>> getEventsByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<CalendarEvent> events = eventRepository.findByUserIdAndCategory(userId, category);
        return ResponseEntity.ok(events);
    }
    
    // Get events in date range
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<CalendarEvent>> getEventsInRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<CalendarEvent> events = eventRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(events);
    }
    
    // Get upcoming events (next 7 days)
    @GetMapping("/{userId}/upcoming")
    public ResponseEntity<List<CalendarEvent>> getUpcomingEvents(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") Integer days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        List<CalendarEvent> events = eventRepository.findUpcomingEvents(userId, today, endDate);
        return ResponseEntity.ok(events);
    }
    
    // Get today's events
    @GetMapping("/{userId}/today")
    public ResponseEntity<List<CalendarEvent>> getTodaysEvents(@PathVariable Long userId) {
        List<CalendarEvent> events = eventRepository.findTodaysEvents(userId, LocalDate.now());
        return ResponseEntity.ok(events);
    }
    
    // Get events by related entity
    @GetMapping("/{userId}/related/{entityType}/{entityId}")
    public ResponseEntity<List<CalendarEvent>> getEventsByRelatedEntity(
            @PathVariable Long userId,
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        List<CalendarEvent> events = eventRepository
                .findByUserIdAndRelatedEntityTypeAndRelatedEntityId(userId, entityType, entityId);
        return ResponseEntity.ok(events);
    }
    
    // Get single event
    @GetMapping("/{userId}/item/{eventId}")
    public ResponseEntity<CalendarEvent> getEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .filter(event -> event.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new event
    @PostMapping("/{userId}")
    public ResponseEntity<CalendarEvent> createEvent(
            @PathVariable Long userId,
            @RequestBody CalendarEvent event) {
        event.setId(null);
        event.setUserId(userId);
        CalendarEvent saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }
    
    // Update event
    @PutMapping("/{userId}/{eventId}")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId,
            @RequestBody CalendarEvent event) {
        return eventRepository.findById(eventId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    event.setId(eventId);
                    event.setUserId(userId);
                    event.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Cancel event
    @PostMapping("/{userId}/{eventId}/cancel")
    public ResponseEntity<CalendarEvent> cancelEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .filter(event -> event.getUserId().equals(userId))
                .map(event -> {
                    event.setStatus(CalendarEvent.EventStatus.CANCELLED);
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Confirm event
    @PostMapping("/{userId}/{eventId}/confirm")
    public ResponseEntity<CalendarEvent> confirmEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .filter(event -> event.getUserId().equals(userId))
                .map(event -> {
                    event.setStatus(CalendarEvent.EventStatus.CONFIRMED);
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete event
    @DeleteMapping("/{userId}/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long userId,
            @PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .filter(event -> event.getUserId().equals(userId))
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
