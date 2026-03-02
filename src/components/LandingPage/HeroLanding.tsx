
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHeart } from 'react-icons/fa6';
import { HiCheckBadge } from 'react-icons/hi2';
import { newsBatches } from '../../constants/LandingPage';
import { useAuth } from '../../contexts/AuthContext';

interface HeroLandingProps {
    newsIndex: number;
}

const HeroLanding = ({ newsIndex }: HeroLandingProps) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <section className="relative px-6 pt-32 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">

            {/* Left side: Text content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-center lg:text-left z-10"
            >
                <motion.h1
                    className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    FORO
                    <span className="block mt-4 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400">
                        AI สรุปข่าว
                    </span>
                    <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-rose-400">
                        อ่านง่าย ได้ประเด็น
                    </span>
                </motion.h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                    ติดตามเรื่องที่คุณสนใจจาก X แล้วให้ AI ช่วยสรุปให้ <br className="hidden md:block" />
                    อ่านเร็ว เข้าใจทันที ไม่พลาดทุกประเด็นสำคัญ
                </p>

                {isAuthenticated ? (
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/30 active:scale-95 group"
                    >
                        <span>ไปที่แดชบอร์ด</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <Link to="/login" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/30 active:scale-95 group">
                        <span>เริ่มต้นใช้งานฟรี</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </motion.div>

            {/* Right side: Animation */}
            <div className="flex-1 relative w-full h-[600px] flex items-center justify-center lg:translate-y-12">

                {/* Background floating small cards (Image 2 style) */}
                <AnimatePresence>
                    {newsBatches[newsIndex].map((item, idx) => (
                        <motion.div
                            key={`float-${item.id}`}
                            initial={{
                                opacity: 0,
                                scale: 0.3,
                                x: idx === 0 ? -400 : idx === 1 ? 400 : 0,
                                y: idx === 2 ? 400 : -200,
                                rotate: idx * 15 - 15
                            }}
                            animate={{
                                opacity: [0, 0.5, 0],
                                scale: [0.3, 1, 0.4],
                                x: 0,
                                y: 0,
                                rotate: 0
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: idx * 0.8,
                                ease: "easeInOut"
                            }}
                            className="absolute hidden md:block bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-10 w-64 pointer-events-none"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-xs`}>{item.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black">{item.source}</span>
                                    <span className="text-[8px] text-gray-500 font-bold">{item.handle}</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="w-full h-1.5 bg-gray-700/50 rounded-full" />
                                <div className="w-4/5 h-1.5 bg-gray-700/30 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Main Dashboard Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-20 w-full max-w-[460px] bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden group"
                >
                    {/* Card Glow */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 blur-[100px]" />

                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="flex items-center gap-4">
                            <img src="/images/LOGO-FORO/FORO_TP_W.png" alt="logo" className="w-10 h-10" />
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-black leading-none mb-1">FORO Summary</h3>
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">จาก 3 บัญชี X</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Live</span>
                        </div>
                    </div>

                    {/* News Items Content */}
                    <div className="space-y-4 relative">
                        <AnimatePresence mode='popLayout'>
                            {newsBatches[newsIndex].map((news, idx) => (
                                <motion.div
                                    key={news.id}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -30, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                                    className="bg-[#030e17]/80 border border-[#1e293b] p-5 rounded-3xl hover:border-blue-500/30 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${news.color} rounded-full flex items-center justify-center text-lg shadow-lg shadow-black/20`}>
                                                {news.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-sm">{news.source}</span>
                                                    <HiCheckBadge className="text-blue-500" />
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{news.handle}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-bold text-gray-400">{news.category}</span>
                                    </div>
                                    <p className="text-md font-medium text-gray-200 leading-tight mb-4">
                                        {news.text}
                                    </p>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <FaHeart className="text-[10px] text-rose-500" />
                                            <span className="text-[10px] font-bold">{news.likes} likes</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold">
                                            <div className="w-1 h-1 bg-gray-500 rounded-full mr-1" />
                                            <span>{news.time}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Bar Info */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative">
                        <div className="flex -space-x-3">
                            {[
                                { char: 'A', color: 'from-blue-500 to-cyan-500' },
                                { char: 'W', color: 'from-purple-500 to-pink-500' },
                                { char: 'T', color: 'from-orange-500 to-amber-500' }
                            ].map((item, i) => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0f172a] bg-linear-to-br ${item.color} flex items-center justify-center text-[8px] font-bold overflow-hidden shadow-lg`}>
                                    <div className="w-full h-full bg-white/10 flex items-center justify-center">{item.char}</div>
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-[#1e293b] flex items-center justify-center text-[10px] font-black text-blue-400">+12</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Updated live</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroLanding