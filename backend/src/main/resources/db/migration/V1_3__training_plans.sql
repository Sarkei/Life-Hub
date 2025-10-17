-- Migration for Training Plan System
CREATE TABLE IF NOT EXISTS training_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    goal VARCHAR(100),
    duration_weeks INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workouts (
    id BIGSERIAL PRIMARY KEY,
    training_plan_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    day_of_week VARCHAR(20) NOT NULL,
    type VARCHAR(100),
    duration_minutes INTEGER,
    calories_burned INTEGER,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (training_plan_id) REFERENCES training_plans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id BIGSERIAL PRIMARY KEY,
    workout_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight INTEGER,
    duration_seconds INTEGER,
    notes TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_plans_user_id ON training_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_training_plans_active ON training_plans(active);
CREATE INDEX IF NOT EXISTS idx_workouts_training_plan_id ON workouts(training_plan_id);
CREATE INDEX IF NOT EXISTS idx_workouts_day_of_week ON workouts(day_of_week);
CREATE INDEX IF NOT EXISTS idx_workouts_completed ON workouts(completed);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_position ON workout_exercises(position);
