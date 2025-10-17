-- Migration: Gym Tracking System
CREATE TABLE exercises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'SPORTS')),
    muscle_group VARCHAR(50) NOT NULL CHECK (muscle_group IN ('CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'LEGS', 'CORE', 'FULL_BODY', 'CARDIO')),
    description VARCHAR(1000),
    equipment VARCHAR(50) NOT NULL CHECK (equipment IN ('BARBELL', 'DUMBBELL', 'MACHINE', 'CABLE', 'BODYWEIGHT', 'KETTLEBELL', 'RESISTANCE_BAND', 'NONE')),
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gym_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    workout_name VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise_logs (
    id BIGSERIAL PRIMARY KEY,
    gym_session_id BIGINT NOT NULL REFERENCES gym_sessions(id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES exercises(id),
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL CHECK (reps > 0),
    weight DOUBLE PRECISION CHECK (weight >= 0),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exercises_custom ON exercises(is_custom);
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX idx_gym_sessions_user_id ON gym_sessions(user_id);
CREATE INDEX idx_gym_sessions_start_time ON gym_sessions(start_time DESC);
CREATE INDEX idx_exercise_logs_session_id ON exercise_logs(gym_session_id);
CREATE INDEX idx_exercise_logs_exercise_id ON exercise_logs(exercise_id);

-- Insert predefined exercises
INSERT INTO exercises (name, category, muscle_group, equipment, description, is_custom) VALUES
-- Chest
('Bankdrücken', 'STRENGTH', 'CHEST', 'BARBELL', 'Klassische Brustübung mit der Langhantel', FALSE),
('Kurzhantel Bankdrücken', 'STRENGTH', 'CHEST', 'DUMBBELL', 'Brustübung mit Kurzhanteln für mehr Bewegungsfreiheit', FALSE),
('Butterfly', 'STRENGTH', 'CHEST', 'MACHINE', 'Isolationsübung für die Brust an der Maschine', FALSE),
('Cable Crossover', 'STRENGTH', 'CHEST', 'CABLE', 'Kabelzug-Übung für die Brust', FALSE),
('Liegestütze', 'STRENGTH', 'CHEST', 'BODYWEIGHT', 'Klassische Eigengewichtsübung', FALSE),

-- Back
('Klimmzüge', 'STRENGTH', 'BACK', 'BODYWEIGHT', 'Rückenübung mit Eigengewicht', FALSE),
('Kreuzheben', 'STRENGTH', 'BACK', 'BARBELL', 'Ganzkörperübung mit Fokus auf Rücken und Beine', FALSE),
('Latzug', 'STRENGTH', 'BACK', 'MACHINE', 'Rückenübung an der Maschine', FALSE),
('Rudern vorgebeugt', 'STRENGTH', 'BACK', 'BARBELL', 'Rückenübung mit der Langhantel', FALSE),
('Kurzhantel Rudern', 'STRENGTH', 'BACK', 'DUMBBELL', 'Einarmiges Rudern mit Kurzhantel', FALSE),
('T-Bar Rudern', 'STRENGTH', 'BACK', 'BARBELL', 'Ruderübung für den mittleren Rücken', FALSE),
('Cable Row', 'STRENGTH', 'BACK', 'CABLE', 'Rudern am Kabelzug', FALSE),

-- Shoulders
('Schulterdrücken', 'STRENGTH', 'SHOULDERS', 'BARBELL', 'Schulterübung mit der Langhantel', FALSE),
('Kurzhantel Schulterdrücken', 'STRENGTH', 'SHOULDERS', 'DUMBBELL', 'Schulterdrücken mit Kurzhanteln', FALSE),
('Seitheben', 'STRENGTH', 'SHOULDERS', 'DUMBBELL', 'Isolationsübung für die seitliche Schulter', FALSE),
('Frontheben', 'STRENGTH', 'SHOULDERS', 'DUMBBELL', 'Isolationsübung für die vordere Schulter', FALSE),
('Face Pulls', 'STRENGTH', 'SHOULDERS', 'CABLE', 'Übung für die hintere Schulter am Kabelzug', FALSE),

-- Biceps
('Bizeps Curls', 'STRENGTH', 'BICEPS', 'DUMBBELL', 'Klassische Bizepsübung mit Kurzhanteln', FALSE),
('Hammer Curls', 'STRENGTH', 'BICEPS', 'DUMBBELL', 'Bizepsübung im neutralen Griff', FALSE),
('SZ-Curls', 'STRENGTH', 'BICEPS', 'BARBELL', 'Bizepsübung mit SZ-Stange', FALSE),
('Cable Curls', 'STRENGTH', 'BICEPS', 'CABLE', 'Bizepsübung am Kabelzug', FALSE),

-- Triceps
('Trizeps Dips', 'STRENGTH', 'TRICEPS', 'BODYWEIGHT', 'Trizepsübung mit Eigengewicht', FALSE),
('Trizepsdrücken', 'STRENGTH', 'TRICEPS', 'CABLE', 'Trizepsübung am Kabelzug', FALSE),
('French Press', 'STRENGTH', 'TRICEPS', 'BARBELL', 'Trizepsübung mit der Langhantel', FALSE),
('Kickbacks', 'STRENGTH', 'TRICEPS', 'DUMBBELL', 'Trizeps Isolationsübung', FALSE),

-- Legs
('Kniebeugen', 'STRENGTH', 'LEGS', 'BARBELL', 'Grundübung für die Beine', FALSE),
('Beinpresse', 'STRENGTH', 'LEGS', 'MACHINE', 'Beinübung an der Maschine', FALSE),
('Ausfallschritte', 'STRENGTH', 'LEGS', 'DUMBBELL', 'Beinübung mit Kurzhanteln', FALSE),
('Beinstrecker', 'STRENGTH', 'LEGS', 'MACHINE', 'Isolationsübung für den Quadrizeps', FALSE),
('Beinbeuger', 'STRENGTH', 'LEGS', 'MACHINE', 'Isolationsübung für die hintere Oberschenkelmuskulatur', FALSE),
('Wadenheben', 'STRENGTH', 'LEGS', 'MACHINE', 'Übung für die Waden', FALSE),

-- Core
('Planks', 'STRENGTH', 'CORE', 'BODYWEIGHT', 'Statische Bauchmuskelübung', FALSE),
('Crunches', 'STRENGTH', 'CORE', 'BODYWEIGHT', 'Klassische Bauchmuskelübung', FALSE),
('Russian Twists', 'STRENGTH', 'CORE', 'BODYWEIGHT', 'Rotationsübung für die seitlichen Bauchmuskeln', FALSE),
('Leg Raises', 'STRENGTH', 'CORE', 'BODYWEIGHT', 'Untere Bauchmuskulatur', FALSE),
('Cable Crunches', 'STRENGTH', 'CORE', 'CABLE', 'Bauchmuskelübung am Kabelzug', FALSE),

-- Cardio
('Laufband', 'CARDIO', 'CARDIO', 'MACHINE', 'Ausdauertraining auf dem Laufband', FALSE),
('Fahrrad', 'CARDIO', 'CARDIO', 'MACHINE', 'Ausdauertraining auf dem Ergometer', FALSE),
('Rudergerät', 'CARDIO', 'CARDIO', 'MACHINE', 'Ganzkörper Cardio Training', FALSE),
('Crosstrainer', 'CARDIO', 'CARDIO', 'MACHINE', 'Gelenkschonende Cardio-Übung', FALSE),
('Seilspringen', 'CARDIO', 'CARDIO', 'NONE', 'Cardio mit dem Springseil', FALSE);
