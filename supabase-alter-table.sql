-- Alternative: If you want to keep existing data, add the missing column
-- Only use this if the table exists and has data you want to keep

-- Add the missing whop_user_id column
ALTER TABLE meals ADD COLUMN IF NOT EXISTS whop_user_id TEXT;

-- If the column was just added and is NULL, you might want to set a default
-- (But this is only if you have existing data - otherwise use the DROP/CREATE approach)
-- UPDATE meals SET whop_user_id = 'unknown' WHERE whop_user_id IS NULL;

-- Make it NOT NULL after setting values (if needed)
-- ALTER TABLE meals ALTER COLUMN whop_user_id SET NOT NULL;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_meals_whop_user_id ON meals(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON meals(created_at DESC);

