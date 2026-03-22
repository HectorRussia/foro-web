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
    HiOutlineMinusCircle,
} from "react-icons/hi2";
import { IoIosMore } from 'react-icons/io';
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

const DashboardCard = ({ post, variant = 'list', categories = [], onAddToCategory, onRemoveFromCategory, onDelete }: DashboardCardProps) => {
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
    const isGrid = variant === 'grid';

    // Helper to format large numbers like 21K
    const formatNumber = (num: number = 0) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className={`group bg-[#16181c]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] transition-all duration-300 hover:bg-white/4 hover:shadow-2xl shadow-black/40 flex flex-col relative
            ${isCompact ? 'p-5' : 'p-7'}
            ${isGrid ? 'h-full' : ''}
        `}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className={`
                            rounded-full flex items-center justify-center bg-gray-800 border-2 border-white/10 overflow-hidden
                            ${isCompact ? 'w-10 h-10' : 'w-12 h-12'}
                        `}>
                            {post.tweet_profile_pic
                                ? <img src={post.tweet_profile_pic} alt="owner" className="w-full h-full object-cover" />
                                : <div className='w-full h-full bg-[#1e293b] flex items-center justify-center text-white font-bold'>{post.title.charAt(0)}</div>
                            }
                        </div>
                    </div>
                    {/* Name & Handle */}
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-white leading-tight truncate text-[16px]">
                            {post.title}
                        </h3>
                        <span className="text-gray-500 text-[14px]">
                            @{(post.source || 'news').replace(/\s+/g, '').toLowerCase()}
                        </span>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1">
                    {/* Time Bubble */}
                    <div className="px-3.5 py-1.5 bg-white/5 border border-white/5 rounded-2xl text-gray-400 text-[13px] font-black mr-1 uppercase">
                        {dayjs(post.tweet_created_at || post.created_at).isSame(dayjs(), 'day')
                            ? dayjs(post.tweet_created_at || post.created_at).fromNow(true)
                                .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                            : dayjs(post.tweet_created_at || post.created_at).format('D MMM')}
                    </div>

                    {/* Options (Three Dots) - User wanted this instead of bookmarks */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                        >
                            <IoIosMore className="text-2xl" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                {onAddToCategory && categories.length > 0 && (
                                    <>
                                        <div className="p-3 border-b border-white/5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">เพิ่มลงในหมวดหมู่</span>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto py-1">
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => {
                                                        onAddToCategory?.(category.id, post.id);
                                                        setShowMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group"
                                                >
                                                    <HiOutlinePlus className="text-lg text-gray-500 group-hover:text-blue-400" />
                                                    <span className="truncate font-medium">{category.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {onRemoveFromCategory && (
                                    <button
                                        onClick={() => {
                                            onRemoveFromCategory(post.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-3 border-t border-white/5"
                                    >
                                        <HiOutlineMinusCircle className="text-lg" />
                                        <span className="font-medium">ลบออกจากหมวดหมู่</span>
                                    </button>
                                )}

                                {onDelete && (
                                    <button
                                        onClick={() => {
                                            onDelete(post.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3 border-t border-white/5"
                                    >
                                        <HiOutlineTrash className="text-lg" />
                                        <span className="font-medium">ลบข่าวถาวร</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* External Link */}
                    <a href={post.url} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 text-gray-500 hover:text-blue-400 hover:bg-white/5 rounded-full transition-all">
                        <HiOutlineArrowTopRightOnSquare className="text-2xl" />
                    </a>
                </div>
            </div>

            {/* Content Body */}
            <div className={`text-gray-200 leading-relaxed tracking-tight wrap-break-word
                ${isCompact ? 'text-[14px] mb-4 line-clamp-3' : 'text-[16px] mb-6 mt-2'}
                ${isGrid ? 'grow' : ''}
            `}>
                {post.content}
            </div>

            {/* Subtle Divider (Matches image aesthetic) */}
            <div className="h-px w-full bg-white/5 mb-5 shrink-0" />

            {/* Stats Footer (Matches image layout) */}
            <div className="flex items-center gap-6 text-[13px] font-bold text-gray-500/80 px-1 shrink-0">
                <div className="flex items-center gap-1.5 group/stat hover:text-blue-400 transition-colors cursor-default">
                    <HiOutlineChartBar className="text-[19px] opacity-70" />
                    <span className="font-black">{formatNumber(post.view_count)}</span>
                </div>
                <div className="flex items-center gap-1.5 group/stat hover:text-rose-400 transition-colors cursor-default">
                    <HiOutlineHeart className="text-[19px] opacity-70" />
                    <span className="font-black">{formatNumber(post.like_count)}</span>
                </div>
                <div className="flex items-center gap-1.5 group/stat hover:text-emerald-400 transition-colors cursor-default">
                    <HiOutlineArrowPathRoundedSquare className="text-[19px] opacity-70" />
                    <span className="font-black">{formatNumber(post.retweet_count)}</span>
                </div>
                <div className="flex items-center gap-1.5 group/stat hover:text-cyan-400 transition-colors cursor-default">
                    <HiOutlineChatBubbleLeft className="text-[19px] opacity-70" />
                    <span className="font-black">{formatNumber(post.reply_count)}</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardCard;