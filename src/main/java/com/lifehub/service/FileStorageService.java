package com.lifehub.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Service
@Slf4j
public class FileStorageService {

    @Value("${notes.storage.path:/app/data}")
    private String storageBasePath;

    /**
     * Erstellt beim User-Registrieren die Ordnerstruktur: username/privat, username/arbeit, username/schule
     */
    public void createUserDirectories(String username) {
        try {
            String[] categories = {"privat", "arbeit", "schule"};
            for (String category : categories) {
                Path categoryPath = Paths.get(storageBasePath, username, category);
                if (!Files.exists(categoryPath)) {
                    Files.createDirectories(categoryPath);
                    log.info("Created directory: {}", categoryPath);
                }
            }
        } catch (IOException e) {
            log.error("Failed to create user directories for {}: {}", username, e.getMessage());
            throw new RuntimeException("Could not create user directories", e);
        }
    }

    /**
     * Speichert eine Notiz als .md Datei im passenden Ordner
     */
    public String saveNoteFile(String username, String category, String filename, String content) {
        try {
            // Sicherstellen, dass der Dateiname .md endet
            if (!filename.endsWith(".md")) {
                filename = filename + ".md";
            }
            
            // Ordner erstellen falls nicht vorhanden
            Path categoryPath = Paths.get(storageBasePath, username, category);
            if (!Files.exists(categoryPath)) {
                Files.createDirectories(categoryPath);
            }

            Path filePath = categoryPath.resolve(filename);
            Files.writeString(filePath, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            
            log.info("Saved note file: {}", filePath);
            return filePath.toString();
        } catch (IOException e) {
            log.error("Failed to save note file {}/{}/{}: {}", username, category, filename, e.getMessage());
            throw new RuntimeException("Could not save note file", e);
        }
    }

    /**
     * Liest eine Notiz-Datei
     */
    public String readNoteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (!Files.exists(path)) {
                log.warn("Note file not found: {}", filePath);
                return "";
            }
            return Files.readString(path);
        } catch (IOException e) {
            log.error("Failed to read note file {}: {}", filePath, e.getMessage());
            throw new RuntimeException("Could not read note file", e);
        }
    }

    /**
     * Löscht eine Notiz-Datei
     */
    public void deleteNoteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                log.info("Deleted note file: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Failed to delete note file {}: {}", filePath, e.getMessage());
            throw new RuntimeException("Could not delete note file", e);
        }
    }

    /**
     * Aktualisiert eine Notiz-Datei
     */
    public void updateNoteFile(String filePath, String content) {
        try {
            Path path = Paths.get(filePath);
            Files.writeString(path, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("Updated note file: {}", filePath);
        } catch (IOException e) {
            log.error("Failed to update note file {}: {}", filePath, e.getMessage());
            throw new RuntimeException("Could not update note file", e);
        }
    }

    // ============================================
    // SCHUL-SYSTEM FILE OPERATIONS
    // ============================================

    /**
     * Erstellt Schul-Verzeichnis-Struktur für einen User
     */
    public void initializeSchoolDirectories(String username) {
        try {
            String schoolPath = storageBasePath + "/" + username + "/Schule";
            
            createDirectoryIfNotExists(schoolPath + "/Notizen");
            createDirectoryIfNotExists(schoolPath + "/Materialien");
            createDirectoryIfNotExists(schoolPath + "/Abgaben");
            createDirectoryIfNotExists(schoolPath + "/Projekte");
            createDirectoryIfNotExists(schoolPath + "/Zusammenfassungen");
            
            log.info("Initialized school directories for user: {}", username);
        } catch (IOException e) {
            log.error("Failed to initialize school directories for user: {}", username, e);
            throw new RuntimeException("Could not initialize school directories", e);
        }
    }

    /**
     * Erstelle Notizen-Ordner
     */
    public String createSchoolNoteFolder(String username, String folderName, String parentPath) {
        try {
            String basePath = storageBasePath + "/" + username + "/Schule/Notizen";
            String fullPath = parentPath != null && !parentPath.isEmpty()
                ? basePath + "/" + parentPath + "/" + sanitizeFolderName(folderName)
                : basePath + "/" + sanitizeFolderName(folderName);
            
            createDirectoryIfNotExists(fullPath);
            
            // Relativer Pfad zurückgeben
            return fullPath.replace(basePath + "/", "");
        } catch (IOException e) {
            log.error("Failed to create note folder", e);
            throw new RuntimeException("Could not create note folder", e);
        }
    }

    /**
     * Speichere Schul-Notiz als Markdown
     */
    public String saveSchoolNote(String username, String folderPath, String title, String content) {
        try {
            String basePath = storageBasePath + "/" + username + "/Schule/Notizen";
            String fileName = sanitizeFileName(title) + ".md";
            
            String fullPath = folderPath != null && !folderPath.isEmpty()
                ? basePath + "/" + folderPath + "/" + fileName
                : basePath + "/" + fileName;
            
            Path path = Paths.get(fullPath);
            
            // Parent directory erstellen falls nötig
            if (path.getParent() != null && !Files.exists(path.getParent())) {
                Files.createDirectories(path.getParent());
            }
            
            Files.writeString(path, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            
            log.info("Saved school note: {}", fullPath);
            
            // Relativer Pfad zurückgeben
            return fullPath.replace(basePath + "/", "");
        } catch (IOException e) {
            log.error("Failed to save school note", e);
            throw new RuntimeException("Could not save school note", e);
        }
    }

    /**
     * Lese Schul-Notiz
     */
    public String readSchoolNote(String username, String relativePath) {
        try {
            String fullPath = storageBasePath + "/" + username + "/Schule/Notizen/" + relativePath;
            Path path = Paths.get(fullPath);
            
            if (!Files.exists(path)) {
                log.warn("School note not found: {}", fullPath);
                return "";
            }
            
            return Files.readString(path);
        } catch (IOException e) {
            log.error("Failed to read school note", e);
            throw new RuntimeException("Could not read school note", e);
        }
    }

    /**
     * Lösche Schul-Notiz
     */
    public void deleteSchoolNote(String username, String relativePath) {
        try {
            String fullPath = storageBasePath + "/" + username + "/Schule/Notizen/" + relativePath;
            Files.deleteIfExists(Paths.get(fullPath));
            log.info("Deleted school note: {}", fullPath);
        } catch (IOException e) {
            log.error("Failed to delete school note", e);
            throw new RuntimeException("Could not delete school note", e);
        }
    }

    /**
     * Lösche Notizen-Ordner (rekursiv)
     */
    public void deleteSchoolNoteFolder(String username, String relativePath) {
        try {
            String fullPath = storageBasePath + "/" + username + "/Schule/Notizen/" + relativePath;
            Path path = Paths.get(fullPath);
            
            if (Files.exists(path)) {
                Files.walk(path)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            log.error("Failed to delete: {}", p, e);
                        }
                    });
                log.info("Deleted school note folder: {}", fullPath);
            }
        } catch (IOException e) {
            log.error("Failed to delete school note folder", e);
            throw new RuntimeException("Could not delete school note folder", e);
        }
    }

    // ============================================
    // Helper Methods
    // ============================================

    private void createDirectoryIfNotExists(String path) throws IOException {
        Path dirPath = Paths.get(path);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }
    }

    private String sanitizeFolderName(String name) {
        return name.replaceAll("[^a-zA-Z0-9äöüÄÖÜß_\\-\\s]", "")
                   .replaceAll("\\s+", "_")
                   .trim();
    }

    private String sanitizeFileName(String name) {
        return name.replaceAll("[^a-zA-Z0-9äöüÄÖÜß_\\-\\s]", "")
                   .replaceAll("\\s+", "_")
                   .trim();
    }
}
