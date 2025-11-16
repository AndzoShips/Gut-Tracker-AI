# Development Authentication Guide

## Understanding Whop Authentication

### In Production:
- **Yes, users need Whop accounts** to access your app
- Users access your app through Whop's platform
- Whop handles all authentication automatically

### In Development:
You have **two options**:

## Option 1: Use Whop Proxy (Recommended)

Run your app with the Whop proxy:
```bash
npm run dev
```

This simulates Whop authentication and allows you to test as if users are accessing through Whop.

## Option 2: Bypass Authentication (For Quick Testing)

If you want to test without Whop authentication:

1. Add to your `.env.local`:
   ```bash
   DEV_BYPASS_AUTH=true
   ```

2. Restart your dev server

3. Now you can test the app without Whop authentication

**⚠️ Important:** 
- This only works in development mode
- Never set this in production
- This is just for local testing

## Which Should You Use?

- **Use Whop Proxy (`npm run dev`)**: Best for testing the real user experience
- **Use Bypass (`DEV_BYPASS_AUTH=true`)**: Best for quick testing of features without auth setup

## Production

In production, all users must:
1. Have a Whop account
2. Access your app through Whop's platform
3. Be authenticated through Whop

This is how Whop apps work - they're integrated into Whop's ecosystem.

