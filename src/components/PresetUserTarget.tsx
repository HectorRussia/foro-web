import { useState, useMemo, useEffect } from 'react';
import { FaWandMagicSparkles, FaUserPlus, FaTwitter } from 'react-icons/fa6';
import { HiCheckBadge } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import type { Recommendation } from '../interface/userTarget';
import { PRESET_DATA } from '../constants/PresetData';

export interface PresetUser extends Recommendation {
    followers: string;
    following: string;
    posts: string;
    profile_image: string;
}

export interface CategoryPreset {
    id: string;
    name: string;
    image: string;
    accent: string;
}

const CATEGORIES: CategoryPreset[] = [
    { id: 'tech', name: 'เทคโนโลยี', image: '/images/categories/Tech.jpg_202604080519.jpeg', accent: '#3b82f6' },
    { id: 'ai', name: 'AI', image: '/images/categories/AI.jpg_202604080519.jpeg', accent: '#a855f7' },
    { id: 'business', name: 'ธุรกิจ', image: '/images/categories/Business.png_202604080519.jpeg', accent: '#eab308' },
    { id: 'marketing', name: 'การตลาด', image: '/images/categories/Marketing.jpg_202604080519.jpeg', accent: '#f43f5e' },
    { id: 'finance', name: 'การเงิน', image: '/images/categories/Finance.png_202604080519.jpeg', accent: '#10b981' },
    { id: 'investment', name: 'การลงทุน', image: '/images/categories/Investment.png_202604080519.jpeg', accent: '#0ea5e9' },
    { id: 'crypto', name: 'คริปโต', image: '/images/categories/Crypto.png_202604080519.jpeg', accent: '#f59e0b' },
    { id: 'cyber_security', name: 'ความปลอดภัยไซเบอร์', image: '/images/categories/Cyber_Security.jpg_202604080519.jpeg', accent: '#38bdf8' },
    { id: 'health', name: 'สุขภาพ', image: '/images/categories/Health.jpeg_202604080519.jpeg', accent: '#ec4899' },
    { id: 'lifestyle', name: 'ไลฟ์สไตล์', image: '/images/categories/Lifestyle.jpg_202604080519.jpeg', accent: '#22c55e' },
    { id: 'economy', name: 'เศรษฐกิจ', image: '/images/categories/Economy.jpg_202604080519.jpeg', accent: '#3b82f6' },
    { id: 'politics', name: 'การเมือง', image: '/images/categories/Politics.jpeg_202604080519.jpeg', accent: '#64748b' },
    { id: 'sports', name: 'กีฬา', image: '/images/categories/Sports.jpeg_202604080519.jpeg', accent: '#f97316' },
    { id: 'entertainment', name: 'บันเทิง', image: '/images/categories/Entertainment.jpeg_202604080519.jpeg', accent: '#d946ef' },
    { id: 'travel', name: 'ท่องเที่ยว', image: '/images/categories/Travel.jpg_202604080519.jpeg', accent: '#38bdf8' },
    { id: 'food', name: 'อาหาร', image: '/images/categories/Food.jpg_202604080519.jpeg', accent: '#f59e0b' },
    { id: 'environment', name: 'สิ่งแวดล้อม', image: '/images/categories/Environment.jpg_202604080525.jpeg', accent: '#22c55e' },
    { id: 'education', name: 'การศึกษา', image: '/images/categories/Education.jpeg_202604080519.jpeg', accent: '#60a5fa' },
    { id: 'analysis', name: 'บทวิเคราะห์', image: '/images/categories/Analysis.jpg_202604080519.jpeg', accent: '#eab308' },
    { id: 'real_estate', name: 'อสังหาฯ', image: '/images/categories/Realestate.jpg_202604080519.jpeg', accent: '#94a3b8' },
    { id: 'automotive', name: 'ยานยนต์', image: '/images/categories/Automotive.jpg_202604080519.jpeg', accent: '#f97316' },
];

interface PresetUserTargetProps {
    onFollow: (name: string, x_account: string, profile_image: string) => Promise<void>;
}

