-- Add phone_number column to users table
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(30);

-- Add index for phone number lookups (optional, for future SMS features)
CREATE INDEX idx_users_phone_number ON users(phone_number);

-- Add comment
COMMENT ON COLUMN users.phone_number IS 'Mobile phone number in format: +CountryCode MobilePrefix Number (e.g., +49 151 12345678)';
