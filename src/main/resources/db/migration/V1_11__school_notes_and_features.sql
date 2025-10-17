-- V1_11: Erweiterte Schul-Features: Notizen, Materialien, Abgaben, Projekte

-- ============================================
-- NOTIZEN-SYSTEM (mit Ordner-Struktur)
-- ============================================

CREATE TABLE school_note_folders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_folder_id BIGINT REFERENCES school_note_folders(id) ON DELETE CASCADE,
    physical_path VARCHAR(500) NOT NULL, -- /volume1/docker/Life-Hub-Data/{username}/Schule/Notizen/{path}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_folder_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE school_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    folder_id BIGINT REFERENCES school_note_folders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT, -- Markdown content
    physical_path VARCHAR(500) NOT NULL, -- /volume1/docker/Life-Hub-Data/{username}/Schule/Notizen/{folder}/{filename}.md
    tags VARCHAR(500), -- Comma-separated tags
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- MATERIALIEN-SYSTEM (Dateien-Upload)
-- ============================================

CREATE TABLE school_materials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- pdf, docx, xlsx, pptx, jpg, png, etc.
    file_size BIGINT, -- in bytes
    physical_path VARCHAR(500) NOT NULL, -- /volume1/docker/Life-Hub-Data/{username}/Schule/Materialien/{subject}/{filename}
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags VARCHAR(500),
    is_favorite BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_material_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- ABGABEN-SYSTEM
-- ============================================

CREATE TABLE school_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, SUBMITTED, GRADED
    grade DECIMAL(3, 1), -- z.B. 1.7, 2.3, etc.
    submission_date TIMESTAMP,
    file_name VARCHAR(255),
    physical_path VARCHAR(500), -- /volume1/docker/Life-Hub-Data/{username}/Schule/Abgaben/{subject}/{filename}
    teacher_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- PROJEKTE-SYSTEM
-- ============================================

CREATE TABLE school_projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'PLANNING', -- PLANNING, IN_PROGRESS, REVIEW, COMPLETED
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    grade DECIMAL(3, 1),
    project_folder VARCHAR(500), -- /volume1/docker/Life-Hub-Data/{username}/Schule/Projekte/{project-name}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE school_project_milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_milestone_project FOREIGN KEY (project_id) REFERENCES school_projects(id) ON DELETE CASCADE
);

CREATE TABLE school_project_files (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    physical_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_file FOREIGN KEY (project_id) REFERENCES school_projects(id) ON DELETE CASCADE
);

-- ============================================
-- LERNKARTEN-SYSTEM (Flashcards)
-- ============================================

CREATE TABLE school_flashcard_decks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    card_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_deck_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE school_flashcards (
    id BIGSERIAL PRIMARY KEY,
    deck_id BIGINT NOT NULL,
    front TEXT NOT NULL, -- Frage
    back TEXT NOT NULL, -- Antwort
    hint TEXT,
    difficulty VARCHAR(20) DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    last_reviewed TIMESTAMP,
    review_count INT DEFAULT 0,
    success_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_card_deck FOREIGN KEY (deck_id) REFERENCES school_flashcard_decks(id) ON DELETE CASCADE
);

-- ============================================
-- ZUSAMMENFASSUNGEN
-- ============================================

CREATE TABLE school_summaries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subject_id BIGINT REFERENCES school_subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT, -- Markdown
    chapter VARCHAR(255),
    physical_path VARCHAR(500), -- Optional: als PDF exportieren
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_summary_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDICES für Performance
-- ============================================

CREATE INDEX idx_note_folders_user ON school_note_folders(user_id);
CREATE INDEX idx_note_folders_parent ON school_note_folders(parent_folder_id);
CREATE INDEX idx_notes_user ON school_notes(user_id);
CREATE INDEX idx_notes_folder ON school_notes(folder_id);
CREATE INDEX idx_notes_favorite ON school_notes(is_favorite);

CREATE INDEX idx_materials_user ON school_materials(user_id);
CREATE INDEX idx_materials_subject ON school_materials(subject_id);
CREATE INDEX idx_materials_favorite ON school_materials(is_favorite);

CREATE INDEX idx_submissions_user ON school_submissions(user_id);
CREATE INDEX idx_submissions_subject ON school_submissions(subject_id);
CREATE INDEX idx_submissions_status ON school_submissions(status);
CREATE INDEX idx_submissions_due_date ON school_submissions(due_date);

CREATE INDEX idx_projects_user ON school_projects(user_id);
CREATE INDEX idx_projects_subject ON school_projects(subject_id);
CREATE INDEX idx_projects_status ON school_projects(status);

CREATE INDEX idx_flashcard_decks_user ON school_flashcard_decks(user_id);
CREATE INDEX idx_flashcards_deck ON school_flashcards(deck_id);

CREATE INDEX idx_summaries_user ON school_summaries(user_id);
CREATE INDEX idx_summaries_subject ON school_summaries(subject_id);
