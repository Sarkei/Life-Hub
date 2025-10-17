package com.lifehub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // ==================== Appearance ====================
    
    @Builder.Default
    @Column(length = 20)
    private String theme = "system"; // system, light, dark

    @Builder.Default
    @Column(length = 10)
    private String language = "de"; // de, en

    // ==================== Notifications ====================
    
    @Builder.Default
    @Column(name = "email_notifications")
    private Boolean emailNotifications = true;

    @Builder.Default
    @Column(name = "push_notifications")
    private Boolean pushNotifications = false;

    @Builder.Default
    @Column(name = "notification_sound")
    private Boolean notificationSound = true;

    // ==================== Privacy ====================
    
    @Builder.Default
    @Column(name = "profile_visible")
    private Boolean profileVisible = true;

    @Builder.Default
    @Column(name = "show_online_status")
    private Boolean showOnlineStatus = true;

    // ==================== Preferences ====================
    
    @Builder.Default
    @Column(length = 50)
    private String timezone = "Europe/Berlin";

    @Builder.Default
    @Column(name = "date_format", length = 20)
    private String dateFormat = "DD.MM.YYYY";

    @Builder.Default
    @Column(name = "time_format", length = 10)
    private String timeFormat = "24h"; // 24h, 12h

    @Builder.Default
    @Column(name = "first_day_of_week")
    private Integer firstDayOfWeek = 1; // 0=Sunday, 1=Monday

    // ==================== Timestamps ====================
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
