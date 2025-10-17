package com.lifehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoteRequest {
    private String title;
    private String content;
    private String category; // privat, arbeit, schule
    private Long profileId;
}
