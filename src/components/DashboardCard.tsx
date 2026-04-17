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
import { toast } from 'react-hot-toast';
import type { NewsItem } from '../interface/news';
import type { Category } from '../interface/category';
import { createBookmark, removeBookmarkByNewsId, checkBookmark } from '../api/bookmark';

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
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const check = async () => {
            try {
                const res = await checkBookmark(post.id);
                if (!cancelled) setIsBookmarked(res.is_bookmarked);
            } catch { /* ignore */ }
        };
        check();
        return () => { cancelled = true; };
    }, [post.id]);

    const handleToggleBookmark = async () => {
        if (isBookmarkLoading) return;
        setIsBookmarkLoading(true);
        try {
            if (isBookmarked) {
                await removeBookmarkByNewsId(post.id);
                setIsBookmarked(false);
                toast.success('ลบ Bookmark แล้ว');
            } else {
                await createBookmark(post.id);
                setIsBookmarked(true);
                toast.success('Bookmark แล้ว');
            }
        } catch {
            toast.error('เกิดข้อผิดพลาดในการ Bookmark');
        } finally {
            setIsBookmarkLoading(false);
        }
    };

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
        <div className={`group relative flex flex-col rounded-[30px] transition-all overflow-hidden h-full font-card
            ${showMenu ? 'z-50' : 'z-auto'}
            border border-white/6 hover:border-blue-500/20
        `}
            style={{
                background: 'linear-gradient(145deg, #111112 0%, #181819 100%)',
                padding: '20px 24px 16px',
                transition: '0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
            {/* Hover Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(0, 112, 243, 0.1), transparent 70%)' }}
            />

            {/* Header Area */}
            <div className="flex items-start justify-between mb-4.5 relative z-10">
                <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar */}
                    <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1a1a1c] border border-white/10 overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.15)]">
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
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-white text-[15px] leading-tight truncate tracking-tight group-hover:text-blue-400 transition-colors capitalize">
                            {post.title}
                        </h3>
                        <span className="text-gray-500 font-medium text-[13px] tracking-tight truncate opacity-80 mt-1">
                            @{(post.source || 'news').replace(/\s+/g, '').toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-1 shrink-0">
                        <div className="px-3 py-1 bg-[#0f1419]/80 rounded-full text-white text-[11px] font-bold tracking-tight mr-2 flex items-center justify-center border border-white/5">
                        {dayjs(post.tweet_created_at || post.created_at).isSame(dayjs(), 'day')
                            ? dayjs(post.tweet_created_at || post.created_at).fromNow(true)
                                .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                            : dayjs(post.tweet_created_at || post.created_at).format('D MMM')}
                    </div>

                    <button
                        onClick={handleToggleBookmark}
                        disabled={isBookmarkLoading}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-all ${
                            isBookmarked ? 'text-yellow-400' : 'text-gray-500 hover:text-white'
                        } ${isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isBookmarked ? 'ลบ Bookmark' : 'Bookmark'}
                    >
                        <HiOutlineBookmark className={`text-lg ${isBookmarked ? 'fill-yellow-400' : ''}`} />
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
                    <div className="bg-blue-500/10 border border-blue-400/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest cursor-default hover:bg-blue-500/20 transition-colors">
                        <HiOutlineChatBubbleLeft className="text-xs" />
                        <span>ตอบกลับ @{(post.source || 'news').split(' ')[0]}</span>
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className={`text-white leading-relaxed tracking-tight wrap-break-word relative z-10
                ${isCompact ? 'text-[13px] line-clamp-3 mb-4' : 'text-[15px] mb-5'}
                grow
            `} style={{ fontFamily: 'var(--font-card)', fontWeight: 500 }}>
                {post.content}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between mt-auto pt-4.5 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500">
                    <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-default">
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

                <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2c] border border-white/5 rounded-xl text-[10px] font-black text-gray-300 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest group/action shadow-lg">
                    <HiOutlinePencilSquare className="text-sm group-hover/action:scale-110 transition-transform" />
                    <span>สร้างคอนเทนต์</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardCard;
