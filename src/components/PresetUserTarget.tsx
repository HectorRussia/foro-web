import { useState, useMemo } from 'react';
import { FaRobot, FaMicrochip, FaBriefcase, FaChartLine, FaHandHoldingDollar, FaBitcoin, FaHeartPulse, FaPersonWalking, FaGlobe, FaBuildingColumns, FaWandMagicSparkles, FaUserPlus, FaTwitter, FaLightbulb, FaGavel } from 'react-icons/fa6';
import { HiCheckBadge } from 'react-icons/hi2';
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
    icon: React.ReactNode;
    color: string;
}

const CATEGORIES: CategoryPreset[] = [
    { id: 'tech', name: 'เทคโนโลยี', icon: <FaMicrochip />, color: 'from-blue-500 to-cyan-500' },
    { id: 'ai', name: 'AI', icon: <FaRobot />, color: 'from-purple-500 to-indigo-500' },
    { id: 'business', name: 'ธุรกิจ', icon: <FaBriefcase />, color: 'from-emerald-500 to-teal-500' },
    { id: 'marketing', name: 'การตลาด', icon: <FaChartLine />, color: 'from-orange-500 to-red-500' },
    { id: 'finance', name: 'การเงิน', icon: <FaBuildingColumns />, color: 'from-amber-500 to-yellow-500' },
    { id: 'investment', name: 'การลงทุน', icon: <FaHandHoldingDollar />, color: 'from-green-500 to-emerald-500' },
    { id: 'crypto', name: 'คริปโต', icon: <FaBitcoin />, color: 'from-orange-400 to-yellow-600' },
    { id: 'health', name: 'สุขภาพ', icon: <FaHeartPulse />, color: 'from-rose-500 to-pink-500' },
    { id: 'lifestyle', name: 'ไลฟ์สไตล์', icon: <FaPersonWalking />, color: 'from-fuchsia-500 to-purple-500' },
    { id: 'economy', name: 'เศรษฐกิจ', icon: <FaGlobe />, color: 'from-sky-500 to-blue-500' },
    { id: 'politics', name: 'การเมือง', icon: <FaGavel />, color: 'from-slate-500 to-gray-500' },
    { id: 'self_dev', name: 'การพัฒนาตัวเอง', icon: <FaLightbulb />, color: 'from-lime-500 to-green-500' },
];

interface PresetUserTargetProps {
    onFollow: (name: string, x_account: string, profile_image: string) => Promise<void>;
}

const PresetUserTarget = ({ onFollow }: PresetUserTargetProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [seed, setSeed] = useState(0);

    const randomUsers = useMemo(() => {
        if (!selectedCategory || !PRESET_DATA[selectedCategory]) return [];
        const categoryData = PRESET_DATA[selectedCategory];
        return [...categoryData].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [selectedCategory, seed]);

    const handleCategoryClick = (id: string) => {
        if (selectedCategory === id) {
            setSeed(prev => prev + 1);
        } else {
            setSelectedCategory(id);
        }
    };

    return (
        <div className="w-full mt-10">
            <h2 className="text-sm font-black text-gray-400 mb-6 flex items-center justify-center gap-3 uppercase tracking-widest text-center">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                ลองติดตามผู้เชี่ยวชาญจากหมวดหมู่ที่คุณสนใจ
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            </h2>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-8 max-w-4xl mx-auto">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${selectedCategory === cat.id
                            ? 'bg-linear-to-br ' + cat.color + ' border-transparent shadow-lg shadow-blue-500/20'
                            : 'bg-[#0f172a]/40 border-[#1e293b] hover:border-gray-500 hover:bg-[#0f172a]/60'
                            }`}
                    >
                        <div className={`text-xl mb-1.5 transition-transform group-hover:scale-110 ${selectedCategory === cat.id ? 'text-white' : 'text-gray-500'
                            }`}>
                            {cat.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedCategory === cat.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                            }`}>
                            {cat.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Random Users View */}
            {selectedCategory && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 underline underline-offset-4 decoration-blue-500/30">
                            <FaWandMagicSparkles className="animate-pulse" />
                            แนะนำสำหรับคุณในหมวด {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                        </h3>
                        <button
                            onClick={() => setSeed(prev => prev + 1)}
                            className="text-[15px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-tight flex items-center gap-1.5 cursor-pointer"
                        >
                            <span className="w-2 h-2 bg-gray-500 rounded-full" />
                            สุ่มใหม่
                        </button>
                    </div>

                    {randomUsers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {randomUsers.map((user, idx) => (
                                <div key={idx} className="group flex items-center gap-3 bg-[#0f172a]/80 border border-[#1e293b] p-3 md:p-4 rounded-2xl hover:border-blue-500/40 hover:bg-[#0f172a] transition-all duration-300">
                                    {/* Avatar */}
                                    <div className="shrink-0 relative">
                                        <img
                                            src={user.profile_image}
                                            alt={user.name}
                                            className="w-11 h-11 md:w-14 md:h-14 rounded-full border-2 border-[#1e293b] group-hover:border-blue-500/50 object-cover transition-all duration-300"
                                        />
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
                                        <p className="text-gray-500 text-[10px] md:text-[15px] line-clamp-1 mb-1.5 leading-relaxed italic">
                                            "{user.reason}"
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <span className="font-black text-white text-[10px] md:text-xs">{user.followers}</span>
                                                <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold ml-0.5">F</span>
                                            </div>
                                            <div>
                                                <span className="font-black text-white text-[10px] md:text-xs">{user.following}</span>
                                                <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold ml-0.5">Fw</span>
                                            </div>
                                            <div>
                                                <span className="font-black text-white text-[10px] md:text-xs">{user.posts}</span>
                                                <span className="text-gray-600 text-[7px] uppercase tracking-widest font-bold ml-0.5">P</span>
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 bg-[#0f172a]/20 rounded-2xl border border-dashed border-[#1e293b] text-center">
                            <p className="text-gray-700 font-black text-[10px] uppercase">ยังไม่มีข้อมูลในหมวดนี้</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PresetUserTarget;