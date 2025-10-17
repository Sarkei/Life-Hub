package com.lifehub.security;

import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import com.lifehub.service.FileStorageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");
        
        // Finde oder erstelle User
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .username(email.split("@")[0])
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
                        System.err.println("Failed to create directories for OAuth2 user: " + e.getMessage());
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

        // Redirect zum Frontend mit Token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost")
                .queryParam("token", token)
                .queryParam("userId", user.getId())
                .queryParam("username", user.getUsername())
                .queryParam("email", user.getEmail())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
