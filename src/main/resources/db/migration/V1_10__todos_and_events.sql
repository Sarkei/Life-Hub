-- Todos & Calendar Events Tables

-- Todos Table
CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Organization
    category VARCHAR(50) NOT NULL, -- PRIVAT, ARBEIT, SCHULE
    priority VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    
    -- Status
    status VARCHAR(20) DEFAULT 'TODO', -- TODO, IN_PROGRESS, DONE
    completed BOOLEAN DEFAULT FALSE,
    
    -- Dates
    due_date DATE,
    completed_at TIMESTAMP,
    
    -- Metadata
    tags TEXT[], -- Array of tags
    color VARCHAR(7), -- Hex color for UI
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Calendar Events Table
CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Event Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    
    -- Time
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    all_day BOOLEAN DEFAULT FALSE,
    
    -- Organization
    category VARCHAR(50) NOT NULL, -- PRIVAT, ARBEIT, SCHULE, TRAINING (from training_plans)
    event_type VARCHAR(50), -- MEETING, APPOINTMENT, REMINDER, BIRTHDAY, HOLIDAY, etc.
    
    -- Visual
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
    
    -- Recurrence (for future implementation)
    recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(255), -- RRULE format
    
    -- Reminders
    reminder_minutes INTEGER, -- Minutes before event to remind
    
    -- Status
    status VARCHAR(20) DEFAULT 'CONFIRMED', -- CONFIRMED, TENTATIVE, CANCELLED
    
    -- Related entities (optional)
    related_entity_type VARCHAR(50), -- EXAM, TRAINING, HOMEWORK, etc.
    related_entity_id BIGINT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indices for performance
CREATE INDEX idx_todos_user_status ON todos(user_id, status);
CREATE INDEX idx_todos_user_category ON todos(user_id, category);
CREATE INDEX idx_todos_user_due_date ON todos(user_id, due_date);
CREATE INDEX idx_todos_completed ON todos(completed);

CREATE INDEX idx_events_user_start ON calendar_events(user_id, start_date);
CREATE INDEX idx_events_user_category ON calendar_events(user_id, category);
CREATE INDEX idx_events_user_date_range ON calendar_events(user_id, start_date, end_date);
CREATE INDEX idx_events_status ON calendar_events(status);
