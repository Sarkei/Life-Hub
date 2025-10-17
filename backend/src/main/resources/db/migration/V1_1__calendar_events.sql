-- =====================================================
-- Life Hub - Calendar Events Migration
-- Version: 1.1
-- Date: 2025-10-17
-- =====================================================

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    category VARCHAR(50) DEFAULT 'privat',
    color VARCHAR(7) DEFAULT '#3b82f6',
    all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comments
COMMENT ON TABLE calendar_events IS 'Calendar events for users';
COMMENT ON COLUMN calendar_events.user_id IS 'Reference to users table';
COMMENT ON COLUMN calendar_events.category IS 'Event category: privat, arbeit, schule';
COMMENT ON COLUMN calendar_events.color IS 'Hex color code for event display';
COMMENT ON COLUMN calendar_events.all_day IS 'Whether event is all-day event';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_category ON calendar_events(category);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_start ON calendar_events(user_id, start_time);

-- Insert sample data for testing (optional)
-- INSERT INTO calendar_events (user_id, title, description, start_time, end_time, category, color, all_day, location)
-- VALUES 
--     (1, 'Team Meeting', 'Weekly team sync', '2025-10-18 10:00:00', '2025-10-18 11:00:00', 'arbeit', '#3b82f6', false, 'Raum 301'),
--     (1, 'Zahnarzt', 'Kontrolltermin', '2025-10-19 14:30:00', '2025-10-19 15:00:00', 'privat', '#ef4444', false, 'Praxis Dr. Müller'),
--     (1, 'Mathe Prüfung', 'Analysis Klausur', '2025-10-20 08:00:00', '2025-10-20 10:00:00', 'schule', '#10b981', false, 'Hörsaal A');

-- Verify the table
SELECT 
    table_name, 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'calendar_events' 
ORDER BY ordinal_position;

-- Success message
SELECT 'Calendar events table created successfully!' AS status;
