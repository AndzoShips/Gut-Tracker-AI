# Whop App Setup Guide

This is a Next.js app built with the official Whop template. Follow these steps to get started:

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Set Up Environment Variables
1. Copy the `env-template.txt` file to `.env.local`:
   ```bash
   cp env-template.txt .env.local
   ```

2. Fill in your Whop app credentials in `.env.local`:
   - Get your `NEXT_PUBLIC_WHOP_APP_ID` from your Whop App dashboard
   - Get your `WHOP_API_KEY` from your Whop App settings
   - Get your `WHOP_WEBHOOK_SECRET` from your Whop App webhook settings

### 3. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
whop-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── discover/          # Discover page
│   ├── experiences/       # Experiences pages
│   ├── login/             # Login page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication wrapper
│   └── UserProfile.tsx    # User profile component
├── lib/                   # Utility libraries
│   └── whop-sdk.ts        # Whop SDK configuration
└── .env.local             # Environment variables (create this)
```

## 🔧 Features

- ✅ **Authentication**: Built-in Whop authentication
- ✅ **User Management**: User profile and logout functionality
- ✅ **Dashboard**: Clean dashboard with user info and quick actions
- ✅ **Responsive Design**: Mobile-friendly UI
- ✅ **TypeScript**: Full TypeScript support
- ✅ **Tailwind CSS**: Styled with Tailwind CSS

## 🛠 Development

### Available Scripts
- `npm run dev` - Start development server with Whop proxy
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

### Whop SDK Usage
The app uses the Whop SDK for authentication and API calls. You can access it through:

```typescript
import { whopsdk } from "@/lib/whop-sdk";

// Example: Get user data
const user = await whopsdk.users.retrieve(userId);
```

### Authentication
Use the server-side SDK to verify users in protected routes. Example from `app/dashboard/[companyId]/page.tsx`:

```ts
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

// Ensure the user is logged in on Whop
const { userId } = await whopsdk.verifyUserToken(await headers());
```

## 📚 Resources

- [Whop Developer Docs](https://docs.whop.com/apps)
- [Whop Apps Dashboard](https://whop.com/apps)
- [Template Repository](https://github.com/whopio/whop-nextjs-app-template)

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure
- Use environment variables for all sensitive data

## 🚀 Deployment

When ready to deploy:

1. Set up your production environment variables
2. Build the app: `npm run build`
3. Deploy to your preferred platform (Vercel, Netlify, etc.)
4. Configure your Whop app's production URL

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication not working**: Check your environment variables
2. **Build errors**: Make sure all dependencies are installed
3. **Whop proxy issues**: Ensure you're using `npm run dev` (not `next dev`)

### Getting Help:
- Check the [Whop Developer Docs](https://docs.whop.com/apps)
- Join the Whop Developer Community
- Review the template repository for examples
