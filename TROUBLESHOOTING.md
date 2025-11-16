# Troubleshooting "Failed to send request" Error

## Quick Checks

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for specific error messages.

### 2. Check Server Terminal
Look at your terminal where `npm run dev` is running. You should see detailed error messages there.

### 3. Common Issues & Fixes

#### Issue: Missing Environment Variables

**Symptoms:**
- Error in server logs about missing variables
- "Supabase not configured" warning

**Fix:**
1. Make sure `.env.local` exists in `whop-app/` directory
2. Add these variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://izjosrgppuooboqonwqy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6am9zcmdwcHVvb2JvcW9ud3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzE2MDgsImV4cCI6MjA3ODM0NzYwOH0.0Hrb-Aa-uIvKYxn3nOD7lRa-HIPptUl0B7TRBKx1bGg
   OPENAI_API_KEY=your_openai_key_here
   ```
3. **Restart your dev server** after adding variables

#### Issue: Database Table Doesn't Exist

**Symptoms:**
- Error: "relation 'meals' does not exist"
- Error: "table 'meals' does not exist"

**Fix:**
1. Go to Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run**

#### Issue: Authentication Error

**Symptoms:**
- Error: "Authentication required"
- Error: "Authentication failed"

**Fix:**
- Make sure you're accessing the app through Whop
- Check that `WHOP_API_KEY` and `NEXT_PUBLIC_WHOP_APP_ID` are set in `.env.local`

#### Issue: OpenAI API Error

**Symptoms:**
- Error: "OPENAI_API_KEY environment variable is not set"
- Error: "Failed to analyze image"

**Fix:**
1. Make sure `OPENAI_API_KEY` is in `.env.local`
2. Restart dev server
3. Verify the key is valid

## Debug Steps

1. **Check the actual error:**
   - Open browser console (F12)
   - Look for the error message
   - Check the Network tab to see the API response

2. **Check server logs:**
   - Look at your terminal
   - Find the error message
   - Share it if you need help

3. **Test the API directly:**
   - Try accessing `/api/analyze` directly
   - Check what error it returns

## Still Having Issues?

Share:
1. The exact error message from browser console
2. The error from server terminal
3. Whether you've created the database table in Supabase

