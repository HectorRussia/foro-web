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
import { organizationSchema, schemaData } from '../constants/SchemaMarkup';
import '../styles/landing-workshop.css';

const LandingPage = () => {
    const [newsIndex, setNewsIndex] = useState(0);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setNewsIndex((prev: number) => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="foro-workshop-landing min-h-screen bg-[#030e17] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
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
            <HeaderLand onOpenLogin={() => setIsLoginModalOpen(true)} />

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
