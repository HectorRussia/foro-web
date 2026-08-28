import { useEffect, useRef, useState } from 'react';
import { FaDesktop, FaMoon, FaSun } from 'react-icons/fa';

export type LandingTheme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
    theme: LandingTheme;
    onThemeChange: (theme: LandingTheme) => void;
}

const themeOptions = [
    { value: 'light' as const, label: 'Light', Icon: FaSun },
    { value: 'dark' as const, label: 'Dark', Icon: FaMoon },
    { value: 'system' as const, label: 'System', Icon: FaDesktop },
];

const ThemeSwitcher = ({ theme, onThemeChange }: ThemeSwitcherProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const activeTheme = themeOptions.find((option) => option.value === theme) ?? themeOptions[2];

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const selectTheme = (nextTheme: LandingTheme) => {
        onThemeChange(nextTheme);
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    return (
        <div ref={rootRef} className="landing-theme-switcher relative">
            <button
                ref={triggerRef}
                type="button"
                className="landing-theme-trigger inline-flex h-11 w-11 items-center justify-center"
                aria-label={`ธีมเว็บไซต์: ${activeTheme.label}`}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                title={`ธีมเว็บไซต์: ${activeTheme.label}`}
                onClick={() => setIsOpen((value) => !value)}
            >
                <activeTheme.Icon aria-hidden="true" className="text-base" />
            </button>

            {isOpen && (
                <div
                    className="landing-theme-menu absolute right-0 top-[calc(100%+10px)] w-44 p-2"
                    role="menu"
                    aria-label="เลือกธีมเว็บไซต์"
                >
                    {themeOptions.map(({ value, label, Icon }) => (
                        <button
                            key={value}
                            type="button"
                            className="landing-theme-option flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm font-bold"
                            role="menuitemradio"
                            aria-checked={theme === value}
                            onClick={() => selectTheme(value)}
                        >
                            <Icon aria-hidden="true" className="shrink-0" />
                            <span>{label}</span>
                            {theme === value && <span className="ml-auto" aria-hidden="true">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
