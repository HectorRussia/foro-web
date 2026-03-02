import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { filterCategories, filterResults } from '../../constants/LandingPage';
import { FaUserCircle } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';

const SmartFilterSection = () => {
    const [activeFilter, setActiveFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeFilter) {
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [activeFilter]);

    const getBtnStyle = (color: string, active: boolean) => {
        if (!active) return 'bg-[#0f172a]/40 border-white/5 text-gray-400 hover:border-white/20';

        const colors: Record<string, string> = {
            orange: 'bg-orange-500 text-white border-transparent shadow-lg shadow-orange-500/20',
            purple: 'bg-purple-600 text-white border-transparent shadow-lg shadow-purple-600/20',
            cyan: 'bg-[#009bbd] text-white border-transparent shadow-lg shadow-cyan-500/20',
            rose: 'bg-[#ff2d55] text-white border-transparent shadow-lg shadow-rose-500/20',
        };
        return colors[color] || colors.orange;
    };

    return (
        <section className="py-20 px-6 relative">
            <div className="max-w-2xl mx-auto text-center mb-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-black mb-3 tracking-tight"
                >
                    <span className="text-blue-400">AI</span> Smart Filter
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-400 text-base md:text-lg font-medium"
                >
                    บอก AI ว่าคุณอยากได้โพสต์แบบไหน แล้วให้ AI หามาให้
                </motion.p>
            </div>

            {/* Filters Grid - Medium Sized */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
                {filterCategories.map((cat) => (
                    <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                            if (activeFilter === cat.id) {
                                setActiveFilter('');
                            } else {
                                setActiveFilter(cat.id);
                            }
                        }}
                        className={`
                            py-4 px-6 rounded-2xl border transition-all duration-300 flex items-center gap-3 font-bold text-base
                            ${getBtnStyle(cat.color, activeFilter === cat.id)}
                        `}
                    >
                        <span className="text-xl">{cat.icon}</span>
                        <span>{cat.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Results Canvas - Medium Sized */}
            <div className="max-w-3xl mx-auto min-h-[300px]">
                <AnimatePresence mode="wait">
                    {activeFilter ? (
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex flex-col gap-5 relative z-10">
                                {/* Query bubble */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <FaUserCircle className="text-lg" />
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl rounded-tl-none font-bold text-sm text-gray-200"
                                    >
                                        {isLoading ? "กำลังวิเคราะห์..." : filterResults[activeFilter]?.query}
                                    </motion.div>
                                </div>

                                {/* AI Response bubble */}
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={isLoading ? { rotate: 360 } : {}}
                                        transition={isLoading ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
                                        className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
                                    >
                                        <BsStars className="text-lg" />
                                    </motion.div>
                                    <div className="font-bold text-sm text-blue-400">
                                        {isLoading ? "ประมวลผลข้อมูล..." : filterResults[activeFilter]?.found}
                                    </div>
                                </div>

                                {/* Result Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                    <AnimatePresence>
                                        {!isLoading && filterResults[activeFilter]?.items?.map((item: any, idx: number) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-[#030e17]/80 border border-white/5 p-4 rounded-2xl hover:border-blue-500/20 transition-all group"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-7 h-7 shrink-0 ${item.color} rounded-full flex items-center justify-center text-[9px] font-black`}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="text-[10px] font-bold text-gray-200 truncate">{item.source}</div>
                                                        <div className="text-[8px] text-gray-500 truncate">{item.handle}</div>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-300 leading-snug mb-3 line-clamp-2">
                                                    {item.text}
                                                </p>
                                                <div className="text-[9px] font-black text-cyan-400/80 uppercase tracking-tight">
                                                    {item.likes}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {isLoading && [1, 2, 3].map((i) => (
                                        <div key={i} className="h-32 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            </div>

                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-[300px] border border-dashed border-white/5 rounded-[32px] flex items-center justify-center"
                        >
                            <p className="font-bold text-sm md:text-base uppercase tracking-widest bg-clip-text text-transparent bg-linear-to-b from-gray-500 to-transparent">
                                เลือกฟิลเตอร์ด้านบนเพื่อเริ่มต้น
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default SmartFilterSection;
