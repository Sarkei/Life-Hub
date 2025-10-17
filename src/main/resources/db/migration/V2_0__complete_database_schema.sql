-- ============================================
-- LIFE HUB - COMPLETE DATABASE SCHEMA
-- Version: 2.0 (Clean Database-First Approach)
-- ============================================

-- ============================================
-- 1. USER MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255), -- NULL für OAuth2 Users
    provider VARCHAR(50) DEFAULT 'local', -- local, google, github
    provider_id VARCHAR(255),
    phone_number VARCHAR(50),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Appearance
    theme VARCHAR(20) DEFAULT 'system', -- system, light, dark
    language VARCHAR(10) DEFAULT 'de', -- de, en
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    notification_sound BOOLEAN DEFAULT TRUE,
    
    -- Privacy
    profile_visible BOOLEAN DEFAULT TRUE,
    show_online_status BOOLEAN DEFAULT TRUE,
    
    -- Preferences
    timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
    date_format VARCHAR(20) DEFAULT 'DD.MM.YYYY',
    time_format VARCHAR(10) DEFAULT '24h',
    first_day_of_week INT DEFAULT 1, -- 0=Sunday, 1=Monday
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal Info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    
    -- Contact
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Additional
    date_of_birth DATE,
    gender VARCHAR(20),
    occupation VARCHAR(100),
    website VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. SIDEBAR CONFIGURATION
-- ============================================

CREATE TABLE sidebar_config (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- General
    show_dashboard BOOLEAN DEFAULT TRUE,
    show_todos BOOLEAN DEFAULT TRUE,
    show_calendar BOOLEAN DEFAULT TRUE,
    show_contacts BOOLEAN DEFAULT FALSE,
    show_profile BOOLEAN DEFAULT TRUE,
    
    -- Private
    show_fitness BOOLEAN DEFAULT TRUE,
    show_weight BOOLEAN DEFAULT TRUE,
    show_nutrition BOOLEAN DEFAULT TRUE,
    show_goals BOOLEAN DEFAULT FALSE,
    show_diary BOOLEAN DEFAULT FALSE,
    show_shopping BOOLEAN DEFAULT FALSE,
    show_health BOOLEAN DEFAULT FALSE,
    show_travel BOOLEAN DEFAULT FALSE,
    show_movies BOOLEAN DEFAULT FALSE,
    show_music BOOLEAN DEFAULT FALSE,
    show_photos BOOLEAN DEFAULT FALSE,
    show_quick_notes BOOLEAN DEFAULT FALSE,
    show_habits BOOLEAN DEFAULT FALSE,
    show_budget BOOLEAN DEFAULT FALSE,
    
    -- Work
    show_time_tracking BOOLEAN DEFAULT FALSE,
    show_statistics BOOLEAN DEFAULT FALSE,
    show_news BOOLEAN DEFAULT FALSE,
    show_projects BOOLEAN DEFAULT FALSE,
    
    -- School - Main
    show_school BOOLEAN DEFAULT TRUE,
    
    -- School - Features (alle als Untermenü)
    show_school_overview BOOLEAN DEFAULT TRUE,
    show_school_notes BOOLEAN DEFAULT TRUE,
    show_school_timetable BOOLEAN DEFAULT TRUE,
    show_school_subjects BOOLEAN DEFAULT TRUE,
    show_school_homework BOOLEAN DEFAULT TRUE,
    show_school_exams BOOLEAN DEFAULT TRUE,
    show_school_grades BOOLEAN DEFAULT TRUE,
    show_school_materials BOOLEAN DEFAULT TRUE,
    show_school_submissions BOOLEAN DEFAULT TRUE,
    show_school_projects BOOLEAN DEFAULT FALSE,
    show_school_flashcards BOOLEAN DEFAULT FALSE,
    show_school_summaries BOOLEAN DEFAULT FALSE,
    show_school_study_sessions BOOLEAN DEFAULT TRUE,
    show_school_absences BOOLEAN DEFAULT TRUE,
    
    -- Sidebar State
    is_collapsed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TODOS & CALENDAR
-- ============================================

CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    status VARCHAR(20) DEFAULT 'TODO', -- TODO, IN_PROGRESS, DONE
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    category VARCHAR(50) DEFAULT 'PERSONAL', -- PERSONAL, WORK, SCHOOL
    
    due_date DATE,
    completed_at TIMESTAMP,
    
    is_favorite BOOLEAN DEFAULT FALSE,
    tags TEXT, -- Comma-separated
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_user_status ON todos(user_id, status);
CREATE INDEX idx_todos_due_date ON todos(due_date);

CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    
    location VARCHAR(255),
    category VARCHAR(50) DEFAULT 'PERSONAL', -- PERSONAL, WORK, SCHOOL
    color VARCHAR(20) DEFAULT '#3B82F6',
    
    status VARCHAR(20) DEFAULT 'CONFIRMED', -- CONFIRMED, TENTATIVE, CANCELLED
    
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- iCal RRULE format
    
    reminder_minutes INT, -- NULL = no reminder, z.B. 15, 30, 60
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_user_time ON calendar_events(user_id, start_time);

-- ============================================
-- 4. HEALTH & FITNESS
-- ============================================

CREATE TABLE weight_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    weight DECIMAL(5, 2) NOT NULL, -- kg
    date DATE NOT NULL,
    time_of_day VARCHAR(20), -- morning, evening
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, date, time_of_day)
);

