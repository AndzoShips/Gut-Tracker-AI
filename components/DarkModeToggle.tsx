"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/frosted-ui";

// Frosted-UI theme classes
const DARK_THEMES = ["biz-dark-1", "biz-dark-2"];

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check current theme on mount
    const checkTheme = () => {
      const html = document.documentElement;
      const hasDarkClass = DARK_THEMES.some(theme => html.classList.contains(theme));
      
      // Sync .dark class with biz-dark classes
      if (hasDarkClass && !html.classList.contains("dark")) {
        html.classList.add("dark");
      } else if (!hasDarkClass && html.classList.contains("dark")) {
        html.classList.remove("dark");
      }
      
      setIsDark(hasDarkClass);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      // Switch to light mode - remove all dark classes
      DARK_THEMES.forEach(theme => html.classList.remove(theme));
      html.classList.remove("dark"); // Also remove Tailwind's dark class
      body.classList.remove("dark");
      setIsDark(false);
      console.log("Switched to light mode");
    } else {
      // Switch to dark mode - add biz-dark-1 (primary dark theme)
      DARK_THEMES.forEach(theme => html.classList.remove(theme));
      html.classList.add("biz-dark-1");
      html.classList.add("dark"); // Also add Tailwind's dark class
      body.classList.add("dark");
      setIsDark(true);
      console.log("Switched to dark mode", {
        hasDark: html.classList.contains("dark"),
        hasBizDark: html.classList.contains("biz-dark-1")
      });
    }
  };

  return (
    <Button
      onClick={toggleDarkMode}
      className="fixed bottom-4 left-4 z-50 shadow-lg"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </Button>
  );
}

