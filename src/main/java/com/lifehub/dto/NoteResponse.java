package com.lifehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String filePath;
    private Long userId;
    private Long profileId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
