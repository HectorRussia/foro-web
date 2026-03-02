import { useEffect, useState } from 'react';
import HeaderLand from '../components/LandingPage/HeaderLand';
import BackGround from '../components/LandingPage/BackGround';
import HeroLanding from '../components/LandingPage/HeroLanding';
import InterestsSection from '../components/LandingPage/InterestsSection';
import ComparisonSection from '../components/LandingPage/ComparisonSection';
import SmartFilterSection from '../components/LandingPage/SmartFilterSection';
import CTASection from '../components/LandingPage/CTASection';
import FooterLand from '../components/LandingPage/FooterLand';
import { organizationSchema, schemaData } from '../constants/SchemaMarkup';

const LandingPage = () => {
    const [newsIndex, setNewsIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setNewsIndex((prev: number) => (prev === 0 ? 1 : 0));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#030e17] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
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
            <HeaderLand />

            <main>
                {/* ── Hero Section ── */}
                <HeroLanding newsIndex={newsIndex} />

                {/* ── Interests Section ── */}
                <InterestsSection />

                {/* ── Comparison Section ── */}
                <ComparisonSection />

                {/* ── AI Smart Filter Section ── */}
                <SmartFilterSection />

                {/* ── CTA Section ── */}
                <CTASection />
            </main>

            {/* ── Footer ── */}
            <FooterLand />

        </div>
    );
};

export default LandingPage;