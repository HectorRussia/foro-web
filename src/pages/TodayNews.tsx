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
    HiOutlineFunnel
} from "react-icons/hi2";
import { RiLoader4Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
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

    const handleClear = async () => {
        try {
            const newsIds = newsResults.map(item => item.id);
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
        id: res.id,
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
        return sorted;
    };

    const displayNews = getFilteredNews();

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100 overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-20 lg:ml-80 p-6 flex flex-col h-screen overflow-hidden">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                            <HiOutlineCalendarDays className="text-blue-400" />
                            ข่าววันนี้
                        </h1>
                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                            <span className={`h-5 w-5 rounded-full ${isStreaming ? 'bg-blue-400 animate-pulse shadow-[0_0_8px_blue]' : 'bg-gray-600'}`}></span>
                            {statusMessage}
                            {newsResults.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 animate-in fade-in slide-in-from-left-2">
                                    จำนวนข่าวในหน้านี้ {newsResults.length}
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Layout Toggle */}
                        <div className="relative" ref={layoutDropdownRef}>
                            <button
                                onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
                            >
                                {layoutMode === 'grid' ? <LuLayoutDashboard className="rotate-90" /> : <LuLayoutDashboard className="scale-y-75" />}
                                <span className="hidden sm:inline">{layoutMode === 'grid' ? 'Grid View' : 'Compact View'}</span>
                            </button>

                            {isLayoutDropdownOpen && (
                                <div className="absolute left-0 top-full mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                                    {LAYOUT_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => { setLayoutMode(option.id); setIsLayoutDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${layoutMode === option.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                        >
                                            {option.icon}
                                            {option.label === 'Grid' ? 'Grid' : 'Compact'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <div className="relative" ref={filterDropdownRef}>
                            <button
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 transition-all text-sm font-medium ${isFilterDropdownOpen || activeFilters.length > 0 ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                            >
                                <HiOutlineFunnel className={activeFilters.length > 0 ? 'animate-pulse' : ''} />
                                <span className="hidden sm:inline">Filter</span>
                                {activeFilters.length > 0 && (
                                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white font-bold ml-1">
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
                        <div className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                            <button
                                onClick={handleClear}
                                className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                                title="ล้างข้อมูลทั้งหน้าจอและหยุดระบบ"
                            >
                                <HiOutlineTrash className="text-xl" />
                            </button>
                            {isRestorable && (
                                <button
                                    onClick={handleRestore}
                                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all animate-pulse"
                                    title="กู้คืนข้อมูลที่เพิ่งล้างไป"
                                >
                                    <HiOutlineArrowPath className="text-xl" />
                                </button>
                            )}
                        </div>



                        {!isStreaming ? (
                            <button
                                onClick={() => startAnalysisStream()}
                                disabled={hasStarted || newsResults.length > 0}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold transition-all transform 
                                    ${hasStarted || newsResults.length > 0
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-linear-to-r from-blue-600 to-blue-500 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95'
                                    }`}
                            >
                                <HiOutlineSparkles className={`text-xl ${hasStarted || newsResults.length > 0 ? 'text-gray-600' : 'text-white'}`} />
                                <span>อ่านข่าววันนี้</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-semibold cursor-default"
                                >
                                    <RiLoader4Line className="text-xl animate-spin" />
                                    <span>กำลังรับข้อมูล...</span>
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

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    {/* News Stream Grid */}
                    <div className={`
                        ${layoutMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20'
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

                    {!isStreaming && nextCursor && (
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
