package com.lifehub.repository;

import com.lifehub.model.SchoolTimetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolTimetableRepository extends JpaRepository<SchoolTimetable, Long> {
    
    List<SchoolTimetable> findByUserId(Long userId);
    
    List<SchoolTimetable> findByUserIdAndDayOfWeek(Long userId, Integer dayOfWeek);
    
    List<SchoolTimetable> findByUserIdAndSubjectId(Long userId, Long subjectId);
    
    List<SchoolTimetable> findByUserIdAndIsActive(Long userId, Boolean isActive);
    
    List<SchoolTimetable> findByUserIdOrderByDayOfWeekAscStartTimeAsc(Long userId);
}
