-- =====================================================
-- Life Hub - Database Migration
-- Notes System Enhancement
-- Version: 1.0
-- Date: 2024
-- =====================================================

-- Add new columns for notes folder structure
ALTER TABLE notes ADD COLUMN IF NOT EXISTS type VARCHAR(10) DEFAULT 'FILE';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS file_type VARCHAR(10) DEFAULT 'MARKDOWN';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS parent_id BIGINT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS folder_path VARCHAR(500);

-- Add comments to columns
COMMENT ON COLUMN notes.type IS 'Type of the note: FILE or FOLDER';
COMMENT ON COLUMN notes.file_type IS 'File type: MARKDOWN or PDF';
COMMENT ON COLUMN notes.parent_id IS 'Parent folder ID for nested structure';
COMMENT ON COLUMN notes.folder_path IS 'Full path to the folder, e.g. /Mathematik/Analysis';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_parent_id ON notes(parent_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_category_type ON notes(user_id, category, type);
CREATE INDEX IF NOT EXISTS idx_notes_folder_path ON notes(folder_path);

-- Update existing records (set defaults for existing notes)
UPDATE notes SET type = 'FILE' WHERE type IS NULL;
UPDATE notes SET file_type = 'MARKDOWN' WHERE file_type IS NULL;

-- Optional: Add foreign key constraint for parent_id
-- ALTER TABLE notes ADD CONSTRAINT fk_notes_parent 
--   FOREIGN KEY (parent_id) REFERENCES notes(id) ON DELETE CASCADE;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    character_maximum_length, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'notes' 
ORDER BY ordinal_position;

-- Check existing data
SELECT 
    id, 
    title, 
    type, 
    file_type, 
    parent_id, 
    folder_path,
    category,
    user_id
FROM notes 
LIMIT 10;

-- Success message
SELECT 'Migration completed successfully!' AS status;
