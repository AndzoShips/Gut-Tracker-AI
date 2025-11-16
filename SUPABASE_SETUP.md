# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Add Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://izjosrgppuooboqonwqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6am9zcmdwcHVvb2JvcW9ud3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzE2MDgsImV4cCI6MjA3ODM0NzYwOH0.0Hrb-Aa-uIvKYxn3nOD7lRa-HIPptUl0B7TRBKx1bGg
```

### 2. Create Database Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `meals` table to store meal analysis results
- Indexes for faster queries
- Row Level Security (RLS) policies to ensure users can only access their own meals

### 3. Verify Setup

After running the SQL, verify the table was created:
1. Go to **Table Editor** in Supabase dashboard
2. You should see a `meals` table
3. Check that RLS is enabled (should show a lock icon)

## 📊 Database Schema

The `meals` table stores:
- User ID (from Whop)
- Meal title and image
- Detected ingredients
- All wellness scores (mood, mental clarity, energy, digestion, gut, mental, overall)
- Gut and mental insights (stored as JSON)
- Reasons and alternatives
- Timestamps (created_at, updated_at)

## 🔒 Security

Row Level Security (RLS) is enabled, which means:
- Users can only see their own meals
- Users can only insert/update/delete their own meals
- All queries are automatically filtered by user ID

## 🧪 Testing

1. Analyze a meal through your app
2. Check Supabase dashboard → Table Editor → meals
3. You should see the meal analysis result saved

## 📝 API Endpoints

- `POST /api/analyze` - Analyzes meal and saves to database
- `GET /api/meals` - Gets all meals for current user
- `DELETE /api/meals?id=meal_id` - Deletes a specific meal

## 🐛 Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure you added the variables to `.env.local`
- Restart your dev server after adding variables

**Error: "relation 'meals' does not exist"**
- Run the SQL schema in Supabase SQL Editor

**Error: "new row violates row-level security policy"**
- Check that RLS policies are set up correctly
- Verify the user ID is being passed correctly

