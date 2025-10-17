package com.lifehub.controller;

import com.lifehub.model.Note;
import com.lifehub.model.User;
import com.lifehub.repository.NoteRepository;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes/folders")
@RequiredArgsConstructor
public class NoteFolderController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    // Ordnerstruktur abrufen
    @GetMapping("/tree")
    public ResponseEntity<List<TreeNode>> getFolderTree(
            @RequestParam String category,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            List<Note> notes = noteRepository.findByUserIdAndCategory(user.getId(), category);
            
            List<TreeNode> tree = buildTree(notes, null);
            return ResponseEntity.ok(tree);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Neuen Ordner erstellen
    @PostMapping("/create-folder")
    public ResponseEntity<Note> createFolder(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) String folderPath,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            
            String path = folderPath != null ? folderPath + "/" + name : "/" + name;
            String physicalPath = String.format("/volume1/docker/Life-Hub-Data/%s/%s%s", 
                    user.getUsername(), category, path);
            
            // Erstelle Ordner auf Dateisystem
            Files.createDirectories(Paths.get(physicalPath));
            
            Note folder = Note.builder()
                    .title(name)
                    .content("")
                    .filePath(physicalPath)
                    .category(category)
                    .type(Note.NoteType.FOLDER)
                    .fileType(Note.FileType.NONE)
                    .parentId(parentId)
                    .folderPath(path)
                    .user(user)
                    .build();
            
            folder = noteRepository.save(folder);
            return ResponseEntity.ok(folder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Ordner umbenennen
    @PutMapping("/rename/{id}")
    public ResponseEntity<Note> renameFolder(
            @PathVariable Long id,
            @RequestParam String newName,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            Note note = noteRepository.findById(id)
                    .filter(n -> n.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Note/Folder not found"));
            
            // Alter Pfad
            Path oldPath = Paths.get(note.getFilePath());
            
            // Neuer Pfad
            Path newPath = oldPath.getParent().resolve(newName);
            if (note.getType() == Note.NoteType.FILE && note.getFileType() == Note.FileType.MARKDOWN) {
                newPath = Paths.get(newPath.toString() + ".md");
            } else if (note.getType() == Note.NoteType.FILE && note.getFileType() == Note.FileType.PDF) {
                newPath = Paths.get(newPath.toString() + ".pdf");
            }
            
            // Datei/Ordner umbenennen
            Files.move(oldPath, newPath);
            
            note.setTitle(newName);
            note.setFilePath(newPath.toString());
            
            if (note.getFolderPath() != null) {
                String[] parts = note.getFolderPath().split("/");
                parts[parts.length - 1] = newName;
                note.setFolderPath(String.join("/", parts));
            }
            
            note = noteRepository.save(note);
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Ordner/Datei löschen
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            Note note = noteRepository.findById(id)
                    .filter(n -> n.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Note/Folder not found"));
            
            Path path = Paths.get(note.getFilePath());
            
            if (note.getType() == Note.NoteType.FOLDER) {
                // Lösche alle Unterelemente
                List<Note> children = noteRepository.findByParentId(note.getId());
                for (Note child : children) {
                    deleteItem(child.getId(), authentication);
                }
                // Lösche Ordner
                Files.deleteIfExists(path);
            } else {
                // Lösche Datei
                Files.deleteIfExists(path);
            }
            
            noteRepository.delete(note);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Markdown-Notiz erstellen
    @PostMapping("/create-note")
    public ResponseEntity<Note> createNote(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String content,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) String folderPath,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            
            String path = folderPath != null ? folderPath + "/" + title : "/" + title;
            String physicalPath = String.format("/volume1/docker/Life-Hub-Data/%s/%s%s.md", 
                    user.getUsername(), category, path);
            
            // Stelle sicher dass Parent-Ordner existiert
            Files.createDirectories(Paths.get(physicalPath).getParent());
            
            // Schreibe Inhalt
            Files.writeString(Paths.get(physicalPath), content);
            
            Note note = Note.builder()
                    .title(title)
                    .content(content)
                    .filePath(physicalPath)
                    .category(category)
                    .type(Note.NoteType.FILE)
                    .fileType(Note.FileType.MARKDOWN)
                    .parentId(parentId)
                    .folderPath(folderPath)
                    .user(user)
                    .build();
            
            note = noteRepository.save(note);
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Markdown-Notiz aktualisieren
    @PutMapping("/update-note/{id}")
    public ResponseEntity<Note> updateNote(
            @PathVariable Long id,
            @RequestParam String content,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            Note note = noteRepository.findById(id)
                    .filter(n -> n.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Note not found"));
            
            // Schreibe Inhalt
            Files.writeString(Paths.get(note.getFilePath()), content);
            
            note.setContent(content);
            note = noteRepository.save(note);
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // PDF hochladen
    @PostMapping("/upload-pdf")
    public ResponseEntity<Note> uploadPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam String category,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) String folderPath,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            
            if (!file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().build();
            }
            
            String originalFilename = file.getOriginalFilename();
            String filename = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
            
            String path = folderPath != null ? folderPath + "/" + originalFilename : "/" + originalFilename;
            String physicalPath = String.format("/volume1/docker/Life-Hub-Data/%s/%s%s", 
                    user.getUsername(), category, path);
            
            // Stelle sicher dass Parent-Ordner existiert
            Files.createDirectories(Paths.get(physicalPath).getParent());
            
            // Speichere PDF
            Files.write(Paths.get(physicalPath), file.getBytes());
            
            Note note = Note.builder()
                    .title(filename)
                    .content("")
                    .filePath(physicalPath)
                    .category(category)
                    .type(Note.NoteType.FILE)
                    .fileType(Note.FileType.PDF)
                    .parentId(parentId)
                    .folderPath(folderPath)
                    .user(user)
                    .build();
            
            note = noteRepository.save(note);
            return ResponseEntity.ok(note);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // PDF abrufen
    @GetMapping("/pdf/{id}")
    public ResponseEntity<byte[]> getPdf(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
            Note note = noteRepository.findById(id)
                    .filter(n -> n.getUser().getId().equals(user.getId()))
                    .filter(n -> n.getFileType() == Note.FileType.PDF)
                    .orElseThrow(() -> new RuntimeException("PDF not found"));
            
            byte[] pdfBytes = Files.readAllBytes(Paths.get(note.getFilePath()));
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", note.getTitle() + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Hilfsmethode: Baue Baumstruktur
    private List<TreeNode> buildTree(List<Note> notes, Long parentId) {
        return notes.stream()
                .filter(n -> Objects.equals(n.getParentId(), parentId))
                .map(n -> {
                    TreeNode node = new TreeNode();
                    node.setId(n.getId());
                    node.setTitle(n.getTitle());
                    node.setType(n.getType().toString());
                    node.setFileType(n.getFileType().toString());
                    node.setFolderPath(n.getFolderPath());
                    node.setChildren(buildTree(notes, n.getId()));
                    return node;
                })
                .collect(Collectors.toList());
    }

    // DTO für Baumstruktur
    public static class TreeNode {
        private Long id;
        private String title;
        private String type;
        private String fileType;
        private String folderPath;
        private List<TreeNode> children;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        public String getFolderPath() { return folderPath; }
        public void setFolderPath(String folderPath) { this.folderPath = folderPath; }
        public List<TreeNode> getChildren() { return children; }
        public void setChildren(List<TreeNode> children) { this.children = children; }
    }
}
