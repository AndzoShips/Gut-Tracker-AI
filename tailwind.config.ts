import { frostedThemePlugin } from "@whop/react/tailwind";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#4dc277",
      },
    },
  },
  plugins: [frostedThemePlugin()],
};
