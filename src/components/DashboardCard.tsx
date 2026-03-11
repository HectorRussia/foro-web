import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/th';
import {
    FaCopy,
    FaCheck,
    FaExternalLinkAlt,
    FaPlus,
    FaTrash,
    FaMinusCircle,
    FaRegComment,
    FaRetweet,
    FaQuoteLeft,
    FaEye,
} from 'react-icons/fa';
import { AiOutlineLike } from "react-icons/ai";
dayjs.extend(relativeTime);
dayjs.locale('th');
import { IoIosMore, } from 'react-icons/io';
import { HiOutlineClock } from 'react-icons/hi2';
import type { NewsItem } from '../interface/news';
import type { Category } from '../interface/category';

const iconsDash = [
    { icon: <IoIosMore />, label: "More" },
    { icon: <FaExternalLinkAlt />, label: "External Link" },
    { icon: <FaCopy />, label: "Copy" },
]

interface DashboardCardProps {
    post: NewsItem;
    variant?: 'list' | 'grid' | 'compact';
    categories?: Category[];
    onAddToCategory?: (categoryId: number, newsId: number) => Promise<void>;
    onRemoveFromCategory?: (newsId: number) => Promise<void>;
    onDelete?: (newsId: number) => Promise<void>;
}

const DashboardCard = ({ post, variant = 'list', categories = [], onAddToCategory, onRemoveFromCategory, onDelete }: DashboardCardProps) => {
    const [copied, setCopied] = useState(false);
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

    const handleCopy = () => {
        navigator.clipboard.writeText(post.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isCompact = variant === 'compact';
    const isGrid = variant === 'grid';

    return (
        <div className={`group bg-[#0f172a] border border-[#1e293b] rounded-2xl transition-all duration-200 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 flex flex-col relative
            ${isCompact ? 'p-4' : 'p-6'}
            ${isGrid ? 'h-full justify-between' : ''}
        `}>
            <div className={`flex items-start justify-between ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-center gap-3">
                    <div className={`
                        rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0
                        ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}
                    `}>
                        {post.tweet_profile_pic
                            ? <img src={post.tweet_profile_pic} alt="owner" className="w-full h-full object-cover" />
                            : <div className='w-full h-full bg-[#1e293b] flex items-center justify-center'>{post.title.charAt(0)}</div>
                        }
                    </div>
                    <div className="min-w-0">
                        <h3 className={`font-semibold text-white leading-tight wrap-break-word pr-2 ${isCompact ? 'text-base' : 'text-lg'}`}>
                            {post.title}
                        </h3>
                        {!isCompact && (post.tweet_created_at || post.created_at) && (
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1 font-medium opacity-80">
                                <HiOutlineClock className="text-[14px]" />
                                <span>
                                    {(() => {
                                        // Prioritize actual tweet date from Twitter, fallback to DB record date
                                        const rawDate = post.tweet_created_at || post.created_at;
                                        if (!rawDate) return '';

                                        const d = dayjs(rawDate);
                                        if (!d.isValid()) return rawDate;

                                        // Thai Date (BE) - Native helper for consistent BE year conversion
                                        const thaiDate = d.toDate().toLocaleDateString('th-TH', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        });

                                        // Thai relative time (e.g., "1 ชั่วโมงที่แล้ว")
                                        const relative = d.fromNow();

                                        return `${thaiDate} • ${relative}`;
                                    })()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Options Icon with Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`text-gray-500 hover:text-white rounded-full hover:bg-white/5 transition-colors ${isCompact ? 'p-1' : 'p-2'}`}
                    >
                        {iconsDash[0].icon}
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-xl overflow-hidden z-20">
                            {onAddToCategory && categories.length > 0 && (
                                <>
                                    <div className="p-2 border-b border-gray-700">
                                        <span className="text-xs text-gray-400 px-2">เพิ่มลงในหมวดหมู่</span>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    onAddToCategory?.(category.id, post.id);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <FaPlus className="text-xs" />
                                                <span className="truncate">{category.name}</span>
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
                                    className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-gray-700 hover:text-red-200 transition-colors flex items-center gap-2"
                                >
                                    <FaMinusCircle className="text-xs" />
                                    <span>ลบออกจากหมวดหมู่</span>
                                </button>
                            )}

                            {onDelete && (
                                <>
                                    <div className="border-t border-gray-700 my-1"></div>
                                    <button
                                        onClick={() => {
                                            onDelete(post.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                    >
                                        <FaTrash className="text-xs" />
                                        <span>ลบข่าว</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`text-gray-300 font-light overflow-hidden wrap-break-word leading-relaxed
                ${isCompact ? 'text-sm mb-3 line-clamp-2' : 'text-base mb-4'}
                ${isGrid ? 'grow line-clamp-5 md:line-clamp-4' : ''}
            `}>
                {post.content}
            </div>

            {/* Interaction Stats */}
            <div className={`flex items-center gap-4 mb-4 text-xs font-medium text-gray-500/80 ${isCompact ? 'px-1' : ''}`}>
                <div className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-default group/stat">
                    <AiOutlineLike className="text-[14px]" />
                    <span>{post.like_count?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-default group/stat">
                    <FaRegComment className="text-[14px]" />
                    <span>{post.reply_count?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-green-400 transition-colors cursor-default group/stat">
                    <FaRetweet className="text-[14px]" />
                    <span>{post.retweet_count?.toLocaleString() || 0}</span>
                </div>
                {post.quote_count !== undefined && post.quote_count > 0 && (
                    <div className="flex items-center gap-1.5 hover:text-purple-400 transition-colors cursor-default group/stat">
                        <FaQuoteLeft className="text-[12px]" />
                        <span>{post.quote_count?.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-default group/stat ml-auto">
                    <FaEye className="text-[14px]" />
                    <span>{post.view_count?.toLocaleString() || 0}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-auto">
                {/* Tags placeholder if needed */}
            </div>

            <div className={`flex items-center gap-2 border-t border-[#1e293b] ${isCompact ? 'pt-2 mt-auto' : 'pt-4 mt-auto'}`}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <button className={`w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-blue-400 transition-all font-medium border border-transparent hover:border-blue-900/30
                        ${isCompact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'}
                    `}>
                        {iconsDash[1].icon}
                        <span className={isGrid ? 'md:hidden lg:inline' : ''}>ดูโพสต์</span>
                    </button>
                </a>
                <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-black/40 hover:bg-black/60 text-gray-400 hover:text-green-400 transition-all font-medium border border-transparent hover:border-green-900/30
                        ${isCompact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'}
                    `}
                >
                    {copied ? <FaCheck className="text-green-500" /> : iconsDash[2].icon}
                    {copied ?
                        <span className="text-green-500">คัดลอก</span>
                        : <span className={isGrid ? 'md:hidden lg:inline' : ''}>แชร์ลิ้งค์</span>
                    }
                </button>
            </div>
        </div >
    )
}


export default DashboardCard