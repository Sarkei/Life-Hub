package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "absences")
public class Absence {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "absence_date", nullable = false)
    private LocalDate absenceDate;
    
    @Column(length = 100)
    private String subject;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "absence_type", length = 20)
    private AbsenceType absenceType = AbsenceType.SICK;
    
    @Column
    private Integer periods = 1;
    
    @Column(name = "all_day")
    private Boolean allDay = false;
    
    @Column
    private Boolean excused = false;
    
    @Column(name = "excuse_note_submitted")
    private Boolean excuseNoteSubmitted = false;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum AbsenceType {
        SICK, EXCUSED, UNEXCUSED, LATE
    }
}
