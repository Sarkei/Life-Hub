-- Migration: Nutrition Tracking
CREATE TABLE nutrition_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    current_weight DOUBLE PRECISION NOT NULL,
    height INTEGER NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    activity_level VARCHAR(30) NOT NULL CHECK (activity_level IN ('SEDENTARY', 'LIGHT', 'MODERATE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE')),
    goal_type VARCHAR(20) NOT NULL CHECK (goal_type IN ('LOSE_WEIGHT', 'MAINTAIN', 'GAIN_WEIGHT')),
    daily_calories INTEGER NOT NULL,
    protein_grams INTEGER,
    carbs_grams INTEGER,
    fat_grams INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_nutrition (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    calories INTEGER NOT NULL CHECK (calories >= 0),
    protein INTEGER CHECK (protein >= 0),
    carbs INTEGER CHECK (carbs >= 0),
    fat INTEGER CHECK (fat >= 0),
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_nutrition_date UNIQUE (user_id, date)
);

CREATE INDEX idx_nutrition_goals_user_id ON nutrition_goals(user_id);
CREATE INDEX idx_daily_nutrition_user_id ON daily_nutrition(user_id);
CREATE INDEX idx_daily_nutrition_date ON daily_nutrition(date);
CREATE INDEX idx_daily_nutrition_user_date ON daily_nutrition(user_id, date DESC);
