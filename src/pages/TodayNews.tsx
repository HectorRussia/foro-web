import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SkeletonCard from '../components/SkeletonCard';
import {
    HiOutlineSparkles,
    HiOutlineStop,
    HiOutlineClock,
    HiOutlineCalendarDays
} from "react-icons/hi2";
import { RiLoader4Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { type NewsItem, type NewsResult, type SSEEvent } from '../interface/news';


const LAYOUT_OPTIONS = [
    { id: 'grid', label: 'Grid', icon: <LuLayoutDashboard className="rotate-90" /> },
    { id: 'compact', label: 'Compact', icon: <LuLayoutDashboard className="scale-y-75" /> }
] as const;

const TodayNews = () => {

    const [isStreaming, setIsStreaming] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'grid' | 'compact'>('grid');
    const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('ระบบพร้อมทำงาน');
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    // Search Parameters
    const [searchParams] = useState({
        query_type: "Latest",
        since_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        until_date: dayjs().format('YYYY-MM-DD'),
        use_followed_users: true,
        cursor: ""
    });

    // Results
    const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);

    // Context restoration and Cleanup on unmount
    useEffect(() => {
        // Clear cursor on mount to ensure fresh start on refresh
        localStorage.removeItem('today_news_twitter_cursor');
        setNextCursor(null);
        setHasStarted(false);

        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            // Clear cursor on unmount to handle page navigation
            localStorage.removeItem('today_news_twitter_cursor');
        };
    }, []);

    const handleSSEEvent = (data: SSEEvent) => {
        const { event, data: eventData } = data;

        if (eventData.message) {
            setStatusMessage(eventData.message);
        }

        // Initial capture of next_cursor if provided in any event (fallback)
        const rawData = { ...data, ...(eventData || {}) } as any;
        if (rawData.next_cursor && !nextCursor) {
            setNextCursor(rawData.next_cursor);
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
                        retweet_count: getNum(['retweet_count', 'retweets', 'retweetCount']),
                        reply_count: getNum(['reply_count', 'replies', 'comment_count', 'replyCount']),
                        like_count: getNum(['like_count', 'likes', 'favorite_count', 'favorites', 'likeCount']),
                        quote_count: getNum(['quote_count', 'quotes', 'quoteCount']),
                        view_count: getNum(['view_count', 'views', 'impression_count', 'viewCount'])
                    };
                    setNewsResults(prev => [newsItem, ...prev]);
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

    const mapToNewsItem = (res: NewsResult): NewsItem => ({
        id: res.id,
        title: res.title,
        content: typeof res.content === 'string' ? res.content : JSON.stringify(res.content),
        url: res.url,
        user_id: 0,
        tweet_profile_pic: res.tweet_profile_pic || '',
        created_at: res.created_at,
        tweet_id: res.tweet_id || '',
        retweet_count: res.retweet_count,
        reply_count: res.reply_count,
        like_count: res.like_count,
        quote_count: res.quote_count,
        view_count: res.view_count
    });

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
                        <div className="relative">
                            <button
                                onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
                            >
                                {layoutMode === 'grid' ? <LuLayoutDashboard className="rotate-90" /> : <LuLayoutDashboard className="scale-y-75" />}
                                <span className="hidden sm:inline">{layoutMode === 'grid' ? 'Grid View' : 'Compact View'}</span>
                            </button>

                            {isLayoutDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
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

                        {!isStreaming && nextCursor && (
                            <button
                                onClick={() => startAnalysisStream(nextCursor)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold transition-all hover:bg-amber-500/20 active:scale-95 animate-in fade-in zoom-in-95"
                                title={`Next Signal: ${nextCursor}`}
                            >
                                <HiOutlineClock className="text-xl" />
                                <span className="hidden sm:inline">ข่าวต่อไป</span>
                            </button>
                        )}

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
                            newsResults.map((res) => (
                                <div key={res.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <DashboardCard
                                        post={mapToNewsItem(res)}
                                        variant={layoutMode}
                                    />
                                </div>
                            ))
                        )}


                    </div>
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
