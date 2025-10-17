package com.lifehub.repository;

import com.lifehub.model.CalendarEvent;
import com.lifehub.model.enums.AreaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByProfileIdAndArea(Long profileId, AreaType area);
    List<CalendarEvent> findByProfileIdAndStartTimeBetween(Long profileId, LocalDateTime start, LocalDateTime end);
    List<CalendarEvent> findByProfileId(Long profileId);
}
