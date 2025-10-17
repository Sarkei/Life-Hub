package com.lifehub.model;

import com.lifehub.config.LowestAvailableIdGenerator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(generator = "lowest-available-id")
    @GenericGenerator(name = "lowest-available-id", strategy = "com.lifehub.config.LowestAvailableIdGenerator")
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String password; // Nullable für OAuth2-Nutzer

    @Column
    private String provider; // local, google, etc.

    @Column
    private String providerId; // Google User ID

    @Column(name = "phone_number")
    private String phoneNumber; // Format: +49 151 12345678

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
