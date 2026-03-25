import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SkeletonCard from '../components/SkeletonCard';
import {
    HiOutlineStop,
    HiOutlineClock,
    HiOutlineCalendarDays,
    HiOutlineTrash,
    HiOutlineArrowPath
} from "react-icons/hi2";
import { RiLoader4Line } from "react-icons/ri";
import { LuSparkles, LuRefreshCw } from "react-icons/lu";
import { AnimatePresence, motion } from 'framer-motion';
import PostList from '../components/PostList';
import { type NewsItem, type NewsResult } from '../interface/news';
import { getNews, getTriggerStatus, updateTriggerStatus, searchAndAnalyzeBulk } from '../api/news';
import { getCategories } from '../api/category';
import { createCategoryNews } from '../api/categoryNews';
import { toast } from 'react-hot-toast';
import { type Category } from '../interface/category';
import { type PostListWithMembers } from '../components/PostList';

const TodayNews = () => {

    const [isStreaming, setIsStreaming] = useState(false);
    const [layoutMode] = useState<'grid' | 'compact'>('grid');

    // Filter State
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    const [statusMessage, setStatusMessage] = useState('ระบบพร้อมทำงาน');
    const [nextCursor, setNextCursor] = useState<string | null>(() => localStorage.getItem('today_news_twitter_cursor'));
    const [hasStarted, setHasStarted] = useState(false);
    const [backupResults, setBackupResults] = useState<NewsResult[]>([]);
    const [backupCursor, setBackupCursor] = useState<string | null>(null);
    const [isRestorable, setIsRestorable] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // AI Filter State
    const [isAIFilterOpen, setIsAIFilterOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [aiFilteredIds, setAiFilteredIds] = useState<(string | number)[] | null>(null);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const aiFilterRef = useRef<HTMLDivElement>(null);

    // Search Parameters
    const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [selectedPostList, setSelectedPostList] = useState<PostListWithMembers | null>(null);
    const [searchParams] = useState({

        query: "",
        query_type: "latest",
        since_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        until_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        cursor: ""
    });




    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);

    // Context restoration and Initial Data Fetch
    const init = async () => {
        try {
            // 1. Sync Trigger Status first to understand current state
            const triggerData = await getTriggerStatus();
            const isCleared = localStorage.getItem('today_news_is_cleared') === 'true';

            // 2. Clear the 'cleared' flag if we detect an active run starting elsewhere
            if (triggerData.trigger === 1 && isCleared) {
                localStorage.removeItem('today_news_is_cleared');
            }

            // 3. Fetch items from DB
            const newsResponse = await getNews(1, 40, 1);
            const hasNews = newsResponse.items && newsResponse.items.length > 0;

            // 4. Decision: Show news IF (Run is Active) OR (User hasn't explicitly clicked Clear)
            if (hasNews && (triggerData.trigger === 1 || !isCleared)) {
                const dbResults: NewsResult[] = newsResponse.items.map(item => ({
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    source: item.source || item.title || 'Twitter',
                    url: item.url,
                    tweet_id: item.tweet_id,
                    created_at: item.tweet_created_at || item.created_at, // Prioritize tweet time for display
                    tweet_created_at: item.tweet_created_at,
                    retweet_count: item.retweet_count || 0,
                    reply_count: item.reply_count || 0,
                    like_count: item.like_count || 0,
                    quote_count: item.quote_count || 0,
                    view_count: item.view_count || 0,
                    tweet_profile_pic: item.tweet_profile_pic
                })).sort((a, b) => dayjs(b.tweet_created_at || b.created_at).valueOf() - dayjs(a.tweet_created_at || a.created_at).valueOf());
                setNewsResults(dbResults);
                setHasStarted(true);
            } else {
                setNewsResults([]);
            }

            // 5. Update Status Message based on the merged state
            if (triggerData.trigger === 1) {
                setHasStarted(true);
                setStatusMessage('ระบบกำลังทำงานอยู่ (ตรวจพบค้างคา)');
            } else if (isCleared && !hasNews) {
                setStatusMessage('ระบบพร้อมทำงาน');
            } else if (isCleared && hasNews) {
                setStatusMessage('ล้างข้อมูลเรียบร้อยแล้ว');
            } else {
                setStatusMessage(hasNews ? 'ประมวลผลเสร็จสิ้น' : 'ระบบพร้อมทำงาน');
            }
        } catch (error) {
            console.error('Failed to sync today news:', error);
        }
    };
    const fetchCats = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        init();
        fetchCats();
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    // Handle click outside to close filter dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setIsFilterDropdownOpen(false);
            }
        };

        if (isFilterDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterDropdownOpen]);

    // Handle click outside to close AI filter dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (aiFilterRef.current && !aiFilterRef.current.contains(event.target as Node)) {
                setIsAIFilterOpen(false);
            }
        };

        if (isAIFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAIFilterOpen]);

    // Start Bulk Analysis
    const startBulkAnalysis = async (cursorOverride?: string) => {
        if (isStreaming) return;
        setIsStreaming(true);
        setStatusMessage('กำลังเชื่อมต่อและวิเคราะห์ข่าว...');

        // If not loading more, clear previous results and cache
        if (!cursorOverride || typeof cursorOverride !== 'string') {
            setNewsResults([]);
            setNextCursor(null);
            localStorage.removeItem('today_news_twitter_cursor');
            localStorage.removeItem('today_news_is_cleared'); // Reset clear flag on new start
            setHasStarted(true);
        }

        setProgress({ current: 0, total: 0 }); // Hide progress bar for bulk call
        abortControllerRef.current = new AbortController();

        const payload: any = {
            query_type: "Latest",
            since_date: searchParams.since_date,
            cursor: (typeof cursorOverride === 'string') ? cursorOverride : searchParams.cursor
        };

        if (searchParams.query) {
            payload.query = searchParams.query;
        }

        if (selectedPostList) {
            payload.post_list_id = selectedPostList.id;
        } else {
            payload.use_followed_users = true;
        }





        try {
            const result = await searchAndAnalyzeBulk(payload, abortControllerRef.current.signal);


            if (result && result.items) {
                const mappedResults: NewsResult[] = result.items.map((item: any) => ({
                    id: item.id,
                    title: item.title || item.tweet_name || 'Twitter News',
                    content: item.llm_analysis || item.content,
                    source: item.tweet_name || item.source || 'Twitter',
                    url: item.url || '#',
                    tweet_id: item.tweet_id,
                    tweet_profile_pic: item.tweet_profile_pic,
                    created_at: item.tweet_created_at || item.created_at || new Date().toISOString(),
                    tweet_created_at: item.tweet_created_at,
                    retweet_count: item.retweet_count || 0,
                    reply_count: item.reply_count || 0,
                    like_count: item.like_count || 0,
                    quote_count: item.quote_count || 0,
                    view_count: item.view_count || 0
                }));

                setNewsResults(prev => {
                    // Update or Add items
                    const existingIds = new Set(prev.map(p => String(p.tweet_id || p.id)));
                    const newItems = mappedResults.filter(m => !existingIds.has(String(m.tweet_id || m.id)));
                    const updatedItems = prev.map(p => {
                        const match = mappedResults.find(m => String(m.tweet_id || m.id) === String(p.tweet_id || p.id));
                        return match ? match : p;
                    });

                    return [...updatedItems, ...newItems]
                        .sort((a, b) => dayjs(b.tweet_created_at || b.created_at).valueOf() - dayjs(a.tweet_created_at || a.created_at).valueOf());
                });

                if (result.twitter_cursor) {
                    localStorage.setItem('today_news_twitter_cursor', result.twitter_cursor);
                    setNextCursor(result.twitter_cursor);
                }

                setStatusMessage('วิเคราะห์เสร็จสิ้น');
            } else {
                setStatusMessage('ไม่พบข้อมูลข่าวใหม่');
            }
        } catch (error: any) {
            console.error('Bulk analysis failed:', error);
            setStatusMessage(`เกิดข้อผิดพลาด: ${error.message || 'Unknown error'}`);
            toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลข่าว');
        } finally {
            setIsStreaming(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    const stopStream = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setIsStreaming(false);
        setStatusMessage('หยุดการประมวลผลแล้ว');
    };

    const handleDeleteIndividual = async (id: number) => {
        try {
            const { deleteNews } = await import('../api/news');
            await deleteNews(id);
            setNewsResults(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to delete news:', error);
        }
    };

    const handleAddNewsToCategory = async (categoryId: number, newsId: number) => {
        try {
            await createCategoryNews({
                category_id: categoryId,
                news_id: newsId
            });
            toast.success('เพิ่มข่าวเข้าหมวดหมู่เรียบร้อยแล้ว');
        } catch (error) {
            console.error('Error adding news to category:', error);
            toast.error('เกิดข้อผิดพลาดในการเพิ่มข่าวเข้าหมวดหมู่');
        }
    };

    const handleAIFilter = async () => {
        if (!aiPrompt.trim()) {
            toast.error('กรุณาพิมพ์ข้อมูลที่ต้องการให้ AI วิเคราะห์');
            return;
        }

        setIsAIProcessing(true);

        // Structure to send to backend exactly as requested
        const payload = {
            prompt: aiPrompt,
            news_items: newsResults.map(res => ({
                id: res.id,
                title: res.title,
                content: res.content,
                source: res.source,
                url: res.url,
                tweet_id: res.tweet_id,
                created_at: res.created_at,
                metrics: {
                    retweet_count: res.retweet_count,
                    reply_count: res.reply_count,
                    like_count: res.like_count,
                    quote_count: res.quote_count,
                    view_count: res.view_count
                }
            }))
        };

        try {
            // refactor to use api/news.ts pattern axios
            const response = await fetch(`${import.meta.env.VITE_API_URL}/news/filter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.filtered_news) {
                setAiSummary(data.summary || null);
                // Map IDs/TweetIDs to track matches - Use strings to avoid precision issues
                const ids = data.filtered_news.map((item: any) => String(item.tweet_id || item.id));
                setAiFilteredIds(ids);
                toast.success('คัดกรองข้อมูลสำเร็จ');
            } else {
                toast.error(data.message || 'คัดกรองไม่สำเร็จ');
            }
            setIsAIFilterOpen(false);
        } catch (error) {
            console.error('AI Filter failed:', error);
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ AI');
        } finally {
            setIsAIProcessing(false);
        }
    };

    const handleClear = async () => {
        try {
            const newsIds = newsResults.map(item => Number(item.id));
            await updateTriggerStatus(0, newsIds);
            if (newsResults.length > 0) {
                setBackupResults(newsResults);
                setBackupCursor(nextCursor);
                setIsRestorable(true);
            }
            setNewsResults([]);
            setHasStarted(false);
            localStorage.removeItem('today_news_twitter_cursor');
            localStorage.setItem('today_news_is_cleared', 'true'); // Flag to persist clear on refresh
            setNextCursor(null);
            setStatusMessage('ล้างข้อมูลเรียบร้อยแล้ว');
        } catch (error) {
            console.error('Failed to clear news:', error);
        }
    };

    const handleRestore = () => {
        if (backupResults.length > 0) {
            setNewsResults(backupResults);
            if (backupCursor) {
                setNextCursor(backupCursor);
                localStorage.setItem('today_news_twitter_cursor', backupCursor);
            }
            setIsRestorable(false);
            setHasStarted(true);
            setStatusMessage('กู้คืนข้อมูลสำเร็จ');
        }
    };

    const mapToNewsItem = (res: NewsResult): NewsItem => ({
        id: typeof res.id === 'string' ? parseInt(res.id) || 0 : res.id,
        title: res.title,
        content: typeof res.content === 'string' ? res.content : JSON.stringify(res.content),
        url: res.url,
        user_id: 0,
        tweet_profile_pic: res.tweet_profile_pic || '',
        created_at: res.created_at,
        tweet_id: res.tweet_id || '',
        tweet_created_at: res.tweet_created_at,
        retweet_count: res.retweet_count,
        reply_count: res.reply_count,
        like_count: res.like_count,
        quote_count: res.quote_count,
        view_count: res.view_count
    });

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const getFilteredNews = () => {
        let filtered = [...newsResults];

        // 1. Filter by Post List if selected
        if (selectedPostList && selectedPostList.members) {
            const memberAccounts = new Set(selectedPostList.members.map(m => {
                const handle = m.follow_user_x_account || "";
                return handle.startsWith('@') ? handle.slice(1).toLowerCase() : handle.toLowerCase();
            }));

            filtered = filtered.filter(item => {
                // Try to extract handle from URL: https://x.com/BBCBreaking/status/123 -> BBCBreaking
                const urlMatch = item.url?.toLowerCase().match(/x\.com\/([^/]+)/);
                const handleFromUrl = urlMatch ? urlMatch[1] : null;

                // Also check source if it looks like a handle
                const sourceHandle = item.source?.startsWith('@') ? item.source.slice(1).toLowerCase() : item.source?.toLowerCase();

                return (handleFromUrl && memberAccounts.has(handleFromUrl)) ||
                    (sourceHandle && memberAccounts.has(sourceHandle));
            });
        }

        const sorted = filtered.sort((a, b) => {

            const hasView = activeFilters.includes('mostView');
            const hasLiked = activeFilters.includes('mostLiked');

            if (hasView && hasLiked) {
                // Combined score: Views + (Likes + Retweets) * weighted
                // Normalizing roughly: views usually > likes+retweets
                const scoreA = (a.view_count || 0) + ((a.like_count || 0) + (a.retweet_count || 0)) * 5;
                const scoreB = (b.view_count || 0) + ((b.like_count || 0) + (b.retweet_count || 0)) * 5;
                return scoreB - scoreA;
            }

            if (hasView) {
                return (b.view_count || 0) - (a.view_count || 0);
            }

            if (hasLiked) {
                const scoreA = (a.like_count || 0) + (a.retweet_count || 0);
                const scoreB = (b.like_count || 0) + (b.retweet_count || 0);
                return scoreB - scoreA;
            }

            // Default: Most Recent
            return dayjs(b.tweet_created_at || b.created_at).valueOf() - dayjs(a.tweet_created_at || a.created_at).valueOf();
        });

        // Apply AI Filter if active
        if (aiFilteredIds) {
            return sorted.filter(item => {
                const itemIdStr = String(item.id);
                const tweetIdStr = item.tweet_id ? String(item.tweet_id) : null;
                return aiFilteredIds.includes(itemIdStr) || (tweetIdStr && aiFilteredIds.includes(tweetIdStr));
            });
        }

        return sorted;
    };

    const displayNews = getFilteredNews();

    return (
        <div className="flex min-h-screen w-full bg-[#0a0a0b] font-sans text-gray-100 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex overflow-hidden ml-20 lg:ml-60">
                <main className="flex-1 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
                    {/* Header Section */}
                    <header className="shrink-0 mb-6">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-xs font-medium mb-0.5 md:mb-1 uppercase tracking-wider text-gray-500">
                                    WATCHLIST FEED
                                </span>


                                <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${selectedPostList ? 'text-blue-400' : 'text-white'}`}>
                                    {selectedPostList ? selectedPostList.name : 'หน้าหลัก'}
                                </h1>
                            </div>


                            <div className="flex items-center gap-2 md:gap-3">
                                {/* Clear & Restore */}
                                <div className="flex items-center gap-1 md:gap-1.5 p-0.5 md:p-1 bg-white/3 border border-white/5 rounded-xl">
                                    <button
                                        onClick={handleClear}
                                        className="p-1.5 md:p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                        title="ล้างข้อมูล"
                                    >
                                        <HiOutlineTrash className="text-base md:text-lg" />
                                    </button>
                                    {isRestorable && (
                                        <button
                                            onClick={handleRestore}
                                            className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                            title="กู้คืน"
                                        >
                                            <HiOutlineArrowPath className="text-lg" />
                                        </button>
                                    )}
                                </div>

                                {/* AI Filter */}
                                <div className="relative" ref={aiFilterRef}>
                                    <button
                                        onClick={() => setIsAIFilterOpen(!isAIFilterOpen)}
                                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-bold border transition-all ${isAIFilterOpen
                                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                                    >
                                        <LuSparkles className={`text-base ${isAIFilterOpen ? 'animate-pulse' : 'text-blue-400'}`} />
                                        <span className="text-[10px] md:text-xs">AI Filter</span>
                                    </button>
                                </div>

                                {/* Sync Data Button */}
                                {!isStreaming ? (
                                    <button
                                        onClick={() => startBulkAnalysis()}
                                        disabled={hasStarted || newsResults.length > 0}

                                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full font-bold transition-all shadow-lg active:scale-95
                                            ${hasStarted || newsResults.length > 0
                                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
                                            }`}
                                    >
                                        <LuRefreshCw className={`text-base md:text-lg ${isStreaming ? 'animate-spin' : ''}`} />
                                        <span className="text-[10px] md:text-sm hidden sm:inline">ซิงค์ข้อมูล</span>
                                        <span className="text-[10px] md:text-sm sm:hidden">ซิงค์</span>
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20">
                                            <RiLoader4Line className="text-lg animate-spin" />
                                            <span className="text-xs">กำลังรับข้อมูล...</span>
                                        </button>
                                        <button
                                            onClick={stopStream}
                                            className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full hover:bg-rose-500/20 transition-all"
                                        >
                                            <HiOutlineStop className="text-lg" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sort & Status Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest hidden xs:block">เรียงตาม:</span>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => toggleFilter('mostView')}
                                        className={`px-3 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${activeFilters.includes('mostView')
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                                    >
                                        ยอดวิว
                                    </button>
                                    <button
                                        onClick={() => toggleFilter('mostLiked')}
                                        className={`px-3 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${activeFilters.includes('mostLiked')
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                                    >
                                        เอนเกจเมนต์
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${isStreaming ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`} />
                                    <span className="text-xs font-bold text-blue-400 tracking-wide">{statusMessage}</span>
                                </div>
                                {newsResults.length > 0 && (
                                    <div className="h-4 w-px bg-white/10" />
                                )}
                                {newsResults.length > 0 && (
                                    <span className="text-xs font-bold text-gray-500">
                                        {newsResults.length} ข่าวล่าสุด
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* AI Filter Modal */}
                    <AnimatePresence>
                        {isAIFilterOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsAIFilterOpen(false)}
                                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-100"
                                />

                                {/* Modal Container */}
                                <div className="fixed inset-0 flex items-center justify-center z-101 p-4 pointer-events-none">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="w-full max-w-xl bg-[#141416] border border-white/10 rounded-[40px] p-8 md:p-10 shadow-3xl pointer-events-auto"
                                    >
                                        <div className="flex flex-col gap-6">
                                            {/* Header */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-blue-500">
                                                    <LuSparkles className="text-3xl" />
                                                    <h2 className="text-2xl font-black tracking-tight">AI Smart Filter</h2>
                                                </div>
                                                <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                                                    กรองเนื้อหาที่ต้องการโดยระบุเป็นภาษามนุษย์ (เช่น "หาเฉพาะเรื่องระดมทุนของส้มหยุด" หรือ "ข่าวที่เกี่ยวกับ Apple")
                                                </p>
                                            </div>

                                            {/* Input Area */}
                                            <div className="relative group">
                                                <textarea
                                                    autoFocus
                                                    value={aiPrompt}
                                                    onChange={(e) => setAiPrompt(e.target.value)}
                                                    placeholder="ระบุสิ่งที่ต้องการกรองที่นี่ . . ."
                                                    className="w-full h-48 bg-[#1a1a1c] border-2 border-white/5 rounded-3xl p-6 text-base text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"
                                                />
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-4 pt-2">
                                                <button
                                                    onClick={() => setIsAIFilterOpen(false)}
                                                    className="flex-1 py-4 rounded-2xl text-sm font-black text-gray-400 bg-[#1c1c1e] hover:bg-white/5 transition-all uppercase tracking-widest"
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button
                                                    onClick={handleAIFilter}
                                                    disabled={isAIProcessing || newsResults.length === 0}
                                                    className={`flex-1 py-4 rounded-2xl text-sm font-black text-white transition-all uppercase tracking-widest shadow-xl
                                                        ${isAIProcessing || newsResults.length === 0
                                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                            : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 active:scale-[0.98]'}`}
                                                >
                                                    {isAIProcessing ? 'กำลังวิเคราะห์...' : 'กรองข้อมูล'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Warning Banner */}
                    {isStreaming && (
                        <div className="mb-6 flex items-center gap-4 px-6 py-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
                            <div className="p-2.5 bg-orange-500/20 rounded-xl">
                                <HiOutlineClock className="text-orange-500 text-xl" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wide">กำลังประมวลผลข้อมูลสด</h4>
                                <p className="text-xs text-orange-400/80">กรุณาอย่าเปลี่ยนหน้าหรือปิดเบราว์เซอร์ จนกว่าระบบจะวิเคราะห์ข่าวครบตามจำนวน เพื่อป้องกันข้อมูลขาดหาย</p>
                            </div>
                        </div>
                    )}

                    {/* AI Summary Section */}
                    {aiSummary && (
                        <div className="mb-6 mx-1">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 backdrop-blur-3xl" />
                                <div className="relative p-4 md:p-6 border border-blue-500/20 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-blue-500/5">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-5 text-center sm:text-left">
                                        <div className="shrink-0 p-2.5 md:p-3.5 bg-blue-500/20 rounded-xl md:rounded-[1.25rem] shadow-inner">
                                            <LuSparkles className="text-blue-400 text-xl md:text-2xl animate-pulse" />
                                        </div>
                                        <div className="flex-1 space-y-2 w-full">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                                <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 tracking-tight">
                                                    บทสรุปจาก AI
                                                </h3>
                                                <span className="px-3 py-1 rounded-full border border-blue-500/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400/70">
                                                    AI Insight Summary
                                                </span>
                                            </div>
                                            <p className="text-gray-200 leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
                                                {aiSummary}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-24 -right-24 w-48 h-48 blur-[100px] rounded-full hidden sm:block" />
                                </div>
                            </motion.div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        {/* News Stream Grid */}
                        <div className={`
                        ${layoutMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6 pb-20'
                                : 'flex flex-col space-y-4 pb-20'}
                    `}>
                            {newsResults.length === 0 && isStreaming && (
                                <>
                                    <SkeletonCard variant={layoutMode} />
                                    <SkeletonCard variant={layoutMode} />
                                    <SkeletonCard variant={layoutMode} />
                                </>
                            )}

                            {newsResults.length === 0 && !isStreaming ? (
                                <div className="col-span-full py-40 flex flex-col items-center justify-center bg-white/2 rounded-[40px] border-2 border-dashed border-white/5 text-gray-500 text-center animate-in fade-in duration-700">
                                    <HiOutlineCalendarDays className="text-6xl mb-6 opacity-10" />
                                    <h3 className="text-xl font-bold text-gray-400">ยังไม่มีข้อมูลข่าววันนี้</h3>
                                    <p className="text-sm mt-2 max-w-md">กดปุ่ม "เริ่มรับข้อมูล" เพื่อเริ่มวิเคราะห์ข่าวสารล่าสุดของวันนี้</p>
                                </div>
                            ) : aiFilteredIds && displayNews.length === 0 ? (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/5 rounded-[40px] border border-white/10 text-gray-400 text-center animate-in fade-in">
                                    <LuSparkles className="text-5xl mb-4 text-blue-500/30" />
                                    <h3 className="text-lg font-bold">ไม่พบข่าวที่ตรงกับการคัดกรอง</h3>
                                    <p className="text-sm opacity-60 mt-1">ลองเปลี่ยนคำสั่งใหม่ หรือเช็คจำนวนข่าวทั้งหมด</p>
                                    <button
                                        onClick={() => {
                                            setAiFilteredIds(null);
                                            setAiSummary(null);
                                            setAiPrompt('');
                                        }}
                                        className="mt-6 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
                                    >
                                        ล้างการคัดกรอง
                                    </button>
                                </div>
                            ) : (
                                displayNews.map((res) => (
                                    <div key={res.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <DashboardCard
                                            post={mapToNewsItem(res)}
                                            variant={layoutMode}
                                            categories={categories}
                                            onAddToCategory={handleAddNewsToCategory}
                                            onDelete={handleDeleteIndividual}
                                        />
                                    </div>
                                ))
                            )}


                        </div>

                        {!isStreaming && nextCursor && !aiFilteredIds && (
                            <div className="flex justify-center mt-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <button
                                    onClick={() => startBulkAnalysis(nextCursor)}

                                    className="group relative flex items-center justify-center gap-4 px-12 py-5 rounded-4xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 w-full md:w-[400px] overflow-hidden shadow-2xl shadow-amber-500/5 active:scale-95"
                                    title={`Next Signal: ${nextCursor}`}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <div className="p-3 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                                        <HiOutlineClock className="text-2xl text-amber-500 animate-pulse" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-amber-500 font-black text-xl tracking-tight">ข่าวต่อไป</span>
                                        <span className="text-amber-500/40 text-[10px] uppercase font-bold tracking-[0.2em]">Load More Signals</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Processing Progress Status */}
                    {isStreaming && progress.total > 0 && (
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#0a1622]/90 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10">
                            <div className="flex flex-col min-w-[100px]">
                                <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest mb-1">Processing</span>
                                <span className="text-sm font-bold text-gray-200">{progress.current} / {progress.total}</span>
                            </div>
                            <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-linear-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-500 rounded-full"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent w-full animate-progress-shimmer"></div>
                            </div>
                        </div>
                    )}

                    <style>{`
                    @keyframes progress-shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-progress-shimmer {
                        animation: progress-shimmer 2s infinite linear;
                    }
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                </main>
                <div className="hidden xl:block">
                    <PostList
                        activeId={selectedPostList?.id}
                        onSelect={(list) => setSelectedPostList(list)}
                    />
                </div>


            </div>
        </div>
    );
};

export default TodayNews;
