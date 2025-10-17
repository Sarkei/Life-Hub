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
@Table(name = "notes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String filePath; // Pfad zur .md oder .pdf Datei auf dem Server

    @Column(nullable = false)
    private String category; // privat, arbeit, schule
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NoteType type = NoteType.FILE; // FILE oder FOLDER
    
    @Column
    @Enumerated(EnumType.STRING)
    private FileType fileType = FileType.MARKDOWN; // MARKDOWN oder PDF
    
    @Column(name = "parent_id")
    private Long parentId; // Für Ordnerstruktur
    
    @Column(name = "folder_path")
    private String folderPath; // z.B. "/Mathematik/Analysis"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    public enum NoteType {
        FILE, FOLDER
    }
    
    public enum FileType {
        MARKDOWN, PDF, NONE
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
