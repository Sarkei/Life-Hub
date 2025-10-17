package com.lifehub.service;

import com.lifehub.model.User;
import com.lifehub.model.UserProfile;
import com.lifehub.model.UserSettings;
import com.lifehub.model.SidebarConfig;
import com.lifehub.repository.UserRepository;
import com.lifehub.repository.UserProfileRepository;
import com.lifehub.repository.UserSettingsRepository;
import com.lifehub.repository.SidebarConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final SidebarConfigRepository sidebarConfigRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registriert einen neuen User mit Default-Einstellungen
     */
    @Transactional
    public User registerUser(String username, String email, String password) {
        log.info("🔵 Registering new user: {}", username);
        
        // 1. Prüfe ob User bereits existiert
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        
        // 2. Erstelle User
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .provider("local")
                .enabled(true)
                .build();
        
        user = userRepository.save(user);
        log.info("✅ User created with ID: {}", user.getId());
        
        // 3. Erstelle Default Settings
        createDefaultUserSettings(user.getId());
        
        // 4. Erstelle leeres Profile
        createDefaultUserProfile(user.getId());
        
        // 5. Erstelle Default Sidebar Config
        createDefaultSidebarConfig(user.getId());
        
        log.info("✅ User registration complete for: {}", username);
        return user;
    }

    /**
     * Login: Prüft Credentials und lädt User-Daten
     */
    public Optional<User> loginUser(String usernameOrEmail, String password) {
        log.info("🔵 Login attempt for: {}", usernameOrEmail);
        
        // Suche User (entweder username oder email)
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }
        
        if (userOpt.isEmpty()) {
            log.warn("❌ User not found: {}", usernameOrEmail);
            return Optional.empty();
        }
        
        User user = userOpt.get();
        
        // Prüfe Password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.warn("❌ Invalid password for user: {}", usernameOrEmail);
            return Optional.empty();
        }
        
        // Prüfe ob Account enabled
        if (!user.getEnabled()) {
            log.warn("❌ Account disabled: {}", usernameOrEmail);
            return Optional.empty();
        }
        
        log.info("✅ Login successful for: {}", user.getUsername());
        return Optional.of(user);
    }

    /**
     * Lädt alle User-Daten auf einmal (Settings, Profile, Sidebar)
     */
    @Transactional(readOnly = true)
    public UserDataDTO loadUserData(Long userId) {
        log.info("🔵 Loading user data for userId: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultUserSettings(userId));
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultUserProfile(userId));
        
        SidebarConfig sidebar = sidebarConfigRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSidebarConfig(userId));
        
        return new UserDataDTO(user, settings, profile, sidebar);
    }

    /**
     * Erstellt Default User Settings
     */
    private UserSettings createDefaultUserSettings(Long userId) {
        log.info("🔧 Creating default settings for userId: {}", userId);
        
        UserSettings settings = UserSettings.builder()
                .userId(userId)
                .theme("system")
                .language("de")
                .emailNotifications(true)
                .pushNotifications(false)
                .notificationSound(true)
                .profileVisible(true)
                .showOnlineStatus(true)
                .timezone("Europe/Berlin")
                .dateFormat("DD.MM.YYYY")
                .timeFormat("24h")
                .firstDayOfWeek(1)
                .build();
        
        return userSettingsRepository.save(settings);
    }

    /**
     * Erstellt leeres User Profile
     */
    private UserProfile createDefaultUserProfile(Long userId) {
        log.info("🔧 Creating default profile for userId: {}", userId);
        
        UserProfile profile = UserProfile.builder()
                .userId(userId)
                .build();
        
        return userProfileRepository.save(profile);
    }

    /**
     * Erstellt Default Sidebar Config
     */
    private SidebarConfig createDefaultSidebarConfig(Long userId) {
        log.info("🔧 Creating default sidebar config for userId: {}", userId);
        
        SidebarConfig config = SidebarConfig.builder()
                .userId(userId)
                // Defaults sind bereits im Entity mit @Builder.Default definiert
                .build();
        
        return sidebarConfigRepository.save(config);
    }

    /**
     * Update User Settings
     */
    @Transactional
    public UserSettings updateUserSettings(Long userId, UserSettings newSettings) {
        log.info("🔧 Updating settings for userId: {}", userId);
        
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Settings not found for userId: " + userId));
        
        // Update fields
        settings.setTheme(newSettings.getTheme());
        settings.setLanguage(newSettings.getLanguage());
        settings.setEmailNotifications(newSettings.getEmailNotifications());
        settings.setPushNotifications(newSettings.getPushNotifications());
        settings.setNotificationSound(newSettings.getNotificationSound());
        settings.setProfileVisible(newSettings.getProfileVisible());
        settings.setShowOnlineStatus(newSettings.getShowOnlineStatus());
        settings.setTimezone(newSettings.getTimezone());
        settings.setDateFormat(newSettings.getDateFormat());
        settings.setTimeFormat(newSettings.getTimeFormat());
        settings.setFirstDayOfWeek(newSettings.getFirstDayOfWeek());
        
        return userSettingsRepository.save(settings);
    }

    /**
     * Update User Profile
     */
    @Transactional
    public UserProfile updateUserProfile(Long userId, UserProfile newProfile) {
        log.info("🔧 Updating profile for userId: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for userId: " + userId));
        
        // Update fields
        profile.setFirstName(newProfile.getFirstName());
        profile.setLastName(newProfile.getLastName());
        profile.setDisplayName(newProfile.getDisplayName());
        profile.setBio(newProfile.getBio());
        profile.setAvatarUrl(newProfile.getAvatarUrl());
        profile.setAddress(newProfile.getAddress());
        profile.setCity(newProfile.getCity());
        profile.setPostalCode(newProfile.getPostalCode());
        profile.setCountry(newProfile.getCountry());
        profile.setDateOfBirth(newProfile.getDateOfBirth());
        profile.setGender(newProfile.getGender());
        profile.setOccupation(newProfile.getOccupation());
        profile.setWebsite(newProfile.getWebsite());
        
        return userProfileRepository.save(profile);
    }

    /**
     * Prüfe ob Username existiert
     */
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Prüfe ob Email existiert
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * DTO für komplette User-Daten
     */
    public record UserDataDTO(
            User user,
            UserSettings settings,
            UserProfile profile,
            SidebarConfig sidebar
    ) {}
}
