-- School Management System: Timetable (Stundenplan)
-- Supports weekly recurring lessons and time slots

CREATE TABLE timetable_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Subject & Teacher
    subject VARCHAR(100) NOT NULL,
    teacher VARCHAR(100),
    room VARCHAR(50),
    
    -- Time
    day_of_week VARCHAR(20) NOT NULL, -- MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Additional Info
    notes TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI
    
    -- Validity Period
    valid_from DATE,
    valid_until DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_timetable_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Homework & Assignments
CREATE TABLE homework (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Dates
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, OVERDUE
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    
    -- Completion
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    
    -- Files & Links
    attachments JSONB, -- [{name: "...", url: "...", type: "..."}]
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_homework_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exams & Tests
CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    exam_type VARCHAR(50), -- KLAUSUR, TEST, KLASSENARBEIT, MÜNDLICH
    
    -- Date & Time
    exam_date DATE NOT NULL,
    start_time TIME,
    duration_minutes INTEGER,
    room VARCHAR(50),
    
    -- Content
    topics TEXT[], -- Array of topics to study
    notes TEXT,
    
    -- Result
    grade DECIMAL(3,2), -- German system: 1.0 - 6.0
    points INTEGER,
    max_points INTEGER,
    
    -- Preparation
    study_time_minutes INTEGER DEFAULT 0,
    confidence_level INTEGER, -- 1-5 scale
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_exams_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Grades Management
CREATE TABLE grades (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    subject VARCHAR(100) NOT NULL,
    
    -- Grade Details
    title VARCHAR(255) NOT NULL,
    grade_type VARCHAR(50), -- SCHRIFTLICH, MÜNDLICH, SONSTIGE, PROJEKT
    grade DECIMAL(3,2) NOT NULL, -- 1.0 - 6.0
    
    -- Points (optional)
    points INTEGER,
    max_points INTEGER,
    percentage DECIMAL(5,2),
    
    -- Weight
    weight DECIMAL(3,2) DEFAULT 1.0, -- For weighted average calculation
    
    -- Date
    received_date DATE NOT NULL,
    
    -- Notes
    notes TEXT,
    teacher VARCHAR(100),
    
    -- Semester
    semester VARCHAR(20), -- z.B. "WS 2024/25", "SS 2025"
    school_year VARCHAR(20), -- z.B. "2024/2025"
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_grades_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Study Sessions (Lernzeiten)
CREATE TABLE study_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255),
    
    -- Time
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    
    -- Content
    notes TEXT,
    methods TEXT[], -- LESEN, ZUSAMMENFASSUNG, KARTEIKARTEN, ÜBUNGEN, etc.
    
    -- Quality
    effectiveness_rating INTEGER, -- 1-5 scale
    focus_level INTEGER, -- 1-5 scale
    
    -- Goals
    goal_achieved BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_study_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- School Subjects (Fächer-Verwaltung)
CREATE TABLE school_subjects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(10), -- z.B. "Mathe", "Bio"
    teacher VARCHAR(100),
    room VARCHAR(50),
    
    -- Visual
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    
    -- Details
    hours_per_week DECIMAL(3,1),
    credit_points INTEGER,
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    semester VARCHAR(20),
    
    -- Goals
    target_grade DECIMAL(3,2),
    current_average DECIMAL(3,2),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_subjects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_subject_name_user UNIQUE(user_id, name)
);

-- Absences (Fehlzeiten)
CREATE TABLE absences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    absence_date DATE NOT NULL,
    subject VARCHAR(100),
    
    -- Type
    absence_type VARCHAR(20) DEFAULT 'SICK', -- SICK, EXCUSED, UNEXCUSED, LATE
    
    -- Duration
    periods INTEGER DEFAULT 1, -- Number of periods/hours missed
    all_day BOOLEAN DEFAULT FALSE,
    
    -- Status
    excused BOOLEAN DEFAULT FALSE,
    excuse_note_submitted BOOLEAN DEFAULT FALSE,
    
    -- Notes
    reason TEXT,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_absences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_timetable_user_day ON timetable_entries(user_id, day_of_week);
CREATE INDEX idx_homework_user_due ON homework(user_id, due_date);
CREATE INDEX idx_homework_status ON homework(status);
CREATE INDEX idx_exams_user_date ON exams(user_id, exam_date);
CREATE INDEX idx_grades_user_subject ON grades(user_id, subject);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id, start_time);
CREATE INDEX idx_subjects_user ON school_subjects(user_id);
CREATE INDEX idx_absences_user_date ON absences(user_id, absence_date);
