import { useEffect, useState } from 'react';
import HeaderLand from '../components/LandingPage/HeaderLand';
import BackGround from '../components/LandingPage/BackGround';
import HeroLanding from '../components/LandingPage/HeroLanding';
import InterestsSection from '../components/LandingPage/InterestsSection';
import ComparisonSection from '../components/LandingPage/ComparisonSection';
import SmartFilterSection from '../components/LandingPage/SmartFilterSection';
import CTASection from '../components/LandingPage/CTASection';
import FooterLand from '../components/LandingPage/FooterLand';
import LoginModal from '../components/LandingPage/LoginModal';
import type { LandingTheme } from '../components/LandingPage/ThemeSwitcher';
import { organizationSchema, schemaData } from '../constants/SchemaMarkup';
import '../styles/landing-workshop.css';

const LANDING_THEME_STORAGE_KEY = 'foro-landing-theme';

const getInitialTheme = (): LandingTheme => {
    if (typeof window === 'undefined') return 'system';

    try {
        const storedTheme = window.localStorage.getItem(LANDING_THEME_STORAGE_KEY);
        return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
            ? storedTheme
            : 'system';
    } catch {
        return 'system';
    }
};

const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const LandingPage = () => {
    const [newsIndex, setNewsIndex] = useState(0);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [theme, setTheme] = useState<LandingTheme>(getInitialTheme);
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

    useEffect(() => {
        const timer = setInterval(() => {
            setNewsIndex((prev: number) => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const syncSystemTheme = (event: MediaQueryListEvent) => {
            setSystemTheme(event.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', syncSystemTheme);
        return () => mediaQuery.removeEventListener('change', syncSystemTheme);
    }, []);

    const handleThemeChange = (nextTheme: LandingTheme) => {
        setTheme(nextTheme);
        try {
            window.localStorage.setItem(LANDING_THEME_STORAGE_KEY, nextTheme);
        } catch {
            // The selected theme still applies for this session when storage is unavailable.
        }
    };

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    return (
        <div
            className="foro-workshop-landing min-h-screen bg-[#030e17] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative"
            data-theme={theme}
            data-resolved-theme={resolvedTheme}
            style={{ colorScheme: resolvedTheme }}
        >
            {/* ── SEO Schema Markup ── */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            {/* ── Background Gradients ── */}
            <BackGround />

            {/* ── Header ── */}
            <HeaderLand
                onOpenLogin={() => setIsLoginModalOpen(true)}
                theme={theme}
                onThemeChange={handleThemeChange}
            />

            <main>
                {/* ── Hero Section ── */}
                <HeroLanding newsIndex={newsIndex} onOpenLogin={() => setIsLoginModalOpen(true)} />

                {/* ── Interests Section ── */}
                <InterestsSection />

                {/* ── Comparison Section ── */}
                <ComparisonSection />

                {/* ── AI Smart Filter Section ── */}
                <SmartFilterSection />

                {/* ── CTA Section ── */}
                <CTASection onOpenLogin={() => setIsLoginModalOpen(true)} />
            </main>

            {/* ── Footer ── */}
            <FooterLand />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

        </div>
    );
};

export default LandingPage;
