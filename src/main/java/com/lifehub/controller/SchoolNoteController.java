package com.lifehub.controller;

import com.lifehub.model.SchoolNote;
import com.lifehub.model.SchoolNoteFolder;
import com.lifehub.repository.SchoolNoteFolderRepository;
import com.lifehub.repository.SchoolNoteRepository;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/school/notes")
@RequiredArgsConstructor
@Slf4j
public class SchoolNoteController {

    private final SchoolNoteRepository noteRepository;
    private final SchoolNoteFolderRepository folderRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    // ============================================
    // FOLDER OPERATIONS
    // ============================================

    @GetMapping("/{userId}/folders")
    public ResponseEntity<List<SchoolNoteFolder>> getAllFolders(@PathVariable Long userId) {
        List<SchoolNoteFolder> folders = folderRepository.findByUserId(userId);
        return ResponseEntity.ok(folders);
    }

    @GetMapping("/{userId}/folders/root")
    public ResponseEntity<List<SchoolNoteFolder>> getRootFolders(@PathVariable Long userId) {
        List<SchoolNoteFolder> folders = folderRepository.findByUserIdAndParentFolderIdIsNull(userId);
        return ResponseEntity.ok(folders);
    }

    @GetMapping("/{userId}/folders/{folderId}/children")
    public ResponseEntity<List<SchoolNoteFolder>> getChildFolders(
            @PathVariable Long userId,
            @PathVariable Long folderId) {
        List<SchoolNoteFolder> folders = folderRepository.findByUserIdAndParentFolderId(userId, folderId);
        return ResponseEntity.ok(folders);
    }

