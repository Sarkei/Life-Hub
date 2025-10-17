-- Sidebar Configuration Table
CREATE TABLE sidebar_config (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    
    -- General Items
    dashboard BOOLEAN DEFAULT TRUE,
    todos BOOLEAN DEFAULT TRUE,
    calendar BOOLEAN DEFAULT TRUE,
    contacts BOOLEAN DEFAULT FALSE,
    
    -- Private Items
    fitness BOOLEAN DEFAULT TRUE,
    weight BOOLEAN DEFAULT TRUE,
    nutrition BOOLEAN DEFAULT TRUE,
    goals BOOLEAN DEFAULT FALSE,
    diary BOOLEAN DEFAULT FALSE,
    shopping BOOLEAN DEFAULT FALSE,
    health BOOLEAN DEFAULT FALSE,
    travel BOOLEAN DEFAULT FALSE,
    movies BOOLEAN DEFAULT FALSE,
    music BOOLEAN DEFAULT FALSE,
    photos BOOLEAN DEFAULT FALSE,
    quick_notes BOOLEAN DEFAULT FALSE,
    
    -- Work Items
    time_tracking BOOLEAN DEFAULT FALSE,
    statistics BOOLEAN DEFAULT FALSE,
    news BOOLEAN DEFAULT FALSE,
    projects BOOLEAN DEFAULT FALSE,
    
    -- School Items
    grades BOOLEAN DEFAULT FALSE,
    habits BOOLEAN DEFAULT FALSE,
    budget BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sidebar_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index für schnelle User-Abfrage
CREATE INDEX idx_sidebar_user_id ON sidebar_config(user_id);
