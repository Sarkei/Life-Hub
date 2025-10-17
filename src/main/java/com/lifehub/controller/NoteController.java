package com.lifehub.controller;

import com.lifehub.dto.NoteRequest;
import com.lifehub.dto.NoteResponse;
import com.lifehub.model.Note;
import com.lifehub.model.Profile;
import com.lifehub.model.User;
import com.lifehub.repository.NoteRepository;
import com.lifehub.repository.ProfileRepository;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAllNotes(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        List<Note> notes = noteRepository.findByUserId(user.getId());
        return ResponseEntity.ok(notes.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<NoteResponse>> getNotesByCategory(
            @PathVariable String category,
            Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        List<Note> notes = noteRepository.findByUserIdAndCategory(user.getId(), category);
        return ResponseEntity.ok(notes.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Note note = noteRepository.findById(id)
                .filter(n -> n.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Note not found"));
        
        // Lade Inhalt aus Datei
        String content = fileStorageService.readNoteFile(note.getFilePath());
        note.setContent(content);
        
        return ResponseEntity.ok(toResponse(note));
    }

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@RequestBody NoteRequest request, Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            
            // Validiere Kategorie
            if (!List.of("privat", "arbeit", "schule").contains(request.getCategory())) {
                return ResponseEntity.badRequest().build();
            }

            // Generiere Dateinamen aus Titel (Sonderzeichen entfernen)
            String filename = sanitizeFilename(request.getTitle());
            
            // Speichere Notiz als .md Datei
            String filePath = fileStorageService.saveNoteFile(
                    user.getUsername(),
                    request.getCategory(),
                    filename,
                    request.getContent()
            );

            // Hole Profile falls angegeben
            Profile profile = null;
            if (request.getProfileId() != null) {
                profile = profileRepository.findById(request.getProfileId()).orElse(null);
            }

            Note note = Note.builder()
                    .title(request.getTitle())
                    .content(request.getContent())
                    .filePath(filePath)
                    .category(request.getCategory())
                    .user(user)
                    .profile(profile)
                    .build();

            note = noteRepository.save(note);
            return ResponseEntity.ok(toResponse(note));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable Long id,
            @RequestBody NoteRequest request,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            Note note = noteRepository.findById(id)
                    .filter(n -> n.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Note not found"));

            // Aktualisiere Datei-Inhalt
            fileStorageService.updateNoteFile(note.getFilePath(), request.getContent());

            // Aktualisiere Datenbank
            note.setTitle(request.getTitle());
            note.setContent(request.getContent());
            if (request.getProfileId() != null) {
                Profile profile = profileRepository.findById(request.getProfileId()).orElse(null);
                note.setProfile(profile);
            }

            note = noteRepository.save(note);
            return ResponseEntity.ok(toResponse(note));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            Note note = noteRepository.findById(id)
                    .filter(n -> n.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Note not found"));

            // Lösche Datei
            fileStorageService.deleteNoteFile(note.getFilePath());

            // Lösche Datenbankeintrag
            noteRepository.delete(note);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private NoteResponse toResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .category(note.getCategory())
                .filePath(note.getFilePath())
                .userId(note.getUser().getId())
                .profileId(note.getProfile() != null ? note.getProfile().getId() : null)
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }

    private String sanitizeFilename(String filename) {
        // Entferne Sonderzeichen und ersetze Leerzeichen durch Unterstriche
        return filename.replaceAll("[^a-zA-Z0-9äöüÄÖÜß\\s-]", "")
                .replaceAll("\\s+", "_")
                .toLowerCase();
    }
}
