import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/th';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';
import {
    HiOutlineChartBar,
    HiOutlineHeart,
    HiOutlineArrowPathRoundedSquare,
    HiOutlineChatBubbleLeft,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineBookmark,
} from 'react-icons/hi2';
import { LuNewspaper, LuFileText } from 'react-icons/lu';
import { getBookmarks, removeBookmarkByNewsId, type BookmarkResponse } from '../api/bookmark';

dayjs.extend(relativeTime);
dayjs.locale('th');

type TabType = 'news' | 'content';

const TABS: { label: string; value: TabType; icon: React.ReactNode }[] = [
    { label: 'ข่าว', value: 'news', icon: <LuNewspaper className="h-4 w-4" /> },
    { label: 'บทความ', value: 'content', icon: <LuFileText className="h-4 w-4" /> },
];

const PAGE_LIMIT = 12;

function formatNumber(num: number = 0) {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return `${num}`;
}

function BookmarkCard({
    bookmark,
    onRemove,
}: {
    bookmark: BookmarkResponse;
    onRemove: (newsId: number) => void;
}) {
    const item = bookmark.news_item;
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = async () => {
        if (isRemoving) return;
        setIsRemoving(true);
        try {
            await removeBookmarkByNewsId(bookmark.news_id);
            onRemove(bookmark.news_id);
            toast.success('ลบ Bookmark แล้ว');
        } catch {
            toast.error('เกิดข้อผิดพลาดในการลบ Bookmark');
            setIsRemoving(false);
        }
    };

    const displayTime = item.tweet_created_at || item.created_at;
    const timeLabel = dayjs(displayTime).isSame(dayjs(), 'day')
        ? dayjs(displayTime)
              .fromNow(true)
              .replace('วินาที', 's')
              .replace('นาที', 'm')
              .replace('ชั่วโมง', 'h')
              .replace('วัน', 'd')
              .replace('เดือน', 'mo')
              .replace('ปี', 'y')
              .replace(/\s+/g, '')
        : dayjs(displayTime).format('D MMM');

    const mediaUrl = item.media_urls?.[0] ?? null;

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/6 transition-all hover:border-blue-500/20"
            style={{
                background: 'linear-gradient(145deg, #111112 0%, #181819 100%)',
                padding: '20px 24px 16px',
                transition: '0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* Hover Glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: 'radial-gradient(circle at top right, rgba(0,112,243,0.1), transparent 70%)' }}
            />

            {/* Header */}
            <div className="relative z-10 mb-4.5 flex items-start justify-between">
                <div className="flex min-w-0 items-center gap-3.5">
                    <div className="shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#1a1a1c] shadow-[0_10px_24px_rgba(0,0,0,0.15)]">
                            {item.tweet_profile_pic ? (
                                <img src={item.tweet_profile_pic} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-blue-600/20 text-sm font-black uppercase text-blue-400">
                                    {item.title?.charAt(0) || 'B'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <h3 className="truncate text-[15px] font-bold capitalize leading-tight tracking-tight text-white transition-colors group-hover:text-blue-400">
                            {item.title}
                        </h3>
                        {item.username && (
                            <span className="mt-1 truncate text-[13px] font-medium tracking-tight text-gray-500 opacity-80">
                                {item.username}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <div className="mr-2 flex items-center justify-center rounded-full border border-white/5 bg-[#0f1419]/80 px-3 py-1 text-[11px] font-bold tracking-tight text-white">
                        {timeLabel}
                    </div>

                    <button
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-white/5 ${
                            isRemoving ? 'cursor-not-allowed opacity-50' : ''
                        } text-yellow-400`}
                        title="ลบ Bookmark"
                    >
                        <HiOutlineBookmark className="fill-yellow-400 text-lg" />
                    </button>

                    <a
                        href={item.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-all hover:bg-white/5 hover:text-blue-400"
                    >
                        <HiOutlineArrowTopRightOnSquare className="text-lg" />
                    </a>
                </div>
            </div>

            {/* Media + Content */}
            {mediaUrl ? (
                <div className="relative z-10 mb-4 grid gap-4 lg:grid-cols-[112px_minmax(0,1fr)] lg:gap-5">
                    <div className="shrink-0">
                        <div className="aspect-square overflow-hidden rounded-[20px] border border-white/10 bg-[#111112] ring-1 ring-white/10">
                            <img src={"https://pbs.twimg.com/amplify_video_thumb/2044819054352125952/img/OWCVkaI57YhZ1wIc.jpg"} alt="" className="h-full w-full object-cover" />
                        </div>
                    </div>
                    <p className="line-clamp-4 text-[15px] font-medium leading-relaxed tracking-tight text-white" style={{ fontFamily: 'var(--font-card)', fontWeight: 500 }}>
                        {item.content}
                    </p>
                </div>
            ) : (
                <div className="relative z-10 mb-5 grow text-[15px] font-medium leading-relaxed tracking-tight text-white" style={{ fontFamily: 'var(--font-card)', fontWeight: 500 }}>
                    <p className="line-clamp-5">{item.content}</p>
                </div>
            )}

            {/* Footer Stats */}
            <div className="relative z-10 mt-auto flex items-center gap-4 border-t border-white/5 pt-4.5 text-[11px] font-bold text-gray-500">
                <div className="flex items-center gap-1.5 transition-colors hover:text-blue-400">
                    <HiOutlineChartBar className="text-sm opacity-60" />
                    <span>{formatNumber(item.view_count)}</span>
                </div>
                <div className="flex items-center gap-1.5 transition-colors hover:text-rose-500">
                    <HiOutlineHeart className="text-sm opacity-60" />
                    <span>{formatNumber(item.like_count)}</span>
                </div>
                <div className="flex items-center gap-1.5 transition-colors hover:text-emerald-500">
                    <HiOutlineArrowPathRoundedSquare className="text-sm opacity-60" />
                    <span>{formatNumber(item.retweet_count)}</span>
                </div>
                <div className="flex items-center gap-1.5 transition-colors hover:text-cyan-500">
                    <HiOutlineChatBubbleLeft className="text-sm opacity-60" />
                    <span>{formatNumber(item.reply_count)}</span>
                </div>
            </div>
        </article>
    );
}

function BookmarkSkeleton() {
    return (
        <div className="flex h-64 flex-col rounded-[30px] border border-white/6 p-6" style={{ background: 'linear-gradient(145deg, #111112 0%, #181819 100%)' }}>
            <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 animate-pulse rounded-full bg-white/5" />
                <div className="space-y-2">
                    <div className="h-3.5 w-28 animate-pulse rounded-full bg-white/5" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-white/5" />
                </div>
            </div>
            <div className="mt-6 space-y-3 flex-1">
                <div className="h-4 w-11/12 animate-pulse rounded-full bg-white/5" />
                <div className="h-4 w-9/12 animate-pulse rounded-full bg-white/5" />
                <div className="h-4 w-7/12 animate-pulse rounded-full bg-white/5" />
            </div>
            <div className="mt-auto flex gap-4 border-t border-white/5 pt-4">
                <div className="h-3 w-10 animate-pulse rounded-full bg-white/5" />
                <div className="h-3 w-10 animate-pulse rounded-full bg-white/5" />
                <div className="h-3 w-10 animate-pulse rounded-full bg-white/5" />
            </div>
        </div>
    );
}

const Bookmark = () => {
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const [bookmarks, setBookmarks] = useState<BookmarkResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchBookmarks = useCallback(async (p: number) => {
        setIsLoading(true);
        try {
            const data = await getBookmarks(p, PAGE_LIMIT);
            setBookmarks(data.items);
            setTotalPages(data.pages);
            setTotal(data.total);
            setPage(data.page);
        } catch {
            toast.error('ไม่สามารถโหลด Bookmarks ได้');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookmarks(1);
    }, [fetchBookmarks]);

    const handleRemove = (newsId: number) => {
        setBookmarks((prev) => prev.filter((b) => b.news_id !== newsId));
        setTotal((prev) => prev - 1);
    };

    const filteredBookmarks = bookmarks.filter((b) => {
        const type = b.news_item?.item_type;
        if (activeTab === 'news') return type === 'news' || type === undefined || type === null;
        return type === 'content_search';
    });

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        fetchBookmarks(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex h-screen w-full gap-3 overflow-hidden bg-[#0a0a0b] p-3 font-sans text-gray-100">
            <Sidebar />
            <div className="flex flex-1 min-w-0 gap-3">
                <section className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-4xl border border-white/5 bg-[#111112] shadow-[0_24px_90px_rgba(0,0,0,0.45)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex flex-col w-full px-6 py-6 sm:px-8 lg:px-10">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Bookmarks
                            </h1>
                            <p className="mt-1 text-sm font-medium text-gray-500">
                                คลังข้อมูลที่บันทึกไว้แยกตามประเภท
                            </p>
                        </div>

                        <div className="border-b border-white/5 mb-6" />

                        {/* Tabs */}
                        <div className="mb-6 flex items-center">
                            <div className="inline-flex rounded-2xl border border-white/8 bg-white/3 p-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setActiveTab(tab.value)}
                                        className={[
                                            'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                                            activeTab === tab.value
                                                ? 'bg-white/10 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-300',
                                        ].join(' ')}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <span className="ml-4 text-xs font-bold text-gray-600">
                                {total} รายการ
                            </span>
                        </div>

                        {/* Grid */}
                        {isLoading ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <BookmarkSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredBookmarks.length > 0 ? (
                            <div className="grid gap-4 lg:grid-cols-2">
                                {filteredBookmarks.map((bm) => (
                                    <BookmarkCard key={bm.id} bookmark={bm} onRemove={handleRemove} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-4xl border border-white/5 bg-white/2 py-24 text-center">
                                <HiOutlineBookmark className="mb-4 h-12 w-12 text-gray-600" />
                                <p className="text-lg font-bold text-gray-400">
                                    ยังไม่มี{activeTab === 'news' ? 'ข่าว' : 'บทความ'}ที่บันทึกไว้
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    กดไอคอน bookmark เพื่อบันทึกรายการที่สนใจ
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && !isLoading && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ก่อนหน้า
                                </button>
                                <span className="px-3 text-sm font-medium text-gray-500">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ถัดไป
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <aside className="hidden xl:flex w-[320px] shrink-0 overflow-hidden rounded-4xl border border-white/5 bg-[#111112] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                    <PostList showBorder={false} />
                </aside>
            </div>
        </div>
    );
};

export default Bookmark;
