import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    ThemeContext,
    type ResolvedTheme,
    type ThemePreference,
} from './theme-context';

const THEME_STORAGE_KEY = 'foro-theme';
const LEGACY_THEME_STORAGE_KEY = 'foro-landing-theme';
const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

const isThemePreference = (value: string | null): value is ThemePreference => (
    value === 'light' || value === 'dark' || value === 'system'
);

const readInitialTheme = (): ThemePreference => {
    if (typeof window === 'undefined') return 'system';

    try {
        const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (isThemePreference(savedTheme)) return savedTheme;

        const legacyTheme = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        return isThemePreference(legacyTheme) ? legacyTheme : 'system';
    } catch {
        return 'system';
    }
};

const readSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 'light';
    }

    return window.matchMedia(SYSTEM_THEME_QUERY).matches ? 'dark' : 'light';
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemePreference>(readInitialTheme);
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);

    useEffect(() => {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // The in-memory preference remains active when storage is unavailable.
        }
    }, [theme]);

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return;

        const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
        const syncSystemTheme = () => setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
        syncSystemTheme();

        if (theme !== 'system') return;
        mediaQuery.addEventListener('change', syncSystemTheme);
        return () => mediaQuery.removeEventListener('change', syncSystemTheme);
    }, [theme]);

    const value = useMemo(() => ({
        theme,
        resolvedTheme: theme === 'system' ? systemTheme : theme,
        setTheme,
    }), [systemTheme, theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