CREATE INDEX idx_weight_user_date ON weight_logs(user_id, date DESC);

CREATE TABLE meal_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    meal_type VARCHAR(20) NOT NULL, -- breakfast, lunch, dinner, snack
    food_name VARCHAR(255) NOT NULL,
    
    calories INT,
    protein DECIMAL(6, 2),
    carbs DECIMAL(6, 2),
    fat DECIMAL(6, 2),
    
    portion_size VARCHAR(100),
    notes TEXT,
    
    meal_date DATE NOT NULL,
    meal_time TIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meals_user_date ON meal_logs(user_id, meal_date DESC);

CREATE TABLE fitness_workouts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    workout_type VARCHAR(50), -- strength, cardio, flexibility, sports
    
    duration_minutes INT,
    calories_burned INT,
    
    notes TEXT,
    workout_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fitness_exercises (
    id BIGSERIAL PRIMARY KEY,
    workout_id BIGINT NOT NULL REFERENCES fitness_workouts(id) ON DELETE CASCADE,
    
    exercise_name VARCHAR(255) NOT NULL,
    sets INT,
    reps INT,
    weight DECIMAL(6, 2), -- kg
    duration_seconds INT,
    
    notes TEXT,
    order_index INT DEFAULT 0
);

-- ============================================
-- 5. SCHOOL SYSTEM
-- ============================================

-- 5.1 Subjects (Fächer)
CREATE TABLE school_subjects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    teacher_name VARCHAR(255),
    room VARCHAR(50),
    color VARCHAR(20) DEFAULT '#3B82F6',
    
    description TEXT,
    semester VARCHAR(50),
    credits INT,
    
    is_active BOOLEAN DEFAULT TRUE,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_user ON school_subjects(user_id);

