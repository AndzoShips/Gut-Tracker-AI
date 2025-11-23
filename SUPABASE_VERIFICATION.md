# Supabase Verification Checklist

## ✅ Step 1: Verify Local Environment Variables

**Status:** ✅ CONFIGURED
- `.env.local` exists
- `NEXT_PUBLIC_SUPABASE_URL` is set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Project ID: `izjosrgppuooboqonwqy`

## ✅ Step 2: Verify Database Table Exists

**Action Required:** Check Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select project: `izjosrgppuooboqonwqy`
3. Click **Table Editor** in left sidebar
4. Look for `meals` table

**If table doesn't exist:**
- Go to **SQL Editor**
- Copy contents of `supabase-schema.sql`
- Click **Run**
- Verify table appears in Table Editor

**If table exists but missing `wellness_insights` column:**
- Go to **SQL Editor**
- Run: `ALTER TABLE meals ADD COLUMN IF NOT EXISTS wellness_insights JSONB;`
- Click **Run**

## ✅ Step 3: Test Local Connection

1. Start dev server: `npm run dev`
2. Check terminal for Supabase logs:
   - Should see: `🔍 Supabase Configuration Check:`
   - Should see: `✅ Set` for both URL and KEY
3. Open browser: `http://localhost:3000`
4. Upload a meal image
5. Check terminal for:
   - `Fetching meals for user: dev-user-123`
   - `✅ Found X meals for user`
6. Check Supabase dashboard → Table Editor → meals
   - Should see new meal entry

## ✅ Step 4: Verify Production (Vercel)

**Action Required:** Check Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify these are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `WHOP_API_KEY`
   - `WHOP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_WHOP_APP_ID`

**If missing:**
- Add them from your `.env.local` file
- Redeploy after adding

## 📋 Current Schema Requirements

The `meals` table should have these columns:
- `id` (UUID, primary key)
- `whop_user_id` (TEXT, required)
- `title` (TEXT)
- `image_url` (TEXT)
- `detected_ingredients` (TEXT[])
- `mood_score` (INTEGER)
- `mental_clarity_score` (INTEGER)
- `energy_score` (INTEGER)
- `digestion_score` (INTEGER)
- `gut_score` (INTEGER)
- `mental_score` (INTEGER)
- `overall_score` (INTEGER)
- `short_verdict` (TEXT)
- `gut_insights` (JSONB)
- `mental_insights` (JSONB)
- `wellness_insights` (JSONB) ⚠️ **May be missing - needs to be added**
- `reasons` (TEXT[])
- `alternatives` (TEXT[])
- `personalized_insights` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔧 Quick Fixes

### Add Missing Column (if needed):
```sql
ALTER TABLE meals ADD COLUMN IF NOT EXISTS wellness_insights JSONB;
```

### Verify Table Structure:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'meals';
```

### Check RLS is Enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'meals';
```

## 🎯 Success Indicators

✅ **Local:**
- Dev server shows Supabase connection logs
- Can save meals successfully
- Meals appear in dashboard
- No errors in browser console

✅ **Production:**
- Vercel has all environment variables
- Production deployment succeeds
- Can save meals in production
- Meals persist across sessions

