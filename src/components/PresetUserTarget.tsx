import { useState } from 'react';
import { motion } from 'framer-motion';

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
    onSelectCategory: (categoryName: string) => void;
    selectedCategoryName?: string;
    isLoading?: boolean;
}

const PresetUserTarget = ({ onSelectCategory, selectedCategoryName, isLoading = false }: PresetUserTargetProps) => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
                            onClick={() => onSelectCategory(cat.name)}
                            disabled={isLoading}
                            className="group relative isolate aspect-[3/4] min-h-[176px] overflow-hidden rounded-[7px] border bg-[#071020] text-left shadow-[0_16px_36px_rgba(0,0,0,0.28)] transition-all duration-300 disabled:opacity-70"
                            style={{
                                borderColor: selectedCategoryName === cat.name || hoveredCategory === cat.id
                                    ? `${cat.accent}cc`
                                    : 'rgba(70,103,158,0.42)',
                                boxShadow: selectedCategoryName === cat.name || hoveredCategory === cat.id
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

                            {selectedCategoryName === cat.name && (
                                <div className="absolute inset-0 rounded-[7px] ring-2 ring-white/50 ring-inset" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PresetUserTarget;
