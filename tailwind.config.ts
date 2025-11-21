import { frostedThemePlugin } from "@whop/react/tailwind";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@whop/frosted-ui/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  plugins: [frostedThemePlugin()],
};
