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
    HiOutlineDocumentText,
    HiPlay
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
    const citationLabel = post.citation_id?.replaceAll('[', '').replaceAll(']', '').trim();
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
                className={`feed-card feed-card-rss group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-[28px] border border-white/8 px-6 pt-[18px] pb-[14px] font-card ${showMenu ? 'z-50' : 'z-auto'}`}
            >
                <div className="feed-card-header relative z-10 mb-[14px] flex min-w-0 items-center justify-between gap-4">
                    <div className="feed-card-author flex min-w-0 items-center gap-2.5">
                        <div className="feed-card-author-avatar flex size-[42px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/8 bg-[#1a1a1c]">
                            {rssAvatarUrl && !rssAvatarFailed ? (
                                <img
                                    src={rssAvatarUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    onError={() => setRssAvatarFailed(true)}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-blue-600/20 text-xs font-black uppercase text-blue-300">
                                    {(rssSourceName || rssTitle).charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-1.5">
                                {citationLabel && (
                                    <span className="reference-badge feed-card-citation-badge">
                                        {citationLabel}
                                    </span>
                                )}
                                <h3 className="feed-card-author-name truncate text-[13px] leading-[1.2] font-extrabold text-white">
                                    {rssSourceName}
                                </h3>
                            </div>
                            <p className="feed-card-author-handle mt-px truncate text-[11px] leading-[1.3] text-slate-400">
                                {rssSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="feed-card-meta flex shrink-0 items-center gap-1.5">
                        <span className="feed-card-source-badge feed-card-source-badge-rss inline-flex h-[26px] items-center justify-center rounded-full px-2.5 text-[10px] leading-none font-black">
                            RSS
                        </span>
                        <span className="feed-card-time-badge inline-flex h-[26px] items-center justify-center rounded-full px-2.5 text-[10px] leading-none font-black">
                            {dayjs(displayDate).isSame(dayjs(), 'day')
                                ? dayjs(displayDate).fromNow(true)
                                    .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                                : dayjs(displayDate).format('D MMM')}
                        </span>
                        <button
                            onClick={handleToggleBookmark}
                            disabled={isBookmarkLoading}
                            className={`feed-card-icon-action ${
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
                            className="feed-card-icon-action text-gray-500 hover:text-blue-400"
                            title="เปิดต้นทาง"
                        >
                            <HiOutlineArrowTopRightOnSquare className="text-lg" />
                        </a>
                    </div>
                </div>

                <div className={`feed-card-content relative z-10 mb-4 flex min-w-0 grow items-start gap-3 ${hasMedia ? 'has-media' : 'no-media'}`}>
                    {hasMedia && (
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(0)}
                            className="feed-card-media group/media relative size-28 shrink-0 overflow-hidden rounded-2xl border border-white/6 bg-white/5 text-left"
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
                        <p className="feed-card-body-copy line-clamp-3 overflow-hidden text-[15px] leading-[1.45] text-gray-100">
                            {rssTitle}
                        </p>
                        {contentText && contentText !== rssTitle ? (
                            <p className="feed-card-rss-summary line-clamp-2 text-slate-400">
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

                <div className="feed-card-footer relative z-10 mt-auto flex min-w-0 items-center gap-2.5 border-t border-white/4 pt-2">
                    <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="feed-card-inline-action feed-card-read-action"
                    >
                        <HiOutlineDocumentText className="text-sm" />
                        <span>อ่านเนื้อหา</span>
                    </a>

                    <button className="feed-card-inline-action ml-auto">
                        <HiOutlinePencilSquare className="text-sm" />
                        <span>สร้างคอนเทนต์</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`feed-card group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-[28px] border border-white/8 px-6 pt-[18px] pb-[14px] font-card
            ${showMenu ? 'z-50' : 'z-auto'}
        `}>

            <div className="feed-card-header relative z-10 mb-[14px] flex min-w-0 items-center justify-between gap-4">
                <div className="feed-card-author flex min-w-0 items-center gap-2.5">
                    <div className="shrink-0">
                        <div className="feed-card-author-avatar flex size-[42px] items-center justify-center overflow-hidden rounded-full border-2 border-white/8 bg-[#1a1a1c]">
                            {post.tweet_profile_pic ? (
                                <img src={post.tweet_profile_pic} alt="owner" className="w-full h-full object-cover" />
                            ) : (
                                <div className='w-full h-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black text-sm uppercase'>
                                    {avatarFallback}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                            {citationLabel && (
                                <span className="reference-badge feed-card-citation-badge">
                                    {citationLabel}
                                </span>
                            )}
                            <h3 className="feed-card-author-name truncate text-[13px] leading-[1.2] font-extrabold text-white capitalize transition-colors group-hover:text-blue-400">
                                {post.title}
                            </h3>
                        </div>
                        <span className="feed-card-author-handle mt-px truncate text-[11px] leading-[1.3] text-slate-400">
                            {sourceHandle}
                        </span>
                    </div>
                </div>

                <div className="feed-card-meta flex shrink-0 items-center gap-1.5">
                    <div className="feed-card-time-badge inline-flex h-[26px] items-center justify-center rounded-full px-2.5 text-[10px] leading-none font-black">
                        {dayjs(displayDate).isSame(dayjs(), 'day')
                            ? dayjs(displayDate).fromNow(true)
                                .replace('วินาที', 's').replace('นาที', 'm').replace('ชั่วโมง', 'h').replace('วัน', 'd').replace('เดือน', 'mo').replace('ปี', 'y').replace(/\s+/g, '')
                            : dayjs(displayDate).format('D MMM')}
                    </div>

                    <button
                        onClick={handleToggleBookmark}
                        disabled={isBookmarkLoading}
                        className={`feed-card-icon-action ${
                            isBookmarked ? 'text-yellow-400' : 'text-gray-500 hover:text-white'
                        } ${isBookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isBookmarked ? 'ลบ Bookmark' : 'Bookmark'}
                    >
                        <HiOutlineBookmark className={`text-lg ${isBookmarked ? 'fill-yellow-400' : ''}`} />
                    </button>

                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="feed-card-icon-action text-gray-500 hover:text-blue-400">
                        <HiOutlineArrowTopRightOnSquare className="text-lg" />
                    </a>
                </div>
            </div>

            <div className={`feed-card-content relative z-10 mb-4 flex min-w-0 grow flex-row-reverse items-start gap-3 ${hasMedia ? 'has-media' : 'no-media'}`}>
                <div className={`feed-card-body-copy wrap-break-word min-w-0 grow overflow-hidden leading-[1.45] text-white
                    ${isCompact ? 'line-clamp-3 text-[13px]' : 'text-[15px]'}
                `}>
                    {contentText}
                </div>

                {hasMedia && (
                    <div
                        className="feed-card-media group/thumb relative size-28 shrink-0 cursor-pointer overflow-hidden rounded-2xl"
                        onClick={() => setLightboxIndex(0)}
                    >
                        <img
                            src={mediaUrls[0]}
                            alt="media"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors duration-200" />
                        {(mediaType === 'video' || mediaType === 'animated_gif') && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 border border-white/20">
                                    <HiPlay className="w-3.5 h-3.5 ml-0.5 text-white" />
                                </div>
                            </div>
                        )}
                        {mediaUrls.length > 1 && (
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/65 text-white text-[9px] font-black leading-none">
                                1/{mediaUrls.length}
                            </div>
                        )}
                    </div>
                )}
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

            <div className="feed-card-footer relative z-10 mt-auto flex min-w-0 items-center gap-2.5 border-t border-white/4 pt-2">
                {isRss && !hasSocialMetrics ? (
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500/70" />
                        <span>RSS Article</span>
                    </div>
                ) : (
                    <div className="feed-card-stats flex items-center text-gray-500">
                        <div className="feed-card-stat hover:text-blue-400 transition-colors cursor-default">
                            <HiOutlineChartBar className="text-sm opacity-60" />
                            <span>{formatNumber(post.view_count)}</span>
                        </div>
                        <div className="feed-card-stat hover:text-rose-500 transition-colors cursor-default">
                            <HiOutlineHeart className="text-sm opacity-60" />
                            <span>{formatNumber(post.like_count)}</span>
                        </div>
                        <div className="feed-card-stat hover:text-emerald-500 transition-colors cursor-default">
                            <HiOutlineArrowPathRoundedSquare className="text-sm opacity-60" />
                            <span>{formatNumber(post.retweet_count)}</span>
                        </div>
                        <div className="feed-card-stat hover:text-cyan-500 transition-colors cursor-default">
                            <HiOutlineChatBubbleLeft className="text-sm opacity-60" />
                            <span>{formatNumber(post.reply_count)}</span>
                        </div>
                    </div>
                )}

                <button className="feed-card-inline-action ml-auto group/action">
                    <HiOutlinePencilSquare className="text-sm group-hover/action:scale-110 transition-transform" />
                    <span>สร้างคอนเทนต์</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardCard;
