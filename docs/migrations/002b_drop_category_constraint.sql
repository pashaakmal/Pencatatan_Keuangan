-- Drop the category check constraint before allowing custom categories
-- Run this before the main migration

-- 1. Drop the check constraint if exists
ALTER TABLE transactions 
DROP CONSTRAINT IF EXISTS transactions_category_check;

-- 2. Optional: If you want to keep some validation, you can create a new constraint 
--    that allows any text but maybe requires a value
-- ALTER TABLE transactions 
-- ADD CONSTRAINT transactions_category_not_empty CHECK (category <> '');

-- 3. Verify the constraint is gone
-- SELECT conname, conrelid::regclass 
-- FROM pg_constraint 
-- WHERE conrelid = 'transactions'::regclass 
-- AND conname = 'transactions_category_check';
