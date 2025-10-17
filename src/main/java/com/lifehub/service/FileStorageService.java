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
}
