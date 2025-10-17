package com.lifehub.controller;

import com.lifehub.model.Profile;
import com.lifehub.model.Settings;
import com.lifehub.repository.ProfileRepository;
import com.lifehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Profile>> getProfiles(Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(profileRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profileRequest, Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        
        Profile profile = Profile.builder()
                .name(profileRequest.getName())
                .avatarUrl(profileRequest.getAvatarUrl())
                .color(profileRequest.getColor() != null ? profileRequest.getColor() : "#6366f1")
                .user(user)
                .settings(Settings.builder()
                        .darkMode(true)
                        .language("de")
                        .timezone("Europe/Berlin")
                        .notifications(true)
                        .build())
                .build();
        
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable Long id, Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        var profile = profileRepository.findById(id).orElseThrow();
        
        if (!profile.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long id, @RequestBody Profile profileRequest, Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        var profile = profileRepository.findById(id).orElseThrow();
        
        if (!profile.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        profile.setName(profileRequest.getName());
        profile.setAvatarUrl(profileRequest.getAvatarUrl());
        profile.setColor(profileRequest.getColor());
        if (profileRequest.getSettings() != null) {
            profile.setSettings(profileRequest.getSettings());
        }
        
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id, Authentication authentication) {
        var user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        var profile = profileRepository.findById(id).orElseThrow();
        
        if (!profile.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        profileRepository.delete(profile);
        return ResponseEntity.noContent().build();
    }
}
