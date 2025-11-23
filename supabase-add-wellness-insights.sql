-- Add wellness_insights column if it doesn't exist
-- Run this in Supabase SQL Editor if your table is missing this column

ALTER TABLE meals ADD COLUMN IF NOT EXISTS wellness_insights JSONB;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'meals' 
AND column_name = 'wellness_insights';

