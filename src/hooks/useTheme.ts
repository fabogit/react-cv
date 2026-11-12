import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
const THEME_CYCLE: readonly ThemeMode[] = ["light", "dark", "system"] as const;

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "system";
  }
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (err) {
    console.warn("Unable to access localStorage for theme preference:", err);
  }
  return "system";
};

const applyThemeToDocument = (resolved: ResolvedTheme): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
};

/**
 * Custom hook to manage Light/Dark/System theme preferences,
 * with persistence, cross-tab synchronization, and real-time OS preference updates.
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const currentIndex = THEME_CYCLE.indexOf(currentTheme);
      const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
      return nextTheme ?? "system";
    });
  }, []);

  // Persist theme preference to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      console.warn("Failed to persist theme to localStorage:", err);
    }
  }, [theme]);

  // Apply resolved theme to document attributes
  useEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  // Listen to OS color scheme changes in real time
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Handle multi-tab synchronization via storage event
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        const newValue = event.newValue;
        if (newValue === null) {
          setThemeState("system");
        } else if (newValue === "light" || newValue === "dark" || newValue === "system") {
          setThemeState(newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
};
