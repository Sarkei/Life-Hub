package com.lifehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SidebarConfigResponse {
    // General Items
    private Boolean dashboard;
    private Boolean todos;
    private Boolean calendar;
    private Boolean contacts;

    // Private Items
    private Boolean fitness;
    private Boolean weight;
    private Boolean nutrition;
    private Boolean goals;
    private Boolean diary;
    private Boolean shopping;
    private Boolean health;
    private Boolean travel;
    private Boolean movies;
    private Boolean music;
    private Boolean photos;
    private Boolean quickNotes;

    // Work Items
    private Boolean timeTracking;
    private Boolean statistics;
    private Boolean news;
    private Boolean projects;

    // School Items
    private Boolean grades;
    private Boolean habits;
    private Boolean budget;
}
