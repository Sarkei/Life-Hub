-- Migration: Weight Tracking
CREATE TABLE weights (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    weight DOUBLE PRECISION NOT NULL CHECK (weight > 0 AND weight <= 500),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

CREATE INDEX idx_weights_user_id ON weights(user_id);
CREATE INDEX idx_weights_date ON weights(date);
CREATE INDEX idx_weights_user_date ON weights(user_id, date DESC);
