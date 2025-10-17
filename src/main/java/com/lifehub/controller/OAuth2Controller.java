package com.lifehub.controller;

import com.lifehub.dto.AuthResponse;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.security.JwtService;
import com.lifehub.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final FileStorageService fileStorageService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @GetMapping("/google/callback")
    public RedirectView googleCallback(@AuthenticationPrincipal OAuth2User principal, OAuth2AuthenticationToken authentication) {
        if (principal == null) {
            return new RedirectView("/oauth2/callback?error=authentication_failed");
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String providerId = principal.getAttribute("sub");

        // Finde oder erstelle User
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(email.split("@")[0] + "_" + System.currentTimeMillis()) // Eindeutiger Username
                            .email(email)
                            .provider("google")
                            .providerId(providerId)
                            .enabled(true)
                            .build();
                    User savedUser = userRepository.save(newUser);

                    // Erstelle User-Ordner
                    try {
                        fileStorageService.createUserDirectories(savedUser.getUsername());
                    } catch (Exception e) {
                        System.err.println("Failed to create directories: " + e.getMessage());
                    }

                    return savedUser;
                });

        // Generiere JWT Token
        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password("")
                        .authorities("USER")
                        .build()
        );

        // Redirect zur Frontend Callback-Seite mit Token als Query Parameter
        return new RedirectView(String.format("/oauth2/callback?token=%s&userId=%d&username=%s&email=%s",
                token, user.getId(), user.getUsername(), user.getEmail()));
    }

    @PostMapping("/link-google")
    public ResponseEntity<?> linkGoogleAccount(@RequestBody Map<String, String> request, Authentication authentication) {
        String username = authentication.getName();
        String googleEmail = request.get("googleEmail");
        String googleProviderId = request.get("googleProviderId");

        User user = userRepository.findByUsername(username).orElseThrow();
        
        // Verknüpfe Google-Account
        user.setProvider("google");
        user.setProviderId(googleProviderId);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Google account linked successfully"));
    }
}
