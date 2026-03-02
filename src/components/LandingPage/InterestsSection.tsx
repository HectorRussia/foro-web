import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, categoryNews } from '../../constants/LandingPage';
import { HiCheckBadge } from 'react-icons/hi2';

const InterestsSection = () => {
    const [activeTab, setActiveTab] = useState('tech');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100
            }
        }
    };

    const getBgColor = (color: string, active: boolean) => {
        if (!active) return 'bg-[#0f172a]/40 border-white/5 hover:border-white/20';

        const colors: Record<string, string> = {
            blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
            orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
            teal: 'bg-teal-500/20 border-teal-500/50 text-teal-400',
            purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
            emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
            rose: 'bg-rose-500/20 border-rose-500/50 text-rose-400',
            cyan: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
            amber: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
            indigo: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
        };
        return colors[color] || colors.blue;
    };

    const getActiveButtonColor = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-500 shadow-blue-500/40',
            orange: 'bg-orange-500 shadow-orange-500/40',
            teal: 'bg-teal-500 shadow-teal-500/40',
            purple: 'bg-purple-500 shadow-purple-500/40',
            emerald: 'bg-emerald-500 shadow-emerald-500/40',
            rose: 'bg-rose-500 shadow-rose-500/40',
            cyan: 'bg-cyan-500 shadow-cyan-500/40',
            amber: 'bg-amber-500 shadow-amber-500/40',
            indigo: 'bg-indigo-500 shadow-indigo-500/40',
        };
        return colors[color] || colors.blue;
    };

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                >
                    ติดตามได้ทุกเรื่องที่คุณสนใจ
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-lg md:text-xl font-medium"
                >
                    ไม่จำกัดแค่เทคโนโลยี เลือกหัวข้อหรือผู้เชี่ยวชาญที่คุณสนใจได้ทั้งหมด
                </motion.p>
            </div>

            {/* Categories Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16"
            >
                {categories.map((cat) => (
                    <motion.button
                        key={cat.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(prev => prev === cat.id ? '' : cat.id)}
                        className={`
                            relative py-4 px-6 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group
                            ${activeTab === cat.id ? getActiveButtonColor(cat.color) + ' text-white border-transparent' : getBgColor(cat.color, false)}
                        `}
                    >
                        {/* Glow effect on hover/active */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5`} />

                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-bold tracking-tight">{cat.label}</span>
                    </motion.button>
                ))}
            </motion.div>

            {/* News Cards */}
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {categoryNews[activeTab]?.map((news) => (
                            <div
                                key={news.id}
                                className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] hover:border-white/10 transition-colors group cursor-default"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 ${news.color || 'bg-blue-500'} rounded-full flex items-center justify-center text-sm font-black shadow-lg shadow-black/20 text-white`}>
                                        {news.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-sm tracking-tight">{news.source}</span>
                                            <HiCheckBadge className="text-blue-500" />
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{news.handle}</span>
                                    </div>
                                </div>
                                <p className="text-gray-200 font-medium leading-relaxed mb-6 line-clamp-2 group-hover:text-white transition-colors">
                                    {news.text}
                                </p>
                                <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-widest">
                                    <div className="w-1 h-1 bg-gray-600 rounded-full" />
                                    {news.time}
                                </div>
                            </div>
                        )) || (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-gray-500 font-bold italic opacity-40">Coming Soon...</p>
                                </div>
                            )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default InterestsSection;
