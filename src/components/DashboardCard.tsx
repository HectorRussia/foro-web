import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/th';
import {
    HiOutlineChartBar,
    HiOutlineHeart,
    HiOutlineArrowPathRoundedSquare,
    HiOutlineChatBubbleLeft,
    HiOutlineArrowTopRightOnSquare,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineBookmark,
    HiOutlinePencilSquare
} from "react-icons/hi2";
import { IoIosMore } from 'react-icons/io';
import { LuChevronLeft } from "react-icons/lu";
import type { NewsItem } from '../interface/news';
import type { Category } from '../interface/category';

dayjs.extend(relativeTime);
dayjs.locale('th');

interface DashboardCardProps {
    post: NewsItem;
    variant?: 'list' | 'grid' | 'compact';
    categories?: Category[];
    onAddToCategory?: (categoryId: number, newsId: number) => Promise<void>;
    onRemoveFromCategory?: (newsId: number) => Promise<void>;
    onDelete?: (newsId: number) => Promise<void>;
}

const DashboardCard = ({ post, variant = 'list', categories = [], onAddToCategory, onDelete }: DashboardCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const isCompact = variant === 'compact';

    // Helper to format large numbers like 21K
    const formatNumber = (num: number = 0) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className={`group relative flex flex-col p-6 lg:p-7 rounded-[28px] transition-all duration-500 overflow-hidden h-full
            ${showMenu ? 'z-50' : 'z-auto'}
            bg-[#111112] border border-white/5 hover:border-blue-500/30
        `}>
            {/* Hover Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(0, 112, 243, 0.1), transparent 70%)' }}
            />

            {/* Header Area */}
            <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar */}
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1a1a1c] border border-white/10 overflow-hidden">
                            {post.tweet_profile_pic ? (
                                <img src={post.tweet_profile_pic} alt="owner" className="w-full h-full object-cover" />
                            ) : (
                                <div className='w-full h-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black text-sm uppercase'>
                                    {post.title.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Info */}
                    <div className="flex flex-col min-w-0 pt-0.5">
                        <h3 className="font-black text-white text-base leading-tight truncate tracking-tight uppercase group-hover:text-blue-400 transition-colors">
                            {post.title}
                        </h3>
                        <span className="text-gray-500 font-bold text-xs tracking-tight truncate opacity-70">
                            @{(post.source || 'news').replace(/\s+/g, '').toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-1 shrink-0">
                    <div className="px-3 py-1.5 bg-white/5 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-widest mr-1">
                        {dayjs(post.tweet_created_at || post.created_at).isSame(dayjs(), 'day') 
                            ? dayjs(post.tweet_created_at || post.created_at).fromNow(true)
                                .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                            : dayjs(post.tweet_created_at || post.created_at).format('D MMM')}
                    </div>

                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                        <HiOutlineBookmark className="text-lg" />
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                            <IoIosMore className="text-lg" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                {onAddToCategory && categories.length > 0 && categories.map((category) => (
                                    <button key={category.id} onClick={() => { onAddToCategory?.(category.id, post.id); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
                                        <HiOutlinePlus className="text-lg text-gray-500" />
                                        <span className="truncate font-bold">{category.name}</span>
                                    </button>
                                ))}
                                {onDelete && (
                                    <button onClick={() => { onDelete(post.id); setShowMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3 border-t border-white/5">
                                        <HiOutlineTrash className="text-lg" />
                                        <span className="font-bold">ลบข่าวถาวร</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-all">
                        <HiOutlineArrowTopRightOnSquare className="text-lg" />
                    </a>
                </div>
            </div>

            {/* Reply Badge Component */}
            {post.content.toLowerCase().includes('http') && (
                <div className="mb-5 flex relative z-10">
                    <div className="bg-blue-600/10 border border-blue-500/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        <LuChevronLeft className="rotate-180 text-xs" />
                        <span>ตอบกลับ @{(post.source || 'news').split(' ')[0]}</span>
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className={`text-gray-100 font-bold leading-[1.6] tracking-tight wrap-break-word relative z-10
                ${isCompact ? 'text-xs md:text-sm line-clamp-3 mb-5' : 'text-sm md:text-base mb-8'}
                grow
            `}>
                {post.content}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4 text-[11px] font-black text-gray-500">
                    <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-default">
                        <HiOutlineChartBar className="text-sm opacity-60" />
                        <span>{formatNumber(post.view_count)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-default">
                        <HiOutlineHeart className="text-sm opacity-60" />
                        <span>{formatNumber(post.like_count)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-default">
                        <HiOutlineArrowPathRoundedSquare className="text-sm opacity-60" />
                        <span>{formatNumber(post.retweet_count)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-cyan-500 transition-colors cursor-default">
                        <HiOutlineChatBubbleLeft className="text-sm opacity-60" />
                        <span>{formatNumber(post.reply_count)}</span>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest group/action">
                    <HiOutlinePencilSquare className="text-sm group-hover/action:scale-110 transition-transform" />
                    <span>สร้างคอนเทนต์</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardCard;