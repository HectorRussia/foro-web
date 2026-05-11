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
    HiOutlineBookmark,
    HiOutlinePencilSquare,
    HiOutlineDocumentText
} from "react-icons/hi2";
import { toast } from 'react-hot-toast';
import type { NewsItem } from '../interface/news';
import type { Category } from '../interface/category';
import { createBookmark, removeBookmarkByNewsId, checkBookmark } from '../api/bookmark';
import MediaLightbox from './MediaLightbox';

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

const DashboardCard = ({ post, variant = 'list'}: DashboardCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [rssAvatarFailed, setRssAvatarFailed] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const mediaUrls = post.media_urls ?? [];
    const mediaType = post.media_type ?? null;
    const hasMedia = mediaUrls.length > 0;
    const isRss = post.source_type === 'rss';
    const contentText = String(post.content ?? '');
    const displayDate = post.tweet_created_at || post.published_at || post.created_at;
    const sourceLabel = post.source || post.username || (isRss ? 'RSS' : 'news');
    const sourceHandle = isRss ? sourceLabel : `@${sourceLabel.replace(/\s+/g, '').replace(/^@/, '').toLowerCase()}`;
    const avatarFallback = (sourceLabel || post.title || 'N').charAt(0);
    const hasSocialMetrics = [post.view_count, post.like_count, post.retweet_count, post.reply_count]
        .some(value => Number(value) > 0);

    const isUrlLike = (value?: string | null) => /^https?:\/\//i.test(String(value || '').trim());

    const getHostname = (value?: string | null) => {
        try {
            return new URL(String(value || '')).hostname.replace(/^www\./, '');
        } catch {
            return '';
        }
    };

    const formatHostnameName = (hostname: string) => {
        const specialNames: Record<string, string> = {
            'github.blog': 'GitHub Blog',
            'seekingalpha.com': 'Seeking Alpha',
            'bbc.com': 'BBC News',
            'bbc.co.uk': 'BBC News',
            'feeds.bbci.co.uk': 'BBC News',
            'nytimes.com': 'The New York Times',
            'theguardian.com': 'The Guardian',
            'techcrunch.com': 'TechCrunch',
        };
        if (specialNames[hostname]) return specialNames[hostname];

        const base = hostname.split('.')[0] || 'RSS';
        return base
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    const rssSourceUrl = post.feed_url || (isUrlLike(post.source) ? post.source : '') || post.url;
    const rssHostname = getHostname(rssSourceUrl) || getHostname(post.url);
    const rssSourceFromPayload = String(post.source || '').trim();
    const hasNamedRssSource = Boolean(rssSourceFromPayload) &&
        !isUrlLike(rssSourceFromPayload) &&
        !['rss', 'rss news'].includes(rssSourceFromPayload.toLowerCase());
    const rssSourceName = hasNamedRssSource
        ? post.source
        : formatHostnameName(rssHostname);
    const rssSubtitle = post.feed_url || (isUrlLike(post.source) ? post.source : '') || rssHostname || post.url;
    const rssAvatarUrl = post.tweet_profile_pic || (rssHostname ? `https://www.google.com/s2/favicons?domain=${rssHostname}&sz=128` : '');
    const rssTitle = post.title || contentText || 'RSS Article';

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

    if (isRss) {
        return (
            <div
                className={`feed-card group relative flex min-h-[168px] flex-col overflow-hidden h-full font-card ${showMenu ? 'z-50' : 'z-auto'}`}
                style={{
                    padding: '20px 24px 16px',
                    borderRadius: '28px',
                }}
            >
                <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at top right, rgba(0, 112, 243, 0.1), transparent 70%)' }}
                />

                <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/8 bg-[#1a1a1c] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                            {rssAvatarUrl && !rssAvatarFailed ? (
                                <img
                                    src={rssAvatarUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    onError={() => setRssAvatarFailed(true)}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-blue-600/20 text-sm font-black uppercase text-blue-300">
                                    {(rssSourceName || rssTitle).charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-[13px] font-black leading-tight text-white">
                                {rssSourceName}
                            </h3>
                            <p className="mt-0.5 truncate text-[11px] font-semibold leading-tight text-gray-500">
                                {rssSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                        <span className="flex h-6 items-center rounded-full border border-orange-400/28 bg-orange-400/14 px-2.5 text-[10px] font-black text-orange-300">
                            RSS
                        </span>
                        <span className="flex h-6 items-center rounded-full border border-blue-400/24 bg-blue-500/14 px-2.5 text-[10px] font-black text-white">
                            {dayjs(displayDate).isSame(dayjs(), 'day')
                                ? dayjs(displayDate).fromNow(true)
                                    .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                                : dayjs(displayDate).format('D MMM')}
                        </span>
                        <button
                            onClick={handleToggleBookmark}
                            disabled={isBookmarkLoading}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-white/5 ${
                                isBookmarked ? 'text-yellow-400' : 'text-gray-500 hover:text-white'
                            } ${isBookmarkLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                            title={isBookmarked ? 'ลบ Bookmark' : 'Bookmark'}
                        >
                            <HiOutlineBookmark className={`text-lg ${isBookmarked ? 'fill-yellow-400' : ''}`} />
                        </button>

                        <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-white/5 hover:text-blue-400"
                            title="เปิดต้นทาง"
                        >
                            <HiOutlineArrowTopRightOnSquare className="text-lg" />
                        </a>
                    </div>
                </div>

                <div className="relative z-10 mb-5 flex grow gap-4">
                    {hasMedia && (
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(0)}
                            className="group/media relative h-24 w-28 shrink-0 overflow-hidden rounded-[18px] border border-white/6 bg-white/5 text-left shadow-[0_12px_26px_rgba(0,0,0,0.18)]"
                        >
                            <img
                                src={mediaUrls[0]}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover/media:scale-105"
                            />
                            <span className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover/media:bg-black/15" />
                        </button>
                    )}

                    <div className="min-w-0 grow">
                        <p className="line-clamp-2 text-[15px] font-bold leading-relaxed tracking-tight text-gray-100">
                            {rssTitle}
                        </p>
                        {contentText && contentText !== rssTitle ? (
                            <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-relaxed text-slate-400">
                                {contentText}
                            </p>
                        ) : null}
                    </div>
                </div>

                {lightboxIndex !== null && hasMedia && (
                    <MediaLightbox
                        urls={mediaUrls}
                        mediaType={mediaType}
                        currentIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                        onPrev={() => setLightboxIndex(i => i !== null ? (i - 1 + mediaUrls.length) % mediaUrls.length : 0)}
                        onNext={() => setLightboxIndex(i => i !== null ? (i + 1) % mediaUrls.length : 0)}
                        tweetUrl={post.url}
                    />
                )}

                <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-3.5">
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center gap-2 rounded-full border border-blue-400/18 bg-blue-500/12 px-3.5 text-[10px] font-black text-blue-200 transition-all hover:border-blue-300/30 hover:bg-blue-500/18 hover:text-white"
                    >
                        <HiOutlineDocumentText className="text-sm" />
                        <span>อ่านเนื้อหา</span>
                    </a>

                    <button className="inline-flex h-8 items-center gap-2 rounded-xl border border-white/7 bg-[#2a2a2c] px-4 text-[10px] font-black text-gray-300 shadow-lg transition-all hover:bg-white/10 hover:text-white">
                        <HiOutlinePencilSquare className="text-sm" />
                        <span>สร้างคอนเทนต์</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`feed-card group relative flex flex-col overflow-hidden h-full font-card
            ${showMenu ? 'z-50' : 'z-auto'}
        `}
            style={{
                padding: '20px 24px 16px',
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
                                    {avatarFallback}
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
                            {sourceHandle}
                        </span>
                    </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-1 shrink-0">
                        <div className="px-3 py-1 bg-[#0f1419]/80 rounded-full text-white text-[11px] font-bold tracking-tight mr-2 flex items-center justify-center border border-white/5">
                        {dayjs(displayDate).isSame(dayjs(), 'day')
                            ? dayjs(displayDate).fromNow(true)
                                .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                            : dayjs(displayDate).format('D MMM')}
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

                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-all">
                        <HiOutlineArrowTopRightOnSquare className="text-lg" />
                    </a>
                </div>
            </div>

            {/* Reply Badge Component */}
            {!isRss && contentText.toLowerCase().includes('http') && (
                <div className="mb-5 flex relative z-10">
                    <div className="bg-blue-500/10 border border-blue-400/10 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest cursor-default hover:bg-blue-500/20 transition-colors">
                        <HiOutlineChatBubbleLeft className="text-xs" />
                        <span>ตอบกลับ {sourceHandle}</span>
                    </div>
                </div>
            )}

            {/* Content Body + Inline Media Thumbnail */}
            <div className={`flex flex-row-reverse gap-3 relative z-10 ${isCompact ? 'mb-4' : 'mb-5'} grow`}>
                <div className={`text-white leading-relaxed tracking-tight wrap-break-word
                    ${isCompact ? 'text-[13px] line-clamp-3' : 'text-[15px]'}
                    grow min-w-0
                `} style={{ fontFamily: 'var(--font-card)', fontWeight: 500 }}>
                    {contentText}
                </div>

                {/* Inline thumbnail */}
                {hasMedia && (
                    <div
                        className="shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer relative group/thumb"
                        onClick={() => setLightboxIndex(0)}
                    >
                        <img
                            src={mediaUrls[0]}
                            alt="media"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors duration-200" />
                        {/* Video play badge */}
                        {(mediaType === 'video' || mediaType === 'animated_gif') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 border border-white/20">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5 text-white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        {/* Count badge */}
                        {mediaUrls.length > 1 && (
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/65 text-white text-[9px] font-black leading-none">
                                1/{mediaUrls.length}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Media Lightbox */}
            {lightboxIndex !== null && hasMedia && (
                <MediaLightbox
                    urls={mediaUrls}
                    mediaType={mediaType}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onPrev={() => setLightboxIndex(i => i !== null ? (i - 1 + mediaUrls.length) % mediaUrls.length : 0)}
                    onNext={() => setLightboxIndex(i => i !== null ? (i + 1) % mediaUrls.length : 0)}
                    tweetUrl={post.url}
                />
            )}

            {/* Action Footer */}
            <div className="flex items-center justify-between mt-auto pt-4.5 border-t border-white/5 relative z-10">
                {isRss && !hasSocialMetrics ? (
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500/70" />
                        <span>RSS Article</span>
                    </div>
                ) : (
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
                )}

                <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2c] border border-white/5 rounded-xl text-[10px] font-black text-gray-300 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest group/action shadow-lg">
                    <HiOutlinePencilSquare className="text-sm group-hover/action:scale-110 transition-transform" />
                    <span>สร้างคอนเทนต์</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardCard;
