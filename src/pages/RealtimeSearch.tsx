import { useState, useRef } from 'react';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SkeletonCard from '../components/SkeletonCard';
import {
    HiOutlineSparkles,
    HiOutlineAdjustmentsHorizontal,
    HiOutlineStop,
    HiOutlineMagnifyingGlass,
    HiOutlineClock
} from "react-icons/hi2";
import { RiLoader4Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { type NewsItem } from '../interface/news';

interface SearchData {
    query: string;
    query_type: string;
    use_followed_users: boolean;
    since_date: string;
    until_date: string;
    cursor: string;
}

interface NewsResult {
    id: number;
    title: string;
    content: any;
    source: string;
    url: string;
    tweet_id?: string;
    tweet_profile_pic?: string;
    current?: number;
    total?: number;
    created_at: string;
    retweet_count?: number
    reply_count?: number
    like_count?: number
    quote_count?: number
    view_count?: number
}

interface SSEEventData {
    message: string;
    followed_count?: number;
    step?: string;
    current?: number;
    total?: number;
    total_tweets?: number;
    analysis?: string | any;
    source?: string;
    url?: string;
    tweet_id?: string;
    error_code?: string;
    retweet_count?: number;
    reply_count?: number;
    like_count?: number;
    quote_count?: number;
    view_count?: number;
    tweet_created_at?: string;
}

interface SSEEvent {
    event: string;
    data: SSEEventData;
}

const LAYOUT_OPTIONS = [
    { id: 'grid', label: 'Grid', icon: <LuLayoutDashboard className="rotate-90" /> },
    { id: 'compact', label: 'Compact', icon: <LuLayoutDashboard className="scale-y-75" /> }
] as const;

const RealtimeSearch = () => {
    // States
    const [isStreaming, setIsStreaming] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'grid' | 'compact'>('grid');
    const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
    const [searchData, setSearchData] = useState<SearchData>({
        query: "AI OR machine learning",
        query_type: "Latest",
        since_date: "2026-02-01",
        until_date: "2026-02-24",
        use_followed_users: true,
        cursor: ""
    });

    // Results
    const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleSSEEvent = (data: SSEEvent) => {
        const { event, data: eventData } = data;

        switch (event) {
            case 'progress':
                if (eventData.step === 'analyzing' && eventData.current !== undefined && eventData.total !== undefined) {
                    setProgress({ current: eventData.current, total: eventData.total });
                }
                break;

            case 'individual_result':
                // Check if analysis is a JSON string or object from backend
                let parsedAnalysis = eventData.analysis;
                if (typeof eventData.analysis === 'string') {
                    try {
                        const potentialJson = JSON.parse(eventData.analysis);
                        if (potentialJson && typeof potentialJson === 'object') {
                            parsedAnalysis = potentialJson;
                        }
                    } catch (e) {
                        // Not JSON, keep as string
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

                // Only add if there is actual content to display
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
            case 'error':
                setIsStreaming(false);
                break;
        }
    };

    const extractTitle = (content: any): string => {
        if (typeof content === 'string') {
            const lines = content.split('\n');
            const firstLine = lines[0].replace(/Title:|#|###/g, '').trim();
            return firstLine || 'Intelligence Report';
        }
        return 'Intelligence Report';
    };

    const startAnalysisStream = async () => {
        if (isStreaming) return;
        setIsStreaming(true);
        setNewsResults([]);
        setProgress({ current: 0, total: 0 });
        abortControllerRef.current = new AbortController();

        const payload = {
            ...searchData,
            since_date: searchData.since_date || undefined,
            until_date: searchData.until_date || undefined
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
                            console.error('Error parsing SSE line:', line, e);
                        }
                    }
                }
                buffer = lines[lines.length - 1];
            }
        } catch (error: any) {
            console.error('Stream failed:', error);
        } finally {
            setIsStreaming(false);
        }
    };

    const stopStream = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setIsStreaming(false);
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
                            <HiOutlineSparkles className="text-cyan-400" />
                            Live Intelligence
                        </h1>
                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]' : 'bg-gray-600'}`}></span>
                            {isStreaming ? 'Receiving real-time signals...' : 'System ready'}
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
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={startAnalysisStream}
                            disabled={isStreaming}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold transition-all transform active:scale-95
                                ${isStreaming
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-linear-to-r from-blue-600 to-indigo-600 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5'
                                }`}
                        >
                            {isStreaming ? (
                                <RiLoader4Line className="text-xl animate-spin" />
                            ) : (
                                <HiOutlineSparkles className="text-xl" />
                            )}
                            <span>{isStreaming ? 'Streaming...' : 'Start Stream'}</span>
                        </button>

                        {isStreaming && (
                            <button
                                onClick={stopStream}
                                className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all"
                            >
                                <HiOutlineStop className="text-xl" />
                            </button>
                        )}
                    </div>
                </header>

                {/* Search Parameters Section - Horizontal Layout */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-6">
                        <HiOutlineAdjustmentsHorizontal className="text-blue-400" />
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Search Parameters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Search Query */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-medium ml-1">Search Query</label>
                            <div className="relative group">
                                <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    value={searchData.query}
                                    onChange={(e) => setSearchData(prev => ({ ...prev, query: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Result Type */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-medium ml-1">Result Type</label>
                            <div className="relative">
                                <select
                                    value={searchData.query_type}
                                    onChange={(e) => setSearchData(prev => ({ ...prev, query_type: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Latest">Latest</option>
                                    <option value="Top">Top Impact</option>
                                </select>
                                <HiOutlineAdjustmentsHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Since Date */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-medium ml-1">Since Date</label>
                            <input
                                type="date"
                                value={searchData.since_date}
                                onChange={(e) => setSearchData(prev => ({ ...prev, since_date: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all scheme-dark cursor-pointer"
                            />
                        </div>

                        {/* Until Date */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-medium ml-1">Until Date</label>
                            <input
                                type="date"
                                value={searchData.until_date}
                                onChange={(e) => setSearchData(prev => ({ ...prev, until_date: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all scheme-dark cursor-pointer"
                            />
                        </div>
                    </div>
                </section>

                {/* Stream Warning Banner */}
                {isStreaming && (
                    <div className="mb-6 flex items-center gap-3 px-6 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <HiOutlineClock className="text-amber-500 text-xl animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-500">กำลังประมวลผลข้อมูลสด</h4>
                            <p className="text-xs text-amber-500/80">กรุณาอย่าเปลี่ยนหน้าหรือปิดเบราว์เซอร์ จนกว่าระบบจะวิเคราะห์ข่าวครบตามจำนวน เพื่อป้องกันข้อมูลขาดหาย</p>
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
                                <HiOutlineSparkles className="text-6xl mb-6 opacity-10" />
                                <h3 className="text-xl font-bold text-gray-400">Ready for Live Intel</h3>
                                <p className="text-sm mt-2 max-w-md">Input your tracking keywords above and initialize the stream to receive real-time analyzed intelligence.</p>
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

                {/* Floating Progress Badge */}
                {isStreaming && progress.total > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Processing</span>
                            <span className="text-xs font-mono">{progress.current} / {progress.total}</span>
                        </div>
                        <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-cyan-500 shadow-[0_0_10px_cyan]"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default RealtimeSearch;
