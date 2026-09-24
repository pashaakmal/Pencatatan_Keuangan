-- Migration: Add custom_category and update date to timestamp
-- Date: 2026-09-24

-- 1. Add custom_category column
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS custom_category TEXT;

-- 2. Change category column constraint (if exists) to allow any text
-- Note: If category has CHECK constraint, drop it first
-- ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_category_check;

-- 3. Update date column to timestamp with timezone
-- First, we need to migrate existing data to preserve it
-- Create temp column
ALTER TABLE transactions 
ADD COLUMN date_temp TIMESTAMPTZ;

-- Copy existing date data to temp column (set time to 00:00:00)
UPDATE transactions 
SET date_temp = (date || ' 00:00:00')::TIMESTAMPTZ
WHERE date_temp IS NULL;

-- Drop old date column
ALTER TABLE transactions 
DROP COLUMN date;

-- Rename temp column to date
ALTER TABLE transactions 
RENAME COLUMN date_temp TO date;

-- Set NOT NULL constraint
ALTER TABLE transactions 
ALTER COLUMN date SET NOT NULL;

-- 4. Update RLS policies if needed (they should still work with user_id)
-- No changes needed for RLS policies

-- 5. Add comment
COMMENT ON COLUMN transactions.custom_category IS 'Custom category name when category is "lainnya"';
COMMENT ON COLUMN transactions.date IS 'Transaction date and time (ISO timestamp)';
