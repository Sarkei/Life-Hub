-- V1_12: Erweiterte Schul-Features in Sidebar

ALTER TABLE sidebar_config
    ADD COLUMN school_notes BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_timetable BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_homework BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_exams BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_grades BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_materials BOOLEAN DEFAULT FALSE,
    ADD COLUMN school_submissions BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_projects BOOLEAN DEFAULT FALSE,
    ADD COLUMN school_flashcards BOOLEAN DEFAULT FALSE,
    ADD COLUMN school_summaries BOOLEAN DEFAULT FALSE,
    ADD COLUMN school_study_sessions BOOLEAN DEFAULT TRUE,
    ADD COLUMN school_absences BOOLEAN DEFAULT TRUE;

-- Kommentar für Dokumentation
COMMENT ON COLUMN sidebar_config.school_notes IS 'Notizen mit Markdown und Ordner-Struktur';
COMMENT ON COLUMN sidebar_config.school_timetable IS 'Stundenplan';
COMMENT ON COLUMN sidebar_config.school_homework IS 'Hausaufgaben';
COMMENT ON COLUMN sidebar_config.school_exams IS 'Prüfungen';
COMMENT ON COLUMN sidebar_config.school_grades IS 'Noten-Übersicht';
COMMENT ON COLUMN sidebar_config.school_materials IS 'Unterrichtsmaterialien (PDFs, Dateien)';
COMMENT ON COLUMN sidebar_config.school_submissions IS 'Abgaben-Management';
COMMENT ON COLUMN sidebar_config.school_projects IS 'Schul-Projekte';
COMMENT ON COLUMN sidebar_config.school_flashcards IS 'Lernkarten';
COMMENT ON COLUMN sidebar_config.school_summaries IS 'Zusammenfassungen';
COMMENT ON COLUMN sidebar_config.school_study_sessions IS 'Lernzeiten';
COMMENT ON COLUMN sidebar_config.school_absences IS 'Fehlzeiten';