const PresetUserTarget = ({ onFollow }: PresetUserTargetProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [seed, setSeed] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const randomUsers = useMemo(() => {
        if (!selectedCategory || !PRESET_DATA[selectedCategory]) return [];
        const categoryData = PRESET_DATA[selectedCategory];
        return [...categoryData].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [selectedCategory, seed]);

    const handleShuffle = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setSeed(prev => prev + 1);
        setIsRefreshing(false);
    };

    const handleCategoryClick = (id: string) => {
        if (selectedCategory === id) {
            handleShuffle();
        } else {
            setSelectedCategory(id);
            setSeed(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (selectedCategory && seed === 0) {
            setSeed(1);
        }
    }, [selectedCategory]);

    return (
        <div className="w-full mt-0">
            <div className="mb-8 relative overflow-visible">
                {/* Category Grid */}
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-3">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                opacity: { delay: idx * 0.05 },
                                y: { duration: 0.2 }
                            }}
                            onMouseEnter={() => setHoveredCategory(cat.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            onClick={() => handleCategoryClick(cat.id)}
                            disabled={isRefreshing}
                            className="group relative isolate aspect-[3/4] min-h-[176px] overflow-hidden rounded-[7px] border bg-[#071020] text-left shadow-[0_16px_36px_rgba(0,0,0,0.28)] transition-all duration-300 disabled:opacity-70"
                            style={{
                                borderColor: selectedCategory === cat.id || hoveredCategory === cat.id
                                    ? `${cat.accent}cc`
                                    : 'rgba(70,103,158,0.42)',
                                boxShadow: selectedCategory === cat.id || hoveredCategory === cat.id
                                    ? `0 18px 44px ${cat.accent}22`
                                    : '0 16px 36px rgba(0,0,0,0.28)'
                            }}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,0.72)_0%,rgba(3,8,18,0.18)_42%,rgba(3,8,18,0.54)_100%)]" />
                            <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-3 pt-3.5 text-center">
                                <span className="max-w-[8.5rem] text-[15px] font-black leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                                    {cat.name}
                                </span>
                            </div>

                            {selectedCategory === cat.id && (
                                <div className="absolute inset-0 rounded-[7px] ring-2 ring-white/50 ring-inset" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Random Users View */}
            {selectedCategory && (
                <div className="max-w-4xl mx-auto min-h-100">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 underline underline-offset-4 decoration-blue-500/30">
                            <FaWandMagicSparkles className="animate-pulse" />
                            แนะนำสำหรับคุณในหมวด {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                        </h3>
                        <button
                            onClick={handleShuffle}
                            disabled={isRefreshing}
                            className="text-[15px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-tight flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed group"
                        >
                            {isRefreshing ? (
                                <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="w-2 h-2 bg-gray-500 rounded-full group-hover:bg-white transition-colors" />
                            )}
                            <span>{isRefreshing ? 'กำลังสุ่ม...' : 'สุ่มใหม่'}</span>
                        </button>
                    </div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {isRefreshing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20 gap-4"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                                        <FaWandMagicSparkles className="absolute inset-0 m-auto text-blue-400 text-xl animate-pulse" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">กำลังสุ่มบัญชีใหม่ให้คุณ...</p>
                                </motion.div>
                            ) : randomUsers.length > 0 ? (
                                <motion.div
                                    key={`${selectedCategory}-${seed}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    {randomUsers.map((user, idx) => (
                                        <motion.div
                                            key={user.x_account}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group flex items-center gap-3 bg-[#0f172a]/80 border border-[#1e293b] p-3 md:p-4 rounded-2xl hover:border-blue-500/40 hover:bg-[#0f172a] transition-all duration-300 shadow-lg shadow-black/20"
                                        >
                                            {/* Avatar */}
                                            <div className="shrink-0 relative">
                                                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-[#1e293b] group-hover:border-blue-500/50 overflow-hidden transition-all duration-300">
                                                    <img
                                                        src={user.profile_image}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                        onLoad={(e) => {
                                                            (e.target as HTMLImageElement).parentElement?.classList.add('border-blue-500/30');
                                                        }}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 bg-white text-blue-500 rounded-full p-0.5 ring-2 ring-[#0f172a]">
                                                    <HiCheckBadge className="text-[10px] md:text-[12px]" />
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
                                                    <h2 className="text-xs md:text-sm font-black text-white truncate group-hover:text-blue-400 transition-colors uppercase">{user.name}</h2>
                                                    <span className="text-gray-500 bg-[#1e293b] px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0">@{user.x_account}</span>
                                                </div>
                                                <p className="text-gray-400 text-[10px] md:text-sm line-clamp-1 mb-1.5 leading-relaxed italic group-hover:text-gray-300 transition-colors">
                                                    "{user.reason}"
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-black text-white text-[10px] md:text-xs">{user.followers}</span>
                                                        <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold">F</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-black text-white text-[10px] md:text-xs">{user.following}</span>
                                                        <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold">Fw</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-black text-white text-[10px] md:text-xs">{user.posts}</span>
                                                        <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold">P</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className="shrink-0 flex flex-col gap-1.5">
                                                <button
                                                    onClick={() => onFollow(user.name, user.x_account, user.profile_image)}
                                                    className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-wide transition-all duration-200 active:scale-95 shadow-md shadow-blue-600/30 whitespace-nowrap"
                                                >
                                                    <FaUserPlus className="text-[8px]" />
                                                    <span>Follow</span>
                                                </button>
                                                <a
                                                    href={`https://twitter.com/${user.x_account}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-gray-700/50 rounded-lg text-gray-400 hover:text-white font-black text-[9px] md:text-[10px] uppercase tracking-wide transition-all duration-200 whitespace-nowrap"
                                                >
                                                    <FaTwitter className="text-[8px]" />
                                                    <span>Profile</span>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-12 bg-[#0f172a]/20 rounded-2xl border border-dashed border-[#1e293b] text-center"
                                >
                                    <p className="text-gray-700 font-black text-[10px] uppercase tracking-widest">ยังไม่มีข้อมูลในหมวดนี้</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PresetUserTarget;