    @PostMapping("/{userId}/folders")
    public ResponseEntity<?> createFolder(
            @PathVariable Long userId,
            @RequestBody FolderRequest request) {
        try {
            // Prüfe ob Ordner bereits existiert
            boolean exists = folderRepository.existsByUserIdAndNameAndParentFolderId(
                userId, request.getName(), request.getParentFolderId());
            
            if (exists) {
                return ResponseEntity.badRequest().body("Folder already exists");
            }

            // Username holen
            String username = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUsername();

            // Parent-Pfad ermitteln
            String parentPath = null;
            if (request.getParentFolderId() != null) {
                SchoolNoteFolder parent = folderRepository.findById(request.getParentFolderId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
                parentPath = parent.getPhysicalPath();
            }

            // Physischen Ordner erstellen
            String relativePath = fileStorageService.createSchoolNoteFolder(
                username, request.getName(), parentPath);

            // Database Entry
            SchoolNoteFolder folder = SchoolNoteFolder.builder()
                .userId(userId)
                .name(request.getName())
                .parentFolderId(request.getParentFolderId())
                .physicalPath(relativePath)
                .build();

            folder = folderRepository.save(folder);
            
            log.info("Created folder: {} for user {}", folder.getName(), userId);
            
            return ResponseEntity.ok(folder);
        } catch (Exception e) {
            log.error("Error creating folder", e);
            return ResponseEntity.internalServerError().body("Failed to create folder: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/folders/{folderId}")
    public ResponseEntity<?> deleteFolder(
            @PathVariable Long userId,
            @PathVariable Long folderId) {
        try {
            SchoolNoteFolder folder = folderRepository.findByUserIdAndId(userId, folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

            String username = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUsername();

            // Lösche physischen Ordner
            fileStorageService.deleteSchoolNoteFolder(username, folder.getPhysicalPath());

            // Lösche Database Entry (CASCADE löscht auch Notes und Child-Folders)
            folderRepository.delete(folder);

            log.info("Deleted folder: {} for user {}", folder.getName(), userId);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting folder", e);
            return ResponseEntity.internalServerError().body("Failed to delete folder: " + e.getMessage());
        }
    }

    // ============================================
    // NOTE OPERATIONS
    // ============================================

    @GetMapping("/{userId}")
    public ResponseEntity<List<SchoolNote>> getAllNotes(@PathVariable Long userId) {
        List<SchoolNote> notes = noteRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{userId}/folder/{folderId}")
    public ResponseEntity<List<SchoolNote>> getNotesByFolder(
            @PathVariable Long userId,
            @PathVariable Long folderId) {
        List<SchoolNote> notes = noteRepository.findByUserIdAndFolderId(userId, folderId);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<SchoolNote>> getFavoriteNotes(@PathVariable Long userId) {
        List<SchoolNote> notes = noteRepository.findByUserIdAndIsFavorite(userId, true);
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{userId}/note/{noteId}")
    public ResponseEntity<?> getNote(
            @PathVariable Long userId,
            @PathVariable Long noteId) {
        try {
            SchoolNote note = noteRepository.findByUserIdAndId(userId, noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

            // Lade Content aus Datei
            String username = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUsername();

            String content = fileStorageService.readSchoolNote(username, note.getPhysicalPath());
            note.setContent(content);

            return ResponseEntity.ok(note);
        } catch (Exception e) {
            log.error("Error reading note", e);
            return ResponseEntity.internalServerError().body("Failed to read note: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createNote(
            @PathVariable Long userId,
            @RequestBody NoteRequest request) {
        try {
            String username = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUsername();

            // Folder-Pfad ermitteln
            String folderPath = null;
            if (request.getFolderId() != null) {
                SchoolNoteFolder folder = folderRepository.findById(request.getFolderId())
                    .orElseThrow(() -> new RuntimeException("Folder not found"));
                folderPath = folder.getPhysicalPath();
            }

            // Speichere Markdown-Datei
            String relativePath = fileStorageService.saveSchoolNote(
                username, folderPath, request.getTitle(), request.getContent());

            // Database Entry
            SchoolNote note = SchoolNote.builder()
                .userId(userId)
                .folderId(request.getFolderId())
                .title(request.getTitle())
                .content(request.getContent())
                .physicalPath(relativePath)
                .tags(request.getTags())
                .isFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false)
                .build();

            note = noteRepository.save(note);

            log.info("Created note: {} for user {}", note.getTitle(), userId);

            return ResponseEntity.ok(note);
        } catch (Exception e) {
            log.error("Error creating note", e);
            return ResponseEntity.internalServerError().body("Failed to create note: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/note/{noteId}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long userId,
            @PathVariable Long noteId,
            @RequestBody NoteRequest request) {
        try {
            SchoolNote note = noteRepository.findByUserIdAndId(userId, noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

            String username = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUsername();

            // Update Datei
            fileStorageService.saveSchoolNote(
                username, 
                note.getPhysicalPath().substring(0, note.getPhysicalPath().lastIndexOf("/")),
                request.getTitle(),
                request.getContent()
            );

            // Update Database
            note.setTitle(request.getTitle());
            note.setContent(request.getContent());
            note.setTags(request.getTags());
            if (request.getIsFavorite() != null) {
                note.setIsFavorite(request.getIsFavorite());
            }

            note = noteRepository.save(note);

            log.info("Updated note: {} for user {}", note.getTitle(), userId);

            return ResponseEntity.ok(note);
        } catch (Exception e) {
            log.error("Error updating note", e);
            return ResponseEntity.internalServerError().body("Failed to update note: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/note/{noteId}")
    public ResponseEntity<?> deleteNote(
            @PathVariable Long userId,
            @PathVariable Long noteId) {
        try {
            SchoolNote note = noteRepository.findByUserIdAndId(userId, noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

            String username = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getUsername();

            // Lösche physische Datei
            fileStorageService.deleteSchoolNote(username, note.getPhysicalPath());

            // Lösche Database Entry
            noteRepository.delete(note);

            log.info("Deleted note: {} for user {}", note.getTitle(), userId);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting note", e);
            return ResponseEntity.internalServerError().body("Failed to delete note: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/note/{noteId}/favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable Long userId,
            @PathVariable Long noteId) {
        try {
            SchoolNote note = noteRepository.findByUserIdAndId(userId, noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

            note.setIsFavorite(!note.getIsFavorite());
            note = noteRepository.save(note);

            return ResponseEntity.ok(note);
        } catch (Exception e) {
            log.error("Error toggling favorite", e);
            return ResponseEntity.internalServerError().body("Failed to toggle favorite");
        }
    }

    @GetMapping("/{userId}/search")
    public ResponseEntity<List<SchoolNote>> searchNotes(
            @PathVariable Long userId,
            @RequestParam String query) {
        List<SchoolNote> notes = noteRepository.findByUserIdAndTitleContainingIgnoreCase(userId, query);
        return ResponseEntity.ok(notes);
    }

    // ============================================
    // DTOs
    // ============================================

    public static class FolderRequest {
        private String name;
        private Long parentFolderId;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Long getParentFolderId() { return parentFolderId; }
        public void setParentFolderId(Long parentFolderId) { this.parentFolderId = parentFolderId; }
    }

    public static class NoteRequest {
        private Long folderId;
        private String title;
        private String content;
        private String tags;
        private Boolean isFavorite;

        public Long getFolderId() { return folderId; }
        public void setFolderId(Long folderId) { this.folderId = folderId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getTags() { return tags; }
        public void setTags(String tags) { this.tags = tags; }
        public Boolean getIsFavorite() { return isFavorite; }
        public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }
    }
}
