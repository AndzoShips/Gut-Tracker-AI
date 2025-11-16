# 🚨 IMPORTANT: Create Database Table

The error "column meals.whop_user_id does not exist" means the database table hasn't been created yet.

## Quick Fix:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `izjosrgppuooboqonwqy`

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste this SQL:**
   ```sql
   -- Create meals table to store meal analysis results
   CREATE TABLE IF NOT EXISTS meals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     whop_user_id TEXT NOT NULL,
     title TEXT,
     image_url TEXT,
     detected_ingredients TEXT[],
     mood_score INTEGER,
     mental_clarity_score INTEGER,
     energy_score INTEGER,
     digestion_score INTEGER,
     gut_score INTEGER,
     mental_score INTEGER,
     overall_score INTEGER,
     short_verdict TEXT,
     gut_insights JSONB,
     mental_insights JSONB,
     reasons TEXT[],
     alternatives TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create index on whop_user_id for faster queries
   CREATE INDEX IF NOT EXISTS idx_meals_whop_user_id ON meals(whop_user_id);

   -- Create index on created_at for sorting
   CREATE INDEX IF NOT EXISTS idx_meals_created_at ON meals(created_at DESC);

   -- Enable Row Level Security (RLS)
   ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

   -- Create policy: Allow all operations (access controlled via API)
   CREATE POLICY "Allow all operations for authenticated users"
     ON meals
     FOR ALL
     USING (true)
     WITH CHECK (true);

   -- Function to update updated_at timestamp
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Trigger to automatically update updated_at
   CREATE TRIGGER update_meals_updated_at
     BEFORE UPDATE ON meals
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();
   ```

4. **Click "Run"** (or press Ctrl+Enter)

5. **Verify:**
   - Go to "Table Editor" in Supabase
   - You should see a `meals` table
   - It should have all the columns including `whop_user_id`

6. **Test:**
   - Restart your dev server
   - Analyze a meal
   - Check `/meals` page - meals should appear!

## If Table Already Exists:

If you get an error saying the table already exists, you can either:
- Drop it and recreate: `DROP TABLE meals;` then run the SQL above
- Or just add the missing column: `ALTER TABLE meals ADD COLUMN IF NOT EXISTS whop_user_id TEXT;`

