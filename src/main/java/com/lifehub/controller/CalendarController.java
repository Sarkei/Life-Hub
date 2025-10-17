package com.lifehub.controller;

import com.lifehub.model.CalendarEvent;
import com.lifehub.model.enums.AreaType;
import com.lifehub.repository.CalendarEventRepository;
import com.lifehub.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarEventRepository calendarEventRepository;
    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<CalendarEvent>> getEvents(
            @RequestParam Long profileId,
            @RequestParam(required = false) AreaType area,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        if (start != null && end != null) {
            return ResponseEntity.ok(calendarEventRepository.findByProfileIdAndStartTimeBetween(profileId, start, end));
        } else if (area != null) {
            return ResponseEntity.ok(calendarEventRepository.findByProfileIdAndArea(profileId, area));
        }
        return ResponseEntity.ok(calendarEventRepository.findByProfileId(profileId));
    }

    @PostMapping
    public ResponseEntity<CalendarEvent> createEvent(@RequestBody CalendarEvent eventRequest) {
        var profile = profileRepository.findById(eventRequest.getProfile().getId()).orElseThrow();
        
        CalendarEvent event = CalendarEvent.builder()
                .title(eventRequest.getTitle())
                .description(eventRequest.getDescription())
                .startTime(eventRequest.getStartTime())
                .endTime(eventRequest.getEndTime())
                .location(eventRequest.getLocation())
                .color(eventRequest.getColor() != null ? eventRequest.getColor() : "#3b82f6")
                .area(eventRequest.getArea())
                .profile(profile)
                .allDay(eventRequest.getAllDay() != null ? eventRequest.getAllDay() : false)
                .build();
        
        return ResponseEntity.ok(calendarEventRepository.save(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable Long id, @RequestBody CalendarEvent eventRequest) {
        var event = calendarEventRepository.findById(id).orElseThrow();
        
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setStartTime(eventRequest.getStartTime());
        event.setEndTime(eventRequest.getEndTime());
        event.setLocation(eventRequest.getLocation());
        event.setColor(eventRequest.getColor());
        event.setAllDay(eventRequest.getAllDay());
        
        return ResponseEntity.ok(calendarEventRepository.save(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        calendarEventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
