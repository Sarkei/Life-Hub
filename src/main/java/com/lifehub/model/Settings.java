package com.lifehub.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Settings {

    @Builder.Default
    private Boolean darkMode = true; // Dark mode is default

    @Builder.Default
    private String language = "de";

    @Builder.Default
    private String timezone = "Europe/Berlin";

    @Builder.Default
    private Boolean notifications = true;
}
