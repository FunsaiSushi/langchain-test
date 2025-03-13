"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle initial theme setup after component mounts
  useEffect(() => {
    // Mark as mounted
    setMounted(true);

    // Get theme from localStorage or system preference
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialDarkMode =
      savedTheme === "dark" || (!savedTheme && prefersDark);

    // Set the initial state
    setDarkMode(initialDarkMode);

    // Apply class to document element
    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => setMounted(false);
  }, []);

  // This is the function we'll expose to toggle the theme
  const toggleTheme = React.useCallback(() => {
    if (!mounted) return;

    setDarkMode((prevMode) => {
      const newMode = !prevMode;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newMode ? "dark" : "light");
      }

      // Update document class
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newMode;
    });
  }, [mounted]);

  // To avoid hydration mismatch, don't render with dark theme initially
  // Only expose the real dark mode status after component is mounted
  const contextValue = React.useMemo(
    () => ({
      darkMode: mounted ? darkMode : false,
      toggleTheme,
      mounted,
    }),
    [darkMode, toggleTheme, mounted]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
