package com.lifehub.controller;

import com.lifehub.dto.AuthRequest;
import com.lifehub.dto.AuthResponse;
import com.lifehub.dto.RegisterRequest;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.security.JwtService;
import com.lifehub.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final FileStorageService fileStorageService;



    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Passwort-Richtlinie: Mindestens 8 Zeichen, ein Großbuchstabe, eine Zahl, ein Sonderzeichen
        String password = request.getPassword();
        if (!isPasswordValid(password)) {
            return ResponseEntity.badRequest().body("Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten.");
        }

        try {
            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(password))
                    .enabled(true)
                    .build();

            userRepository.save(user);
            
            // Erstelle User-Ordner beim Registrieren (privat, arbeit, schule)
            try {
                fileStorageService.createUserDirectories(user.getUsername());
            } catch (Exception e) {
                // Fehler loggen, aber Registrierung nicht abbrechen
                System.err.println("Failed to create user directories: " + e.getMessage());
            }

            return ResponseEntity.ok("Account erfolgreich erstellt. Bitte melden Sie sich nun an.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Registrierung fehlgeschlagen: " + e.getMessage());
        }
    }

    private boolean isPasswordValid(String password) {
        if (password == null || password.length() < 8) return false;
        boolean hasUpper = false, hasDigit = false, hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            if (Character.isDigit(c)) hasDigit = true;
            if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }
        return hasUpper && hasDigit && hasSpecial;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .userId(user.getId())
                .build());
    }
}
