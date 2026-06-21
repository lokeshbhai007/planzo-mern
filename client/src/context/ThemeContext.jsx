"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Read from localStorage on first render
    const saved = localStorage.getItem("planzo-theme");
    if (saved) return saved === "dark";
    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("planzo-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}