-- First, check if table exists and drop it if it does (to start fresh)
DROP TABLE IF EXISTS meals CASCADE;

-- Now create the table with all correct columns
CREATE TABLE meals (
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

-- Create indexes for better performance
CREATE INDEX idx_meals_whop_user_id ON meals(whop_user_id);
CREATE INDEX idx_meals_created_at ON meals(created_at DESC);

-- Enable Row Level Security
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- Create policy (since we're using Whop auth, not Supabase auth)
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