-- 5.2 Timetable (Stundenplan)
CREATE TABLE school_timetable (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE CASCADE,
    
    day_of_week INT NOT NULL, -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    room VARCHAR(50),
    teacher VARCHAR(255),
    
    notes TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timetable_user_day ON school_timetable(user_id, day_of_week);

-- 5.3 Homework (Hausaufgaben)
CREATE TABLE school_homework (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    due_date DATE NOT NULL,
    estimated_duration_minutes INT,
    
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_homework_user_date ON school_homework(user_id, due_date);

-- 5.4 Exams (Prüfungen)
CREATE TABLE school_exams (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME,
    duration_minutes INT,
    
    location VARCHAR(255),
    exam_type VARCHAR(50), -- written, oral, practical, project
    
    topics TEXT,
    preparation_notes TEXT,
    
    grade DECIMAL(3, 2),
    max_points DECIMAL(6, 2),
    achieved_points DECIMAL(6, 2),
    
    is_graded BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_user_date ON school_exams(user_id, exam_date);

-- 5.5 Grades (Noten)
CREATE TABLE school_grades (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE CASCADE,
    exam_id BIGINT REFERENCES school_exams(id) ON DELETE SET NULL,
    
    grade_value DECIMAL(3, 2) NOT NULL, -- 1.0 - 6.0
    grade_type VARCHAR(50), -- exam, oral, homework, project, final
    
    weight DECIMAL(3, 2) DEFAULT 1.0, -- Gewichtung für Durchschnitt
    
    title VARCHAR(255),
    description TEXT,
    received_date DATE,
    
    max_points DECIMAL(6, 2),
    achieved_points DECIMAL(6, 2),
    percentage DECIMAL(5, 2),
    
    semester VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grades_user_subject ON school_grades(user_id, subject_id);

-- 5.6 Notes & Folders (Notizen)
CREATE TABLE school_note_folders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_folder_id BIGINT REFERENCES school_note_folders(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    color VARCHAR(20) DEFAULT '#6B7280',
    icon VARCHAR(50),
    
    physical_path VARCHAR(500) NOT NULL, -- Relativer Pfad
    
    order_index INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_note_folders_user ON school_note_folders(user_id);
CREATE INDEX idx_note_folders_parent ON school_note_folders(parent_folder_id);

CREATE TABLE school_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    folder_id BIGINT REFERENCES school_note_folders(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    content TEXT, -- Markdown content
    
    physical_path VARCHAR(500) NOT NULL,
    file_size BIGINT, -- bytes
    
    tags TEXT, -- Comma-separated
    is_favorite BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    
    last_opened_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_user ON school_notes(user_id);
CREATE INDEX idx_notes_folder ON school_notes(folder_id);
CREATE INDEX idx_notes_subject ON school_notes(subject_id);
CREATE INDEX idx_notes_favorite ON school_notes(is_favorite);

-- 5.7 Materials (Unterrichtsmaterialien)
CREATE TABLE school_materials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- pdf, docx, pptx, jpg, etc.
    file_size BIGINT, -- bytes
    mime_type VARCHAR(100),
    
    physical_path VARCHAR(500) NOT NULL,
    download_url VARCHAR(500),
    
    category VARCHAR(50), -- slides, script, exercise, solution, other
    
    tags TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_user ON school_materials(user_id);
CREATE INDEX idx_materials_subject ON school_materials(subject_id);

-- 5.8 Submissions (Abgaben)
CREATE TABLE school_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    due_date TIMESTAMP NOT NULL,
    submission_type VARCHAR(50), -- assignment, project, essay, presentation
    
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, SUBMITTED, GRADED, LATE
    
    submitted_at TIMESTAMP,
    graded_at TIMESTAMP,
    
    grade DECIMAL(3, 2),
    max_points DECIMAL(6, 2),
    achieved_points DECIMAL(6, 2),
    
    file_name VARCHAR(255),
    physical_path VARCHAR(500),
    
    teacher_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_user ON school_submissions(user_id);
CREATE INDEX idx_submissions_status ON school_submissions(status);
CREATE INDEX idx_submissions_due ON school_submissions(due_date);

-- 5.9 Projects (Schulprojekte)
CREATE TABLE school_projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    start_date DATE,
    due_date DATE,
    
    status VARCHAR(20) DEFAULT 'PLANNING', -- PLANNING, IN_PROGRESS, REVIEW, COMPLETED
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    progress INT DEFAULT 0, -- 0-100%
    
    grade DECIMAL(3, 2),
    
    project_folder VARCHAR(500), -- Physischer Ordner
    
    tags TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_project_milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES school_projects(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    
    order_index INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_project_files (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES school_projects(id) ON DELETE CASCADE,
    
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    physical_path VARCHAR(500) NOT NULL,
    
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.10 Flashcards (Lernkarten)
CREATE TABLE school_flashcard_decks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    card_count INT DEFAULT 0,
    
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_flashcards (
    id BIGSERIAL PRIMARY KEY,
    deck_id BIGINT NOT NULL REFERENCES school_flashcard_decks(id) ON DELETE CASCADE,
    
    front TEXT NOT NULL, -- Frage
    back TEXT NOT NULL, -- Antwort
    hint TEXT,
    
    difficulty VARCHAR(20) DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    
    last_reviewed TIMESTAMP,
    review_count INT DEFAULT 0,
    success_count INT DEFAULT 0,
    
    order_index INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.11 Summaries (Zusammenfassungen)
CREATE TABLE school_summaries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    content TEXT, -- Markdown
    
    chapter VARCHAR(255),
    topic VARCHAR(255),
    
    physical_path VARCHAR(500),
    
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.12 Study Sessions (Lernzeiten)
CREATE TABLE school_study_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    title VARCHAR(255),
    description TEXT,
    
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INT,
    
    location VARCHAR(255),
    study_type VARCHAR(50), -- solo, group, tutoring
    
    notes TEXT,
    productivity_rating INT, -- 1-5
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_sessions_user ON school_study_sessions(user_id);
CREATE INDEX idx_study_sessions_subject ON school_study_sessions(subject_id);

-- 5.13 Absences (Fehlzeiten)
CREATE TABLE school_absences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    
    absence_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    
    reason VARCHAR(255),
    description TEXT,
    
    absence_type VARCHAR(20) DEFAULT 'SICK', -- SICK, EXCUSED, UNEXCUSED, VACATION
    
    is_excused BOOLEAN DEFAULT FALSE,
    certificate_required BOOLEAN DEFAULT FALSE,
    certificate_submitted BOOLEAN DEFAULT FALSE,
    
    teacher_notified BOOLEAN DEFAULT FALSE,
    parent_notified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_absences_user ON school_absences(user_id);
CREATE INDEX idx_absences_date ON school_absences(absence_date);

-- ============================================
-- 6. CONTACTS
-- ============================================

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255),
    
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    
    company VARCHAR(255),
    job_title VARCHAR(255),
    
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    birthday DATE,
    notes TEXT,
    
    category VARCHAR(50) DEFAULT 'PERSONAL', -- PERSONAL, WORK, SCHOOL, FAMILY
    
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_user ON contacts(user_id);

-- ============================================
-- 7. DASHBOARD WIDGETS
-- ============================================

CREATE TABLE dashboard_widgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    widget_type VARCHAR(50) NOT NULL, -- upcoming_events, recent_todos, quick_stats, weather, etc.
    
    position_x INT DEFAULT 0,
    position_y INT DEFAULT 0,
    width INT DEFAULT 1,
    height INT DEFAULT 1,
    
    is_visible BOOLEAN DEFAULT TRUE,
    
    config JSONB, -- Widget-spezifische Konfiguration
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. STATISTICS & TRACKING
-- ============================================

CREATE TABLE activity_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL, -- login, logout, create_note, complete_todo, etc.
    entity_type VARCHAR(50), -- note, todo, event, etc.
    entity_id BIGINT,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user_date ON activity_log(user_id, created_at DESC);

-- ============================================
-- INDICES für Performance
-- ============================================

-- User Indices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Todo Indices
CREATE INDEX idx_todos_category ON todos(category);
CREATE INDEX idx_todos_priority ON todos(priority);

-- Calendar Indices  
CREATE INDEX idx_events_category ON calendar_events(category);

-- School Indices
CREATE INDEX idx_homework_status ON school_homework(status);
CREATE INDEX idx_exams_subject ON school_exams(subject_id);

-- ============================================
-- TRIGGERS für updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger auf alle Tabellen mit updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON user_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sidebar_config_updated_at BEFORE UPDATE ON sidebar_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- School Triggers
CREATE TRIGGER update_school_subjects_updated_at BEFORE UPDATE ON school_subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_homework_updated_at BEFORE UPDATE ON school_homework
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_exams_updated_at BEFORE UPDATE ON school_exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_note_folders_updated_at BEFORE UPDATE ON school_note_folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_notes_updated_at BEFORE UPDATE ON school_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_materials_updated_at BEFORE UPDATE ON school_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_submissions_updated_at BEFORE UPDATE ON school_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_projects_updated_at BEFORE UPDATE ON school_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS für Dokumentation
-- ============================================

COMMENT ON TABLE users IS 'Haupttabelle für Benutzer-Accounts';
COMMENT ON TABLE user_settings IS 'Benutzer-Einstellungen (Theme, Sprache, Notifications)';
COMMENT ON TABLE user_profile IS 'Erweiterte Profil-Informationen';
COMMENT ON TABLE sidebar_config IS 'Sidebar-Konfiguration pro User (welche Features sichtbar)';

COMMENT ON TABLE school_subjects IS 'Schulfächer mit Lehrer, Raum, Farbe';
COMMENT ON TABLE school_timetable IS 'Stundenplan-Einträge';
COMMENT ON TABLE school_homework IS 'Hausaufgaben mit Status und Priorität';
COMMENT ON TABLE school_exams IS 'Prüfungen mit Noten und Punkten';
COMMENT ON TABLE school_grades IS 'Alle Noten mit Gewichtung';
COMMENT ON TABLE school_notes IS 'Notizen in Markdown mit physischer Speicherung';
COMMENT ON TABLE school_materials IS 'Unterrichtsmaterialien (PDFs, etc.)';
COMMENT ON TABLE school_submissions IS 'Abgaben mit Status und Feedback';
COMMENT ON TABLE school_projects IS 'Schulprojekte mit Meilensteinen';
COMMENT ON TABLE school_flashcard_decks IS 'Lernkarten-Decks';
COMMENT ON TABLE school_flashcards IS 'Einzelne Lernkarten mit Spaced Repetition';
COMMENT ON TABLE school_summaries IS 'Zusammenfassungen in Markdown';
COMMENT ON TABLE school_study_sessions IS 'Lernzeiten-Tracking';
COMMENT ON TABLE school_absences IS 'Fehlzeiten-Tracking';
