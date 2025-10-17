package com.lifehub.controller;

import com.lifehub.model.CalendarEvent;
import com.lifehub.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {

    @Autowired
    private CalendarEventRepository eventRepository;

    // Alle Events für User (optional mit Kategorie)
    @GetMapping("/events")
    public ResponseEntity<List<CalendarEvent>> getEvents(
            @RequestParam Long userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        List<CalendarEvent> events;
        
        if (start != null && end != null) {
            if (category != null) {
                events = eventRepository.findByUserIdAndCategoryAndDateRange(userId, category, start, end);
            } else {
                events = eventRepository.findByUserIdAndDateRange(userId, start, end);
            }
        } else if (category != null) {
            events = eventRepository.findByUserIdAndCategoryOrderByStartTimeAsc(userId, category);
        } else {
            events = eventRepository.findByUserIdOrderByStartTimeAsc(userId);
        }
        
        return ResponseEntity.ok(events);
    }

    // Upcoming Events (nächste 7 Tage)
    @GetMapping("/events/upcoming")
    public ResponseEntity<List<CalendarEvent>> getUpcomingEvents(
            @RequestParam Long userId,
            @RequestParam(required = false, defaultValue = "7") int days) {
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = now.plusDays(days);
        
        List<CalendarEvent> events = eventRepository.findByUserIdAndDateRange(userId, now, end);
        
        return ResponseEntity.ok(events);
    }

    // Einzelnes Event abrufen
    @GetMapping("/events/{id}")
    public ResponseEntity<CalendarEvent> getEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Neues Event erstellen
    @PostMapping("/events")
    public ResponseEntity<CalendarEvent> createEvent(@RequestBody CalendarEvent event) {
        CalendarEvent savedEvent = eventRepository.save(event);
        return ResponseEntity.ok(savedEvent);
    }

    // Event aktualisieren
    @PutMapping("/events/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable Long id,
            @RequestBody CalendarEvent eventDetails) {
        
        return eventRepository.findById(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setDescription(eventDetails.getDescription());
                    event.setStartTime(eventDetails.getStartTime());
                    event.setEndTime(eventDetails.getEndTime());
                    event.setCategory(eventDetails.getCategory());
                    event.setColor(eventDetails.getColor());
                    event.setAllDay(eventDetails.getAllDay());
                    event.setLocation(eventDetails.getLocation());
                    
                    CalendarEvent updatedEvent = eventRepository.save(event);
                    return ResponseEntity.ok(updatedEvent);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Event löschen
    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
