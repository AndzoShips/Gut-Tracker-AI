# 🚀 Quick Start Guide

## 1. Set Up Environment Variables

Create a `.env.local` file in the root directory with your Whop credentials:

```bash
# Copy the template
cp env-template.txt .env.local
```

Then edit `.env.local` with your actual values:
- `NEXT_PUBLIC_WHOP_APP_ID` - Your Whop App ID
- `WHOP_API_KEY` - Your Whop API Key  
- `WHOP_WEBHOOK_SECRET` - Your Whop Webhook Secret

## 2. Navigate to the App Directory

```bash
cd whop-app
```

## 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

## 4. Start Development Server

**Option 1: With Whop Proxy (Recommended)**
```bash
npm run dev
# or
pnpm dev
```

**Option 2: Direct Next.js (if proxy has issues)**
```bash
npm run dev:next
# or
pnpm dev:next
```

## 5. Open Your App

Visit `http://localhost:3000` in your browser.

## 🎯 What You'll See

- **Home Page**: Welcome screen with authentication status
- **Login Page**: Whop authentication flow
- **Dashboard**: User profile and quick actions
- **Navigation**: Easy access to all pages

## 🔧 Next Steps

1. **Customize the UI**: Edit the components in `/components`
2. **Add Features**: Create new pages in `/app`
3. **Use Whop SDK**: Access user data and Whop APIs
4. **Deploy**: Build and deploy to your preferred platform

## 📚 Need Help?

- Check `SETUP.md` for detailed instructions
- Visit [Whop Developer Docs](https://docs.whop.com/apps)
- Review the template repository for examples

Happy coding! 🎉
