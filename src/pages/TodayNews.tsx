import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SkeletonCard from '../components/SkeletonCard';
import {
    HiOutlineSparkles,
    HiOutlineStop,
    HiOutlineClock,
    HiOutlineCalendarDays,
    HiOutlineTrash,
    HiOutlineArrowPath,
    HiOutlineFunnel,
    HiOutlineXMark
} from "react-icons/hi2";
import { RiLoader4Line } from "react-icons/ri";
import { LuLayoutDashboard, LuSparkles } from "react-icons/lu";
import { AnimatePresence, motion } from 'framer-motion';
import { type NewsItem, type NewsResult, type SSEEvent } from '../interface/news';
import { getNews, getTriggerStatus, updateTriggerStatus } from '../api/news';
import { getCategories } from '../api/category';
import { createCategoryNews } from '../api/categoryNews';
import { toast } from 'react-hot-toast';
import { type Category } from '../interface/category';


const LAYOUT_OPTIONS = [
    { id: 'grid', label: 'Grid', icon: <LuLayoutDashboard className="rotate-90" /> },
    { id: 'compact', label: 'Compact', icon: <LuLayoutDashboard className="scale-y-75" /> }
] as const;

const TodayNews = () => {

    const [isStreaming, setIsStreaming] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'grid' | 'compact'>('grid');
    const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
    const layoutDropdownRef = useRef<HTMLDivElement>(null);

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
    const [searchParams] = useState({
        query_type: "Latest",
        since_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        until_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        use_followed_users: true,
        cursor: ""
    });

    // Results
    const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

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

    // Handle click outside to close layout dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(event.target as Node)) {
                setIsLayoutDropdownOpen(false);
            }
        };

        if (isLayoutDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLayoutDropdownOpen]);

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

    const handleSSEEvent = (data: SSEEvent) => {
        const { event, data: eventData } = data;

        if (eventData.message) {
            setStatusMessage(eventData.message);
        }

        // Initial capture of next_cursor if provided in any event (fallback)
        const rawData = { ...data, ...(eventData || {}) } as any;
        const potentialCursor = rawData.next_cursor || rawData.twitter_cursor;
        if (potentialCursor && potentialCursor !== nextCursor) {
            setNextCursor(potentialCursor);
            localStorage.setItem('today_news_twitter_cursor', potentialCursor);
        }


        switch (event) {
            case 'progress':
                if (eventData.step === 'analyzing' && eventData.current !== undefined && eventData.total !== undefined) {
                    setProgress({ current: eventData.current, total: eventData.total });
                }
                break;

            case 'individual_result':
                let parsedAnalysis = eventData.analysis;
                if (typeof eventData.analysis === 'string') {
                    try {
                        const potentialJson = JSON.parse(eventData.analysis);
                        if (potentialJson && typeof potentialJson === 'object') {
                            parsedAnalysis = potentialJson;
                        }
                    } catch (e) {
                        // Not JSON
                    }
                }

                // Extremely robust helper to find values in any possible location
                const findVal = (keys: string[], containers: any[] = []): any => {
                    const eData = eventData as any;
                    const allContainers = [
                        eData,
                        parsedAnalysis,
                        eData?.data,
                        eData?.tweet,
                        parsedAnalysis?.tweet,
                        parsedAnalysis?.public_metrics,
                        eData?.public_metrics,
                        data,
                        ...containers
                    ];

                    for (const container of allContainers) {
                        if (!container || typeof container !== 'object') continue;
                        for (const key of keys) {
                            if (container[key] !== undefined && container[key] !== null) {
                                return container[key];
                            }
                        }
                    }
                    return undefined;
                };

                const getNum = (keys: string[]) => {
                    const val = findVal(keys);
                    return (val !== undefined && val !== null) ? Number(val) : 0;
                };

                const content = findVal(['content', 'text', 'full_text']) || parsedAnalysis?.llm_analysis || eventData?.analysis;

                if (parsedAnalysis?.llm_analysis || (typeof eventData?.analysis === 'string' && eventData.analysis.trim().length > 0) || findVal(['content', 'text'])) {
                    const newsItem: NewsResult = {
                        id: findVal(['id', 'tweet_id']) || Date.now() + Math.random(),
                        title: findVal(['title', 'name', 'tweet_name']) || parsedAnalysis?.tweet_name || extractTitle(content),
                        content: content,
                        source: parsedAnalysis?.tweet_name || findVal(['source', 'user_name', 'screen_name']) || 'Twitter',
                        url: findVal(['url', 'post_url']) || parsedAnalysis?.url || '#',
                        tweet_id: findVal(['tweet_id', 'id_str', 'id']),
                        tweet_profile_pic: parsedAnalysis?.tweet_profile_pic || findVal(['tweet_profile_pic', 'profile_image_url', 'profile_image_url_https']),
                        current: eventData.current,
                        total: eventData.total,
                        created_at: findVal(['tweet_created_at', 'created_at', 'timestamp']) || new Date().toISOString(),
                        tweet_created_at: findVal(['tweet_created_at', 'created_at', 'timestamp']),
                        retweet_count: getNum(['retweet_count', 'retweets', 'retweetCount']),
                        reply_count: getNum(['reply_count', 'replies', 'comment_count', 'replyCount']),
                        like_count: getNum(['like_count', 'likes', 'favorite_count', 'favorites', 'likeCount']),
                        quote_count: getNum(['quote_count', 'quotes', 'quoteCount']),
                        view_count: getNum(['view_count', 'views', 'impression_count', 'viewCount'])
                    };
                    setNewsResults(prev => {
                        const isDuplicate = prev.some(item => (item.tweet_id && item.tweet_id === newsItem.tweet_id) || item.id === newsItem.id);
                        let next;
                        if (isDuplicate) {
                            next = prev.map(item => ((item.tweet_id && item.tweet_id === newsItem.tweet_id) || item.id === newsItem.id) ? newsItem : item);
                        } else {
                            next = [...prev, newsItem];
                        }
                        return next.sort((a, b) => dayjs(b.tweet_created_at || b.created_at).valueOf() - dayjs(a.tweet_created_at || a.created_at).valueOf());
                    });
                }
                break;

            case 'complete':
                if (eventData.twitter_cursor) {
                    localStorage.setItem('today_news_twitter_cursor', eventData.twitter_cursor);
                    setNextCursor(eventData.twitter_cursor);
                }
                setStatusMessage('วิเคราะห์ชุดล่าสุดเสร็จสิ้น');
                setIsStreaming(false);
                break;
            case 'error':
                // Individual errors shouldn't stop the whole stream
                // We show the message but let it continue
                setStatusMessage(`⚠️ ${eventData.message?.substring(0, 50)}...`);
                break;
        }
    };

    const extractTitle = (content: any): string => {
        if (typeof content === 'string') {
            const lines = content.split('\n');
            const firstLine = lines[0].replace(/Title:|#|###/g, '').trim();
            return firstLine || 'Today Intelligence';
        }
        return 'Today Intelligence';
    };

    const startAnalysisStream = async (cursorOverride?: string) => {
        if (isStreaming) return;
        setIsStreaming(true);
        setStatusMessage('กำลังเชื่อมต่อ...');

        // If not loading more, clear previous results and cache
        if (!cursorOverride || typeof cursorOverride !== 'string') {
            setNewsResults([]);
            setNextCursor(null);
            localStorage.removeItem('today_news_twitter_cursor');
            localStorage.removeItem('today_news_is_cleared'); // Reset clear flag on new start
            setHasStarted(true);
        }

        setProgress({ current: 0, total: 0 });
        abortControllerRef.current = new AbortController();

        const payload = {
            ...searchParams,
            cursor: (typeof cursorOverride === 'string') ? cursorOverride : searchParams.cursor
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/advanced-search/search-and-analyze-stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payload),
                signal: abortControllerRef.current.signal
            });

            if (!response.body) throw new Error("Stream body missing");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('data: ')) {
                        try {
                            const eventData = JSON.parse(line.slice(6));
                            handleSSEEvent(eventData);
                        } catch (e) {
                            console.error('Error parsing SSE line:', line);
                        }
                    }
                }
                buffer = lines[lines.length - 1];
            }
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Stream failed:', error);
            }
        } finally {
            setIsStreaming(false);
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
        const sorted = [...newsResults].sort((a, b) => {
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
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100 overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-20 lg:ml-80 p-3 md:p-6 flex flex-col h-screen overflow-hidden">

                {/* Header Section */}
                <header className="flex flex-col gap-4 mb-4 md:mb-8 md:flex-row md:items-center md:justify-between shrink-0">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                            <HiOutlineCalendarDays className="text-blue-400" />
                            ข่าววันนี้
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${isStreaming ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`}></span>
                            <span className="text-gray-400 text-xs font-medium">{statusMessage}</span>
                            {newsResults.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                                    {newsResults.length} ข่าว
                                </span>
                            )}
                            {aiFilteredIds && (
                                <button
                                    onClick={() => {
                                        setAiFilteredIds(null);
                                        setAiSummary(null);
                                        setAiPrompt('');
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs md:text-sm font-bold text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                >
                                    <HiOutlineStop className="text-sm md:text-base" />
                                    ยกเลิกคัดกรอง ({aiFilteredIds.length})
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* AI Filter Feature */}
                        <div className="relative" ref={aiFilterRef}>
                            <button
                                onClick={() => setIsAIFilterOpen(!isAIFilterOpen)}
                                className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl transition-all duration-300 font-bold border ${isAIFilterOpen
                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'}`}
                            >
                                <LuSparkles className={`text-lg md:text-xl ${isAIFilterOpen ? 'animate-pulse' : 'text-blue-400'}`} />
                                <span className="text-xs md:text-sm font-black tracking-tight text-white">AI Filter</span>
                            </button>

                            <AnimatePresence>
                                {isAIFilterOpen && (
                                    <>
                                        {/* Mobile Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setIsAIFilterOpen(false)}
                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 md:hidden"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="fixed md:absolute left-4 right-4 md:left-0 md:right-auto top-1/2 md:top-full -translate-y-1/2 md:translate-y-0 md:mt-4 md:w-80 p-4 md:p-5 bg-[#1a2c3e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl md:rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-70"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between md:hidden mb-2">
                                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                        <LuSparkles className="text-blue-400" />
                                                        AI Filter
                                                    </h3>
                                                    <button 
                                                        onClick={() => setIsAIFilterOpen(false)}
                                                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                                    >
                                                        <HiOutlineXMark className="text-xl text-gray-400 group-hover:text-white transition-colors" />
                                                    </button>
                                                </div>

                                                <div className="bg-[#0f1a26] border border-white/5 rounded-2xl p-4">
                                                    <p className="text-sm font-medium text-gray-300 leading-relaxed text-center">
                                                        พิมพ์บอก AI ว่าอยากได้แนวไหน AI จะคัดกรองเฉพาะทวีตที่เกี่ยวข้องมาให้จากทั้งหมด {newsResults.length} โพส
                                                    </p>
                                                </div>

                                                <textarea
                                                    autoFocus
                                                    value={aiPrompt}
                                                    onChange={(e) => setAiPrompt(e.target.value)}
                                                    placeholder="เช่น: สรุปคนดราม่าเรื่องอะไรกัน หรือ หาข่าวที่มีแนวโน้มบวก..."
                                                    className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-gray-600"
                                                />

                                                <div className="flex items-center gap-3 pt-2">
                                                    <button
                                                        onClick={() => setIsAIFilterOpen(false)}
                                                        className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                                                    >
                                                        ยกเลิก
                                                    </button>
                                                    <button
                                                        onClick={handleAIFilter}
                                                        disabled={isAIProcessing || newsResults.length === 0}
                                                        className={`
                                                            flex-2 px-6 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2
                                                            ${isAIProcessing || newsResults.length === 0
                                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                                : 'bg-[#ff00ff] text-white hover:bg-[#ff00ff]/80 shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.6)]'}
                                                        `}
                                                    >
                                                        {isAIProcessing ? (
                                                            <>
                                                                <RiLoader4Line className="animate-spin text-lg" />
                                                                <span>ส่งข้อมูล...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <HiOutlineFunnel className="text-lg" />
                                                                <span>filter</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Layout Toggle - Compact on mobile */}
                        <div className="relative" ref={layoutDropdownRef}>
                            <button
                                onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                                className="flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
                            >
                                {layoutMode === 'grid' ? <LuLayoutDashboard className="rotate-90 text-lg" /> : <LuLayoutDashboard className="scale-y-75 text-lg" />}
                                <span className="hidden md:inline ml-2">{layoutMode === 'grid' ? 'Grid View' : 'Compact View'}</span>
                            </button>

                            {isLayoutDropdownOpen && (
                                <div className="absolute left-0 top-full mt-2 w-40 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                                    {LAYOUT_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => { setLayoutMode(option.id); setIsLayoutDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${layoutMode === option.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                        >
                                            {option.icon}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filter Toggle - Compact on mobile */}
                        <div className="relative" ref={filterDropdownRef}>
                            <button
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className={`relative flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2.5 rounded-xl border border-white/10 transition-all text-sm font-medium ${isFilterDropdownOpen || activeFilters.length > 0 ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                            >
                                <HiOutlineFunnel className={`${activeFilters.length > 0 ? 'animate-pulse' : ''} text-lg`} />
                                <span className="hidden md:inline ml-2">Filter</span>
                                {activeFilters.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white font-bold md:static md:ml-1 md:w-5 md:h-5">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>

                            {isFilterDropdownOpen && (
                                <div className="absolute right-0 sm:left-0 top-full mt-2 w-52 bg-[#1e293b]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-60 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                                    <div className="p-3 space-y-2">
                                        <button
                                            onClick={() => toggleFilter('mostView')}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeFilters.includes('mostView') ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${activeFilters.includes('mostView') ? 'bg-black animate-pulse' : 'bg-gray-500'}`} />
                                                Most View
                                            </div>
                                            {activeFilters.includes('mostView') && <span className="text-[10px] opacity-70">Active</span>}
                                        </button>
                                        <button
                                            onClick={() => toggleFilter('mostLiked')}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeFilters.includes('mostLiked') ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${activeFilters.includes('mostLiked') ? 'bg-black animate-pulse' : 'bg-gray-500'}`} />
                                                Most Liked
                                            </div>
                                            {activeFilters.includes('mostLiked') && <span className="text-[10px] opacity-70">Active</span>}
                                        </button>

                                        {activeFilters.length > 0 && (
                                            <div className="pt-2 border-t border-white/5">
                                                <button
                                                    onClick={() => setActiveFilters([])}
                                                    className="w-full flex items-center justify-center px-4 py-2 text-[10px] text-gray-500 hover:text-rose-400 font-bold uppercase tracking-widest transition-colors"
                                                >
                                                    Reset All Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clear & Restore Controls */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                            <button
                                onClick={handleClear}
                                className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                title="ล้างข้อมูล"
                            >
                                <HiOutlineTrash className="text-xl" />
                            </button>
                            {isRestorable && (
                                <button
                                    onClick={handleRestore}
                                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all animate-pulse"
                                    title="กู้คืน"
                                >
                                    <HiOutlineArrowPath className="text-xl" />
                                </button>
                            )}
                        </div>

                        {!isStreaming ? (
                            <button
                                onClick={() => startAnalysisStream()}
                                disabled={hasStarted || newsResults.length > 0}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold transition-all transform 
                                    ${hasStarted || newsResults.length > 0
                                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                                        : 'bg-linear-to-r from-blue-600 to-blue-500 shadow-xl active:scale-95'
                                    }`}
                            >
                                <HiOutlineSparkles className="text-lg" />
                                <span className="text-sm">อ่านข่าววันนี้</span>
                            </button>
                        ) : (
                            <div className="flex-1 sm:flex-none flex items-center gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-bold cursor-default border border-blue-500/20">
                                    <RiLoader4Line className="text-lg animate-spin" />
                                    <span className="text-xs">กำลังรับข้อมูล...</span>
                                </button>
                                <button
                                    onClick={stopStream}
                                    className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all font-semibold"
                                >
                                    <HiOutlineStop className="text-xl" />
                                </button>
                            </div>
                        )}
                    </div>
                </header>

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
                            <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl" />
                            <div className="relative p-4 md:p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-blue-500/5">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-5 text-center sm:text-left">
                                    <div className="shrink-0 p-2.5 md:p-3.5 bg-blue-500/20 rounded-xl md:rounded-[1.25rem] shadow-inner">
                                        <LuSparkles className="text-blue-400 text-xl md:text-2xl animate-pulse" />
                                    </div>
                                    <div className="flex-1 space-y-2 w-full">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                            <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 tracking-tight">
                                                บทสรุปจาก AI
                                            </h3>
                                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400/70">
                                                AI Insight Summary
                                            </span>
                                        </div>
                                        <p className="text-gray-200 leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
                                            {aiSummary}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full hidden sm:block" />
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {/* News Stream Grid */}
                    <div className={`
                        ${layoutMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-20'
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
                                onClick={() => startAnalysisStream(nextCursor)}
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
        </div>
    );
};

export default TodayNews;
