
import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Layouts/Sidebar';
import {
    HiOutlineMagnifyingGlass,
    HiOutlineChartBar,
    HiOutlineCheckCircle,
    HiOutlineCommandLine,
    HiOutlineUserGroup,
    HiOutlineCalendar,
    HiOutlineAdjustmentsHorizontal,
    HiOutlineStop,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineDocumentText
} from "react-icons/hi2";
import { RiLoader4Line, RiHistoryLine } from "react-icons/ri";

interface SearchData {
    query: string;
    query_type: string;
    use_followed_users: boolean;
    since_date: string;
    until_date: string;
    cursor: string;
}

interface LogEntry {
    id: number;
    message: string;
    type: 'success' | 'error' | 'progress' | 'analyzing' | 'complete' | 'info';
    timestamp: string;
}

interface NewsResult {
    id: number;
    title: string;
    content: any;
    source: string;
    url: string;
    tweet_id?: string;
    current?: number;
    total?: number;
    created_at: string;
    tweet_created_at?: string;
    tweet_profile_pic?: string;
    retweet_count?: number;
}

interface Statistics {
    followed_users: number;
    total_tweets: number;
    processed: number;
    saved: number;
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
    tweet_created_at?: string;
    tweet_profile_pic?: string;
    retweet_count?: number;
}

interface SSEEvent {
    event: string;
    data: SSEEventData;
}

const AdvancedSearchStream = () => {
    // States
    const [isStreaming, setIsStreaming] = useState(false);
    const [searchData, setSearchData] = useState<SearchData>({
        query: "AI OR machine learning",
        query_type: "Latest",
        since_date: "2024-02-01",
        until_date: "2024-02-24",
        use_followed_users: true,
        cursor: ""
    });

    // Progress & Results
    const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
    const [streamLogs, setStreamLogs] = useState<LogEntry[]>([]);
    const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
    const [statistics, setStatistics] = useState<Statistics>({
        followed_users: 0,
        total_tweets: 0,
        processed: 0,
        saved: 0
    });

    // Refs
    // Changed to AbortController to properly stop fetch streams
    const abortControllerRef = useRef<AbortController | null>(null);
    const logsEndRef = useRef<HTMLDivElement | null>(null);

    // Auto scroll logs
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [streamLogs]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // 🎯 เริ่ม SSE Stream
    const startAnalysisStream = async () => {
        // if (isStreaming || !searchData.query.trim()) return;

        setIsStreaming(true);
        setStreamLogs([]);
        setNewsResults([]);
        setProgress({ current: 0, total: 0 });
        setStatistics({ followed_users: 0, total_tweets: 0, processed: 0, saved: 0 });

        // Create new AbortController for this stream
        abortControllerRef.current = new AbortController();

        try {
            // เริ่ม SSE stream
            const response = await fetch(`${import.meta.env.VITE_API_URL}/advanced-search/search-and-analyze-stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(searchData),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('ReadableStream not supported');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            handleSSEEvent(data);
                        } catch (error) {
                            console.error('Error parsing SSE data:', error);
                        }
                    }
                }
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                addLog('🛑 หยุดการวิเคราะห์โดยผู้ใช้', 'info');
            } else {
                console.error('Stream error:', error);
                addLog(`❌ เกิดข้อผิดพลาด: ${error.message}`, 'error');
            }
            setIsStreaming(false);
        } finally {
            abortControllerRef.current = null;
        }
    };

    // 🎯 จัดการ SSE Events
    const handleSSEEvent = (data: SSEEvent) => {
        const { event, data: eventData } = data;

        switch (event) {
            case 'start':
                addLog('🔄 เริ่มต้นการค้นหาและวิเคราะห์...', 'info');
                break;

            case 'info':
                addLog(eventData.message, 'info');
                setStatistics(prev => ({
                    ...prev,
                    followed_users: eventData.followed_count || 0
                }));
                break;

            case 'progress':
                addLog(eventData.message, 'progress');
                if (eventData.step === 'analyzing' && eventData.current !== undefined && eventData.total !== undefined) {
                    setProgress({ current: eventData.current, total: eventData.total });
                }
                break;

            case 'search_complete':
                addLog(eventData.message, 'success');
                setStatistics(prev => ({
                    ...prev,
                    total_tweets: eventData.total_tweets || 0
                }));
                break;

            case 'analyzing':
                addLog(eventData.message, 'analyzing');
                break;

            case 'individual_result':
                // ✅ ข่าวที่วิเคราะห์เสร็จ - แสดงผลทันที!
                addLog(eventData.message, 'success');

                // เพิ่มข่าวใหม่ลงในรายการ
                const newsItem: NewsResult = {
                    id: Date.now() + Math.random(), // temp ID
                    title: extractTitle(eventData.analysis),
                    content: eventData.analysis,
                    source: eventData.source || 'Unknown',
                    url: eventData.url || '#',
                    tweet_id: eventData.tweet_id || '',
                    tweet_profile_pic: eventData.tweet_profile_pic || '',
                    retweet_count: eventData.retweet_count || 0,
                    current: eventData.current,
                    total: eventData.total,
                    created_at: eventData.tweet_created_at || new Date().toISOString(),
                    tweet_created_at: eventData.tweet_created_at
                };

                setNewsResults(prev => [...prev, newsItem]);
                setStatistics(prev => ({
                    ...prev,
                    processed: eventData.current || 0
                }));
                break;

            case 'database_saved':
                addLog(eventData.message, 'success');
                setStatistics(prev => ({
                    ...prev,
                    saved: eventData.current || 0
                }));
                break;

            case 'transition':
                addLog(eventData.message, 'info');
                break;

            case 'complete':
                addLog(eventData.message, 'complete');
                setIsStreaming(false);
                break;

            case 'error':
                addLog(eventData.message, 'error');
                if (eventData.error_code === 'SYSTEM_ERROR') {
                    setIsStreaming(false);
                }
                break;

            default:
                addLog(eventData.message || 'Unknown event', 'info');
        }
    };

    // 🎯 Helper Functions
    const addLog = (message: string, type: LogEntry['type']) => {
        const logEntry: LogEntry = {
            id: Date.now() + Math.random(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };

        setStreamLogs(prev => [...prev, logEntry]);
    };

    const extractTitle = (analysis: string | any) => {
        if (typeof analysis === 'string') {
            const lines = analysis.split('\n');
            return lines[0] || 'ไม่มีหัวข้อ';
        }
        return analysis?.title || analysis?.summary || 'ไม่มีหัวข้อ';
    };

    const stopStream = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsStreaming(false);
    };

    const getLogIcon = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'progress': return '📍';
            case 'analyzing': return '⏳';
            case 'complete': return '🎉';
            case 'info':
            default: return '📋';
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100 overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen overflow-hidden pl-20 lg:pl-80">
                {/* Header Section */}
                <header className="px-6 py-6 border-b border-white/5 bg-[#030e17]/80 backdrop-blur-xl z-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Advanced Intelligence Search
                            </h1>
                            <p className="text-gray-400 mt-1 flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${isStreaming ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]' : 'bg-gray-600'}`}></span>
                                {isStreaming ? 'Analysis in progress...' : 'Ready for deep-dive analysis'}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={startAnalysisStream}
                                disabled={isStreaming}
                                className={`group relative flex items-center gap-3 px-8 py-3 rounded-2xl font-semibold transition-all duration-300
                                    ${isStreaming
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-linear-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95'
                                    }`}
                            >
                                {isStreaming ? (
                                    <RiLoader4Line className="text-2xl animate-spin" />
                                ) : (
                                    <HiOutlineMagnifyingGlass className="text-2xl" />
                                )}
                                {isStreaming ? "Streaming Analysis..." : "Start Global Analysis"}
                            </button>

                            {isStreaming && (
                                <button
                                    onClick={stopStream}
                                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all flex items-center justify-center"
                                    title="Stop Analysis"
                                >
                                    <HiOutlineStop className="text-2xl" />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Search Configuration Card */}
                        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xs">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <HiOutlineAdjustmentsHorizontal className="text-blue-400" />
                                Search Parameters
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 ml-1">Search Query</label>
                                    <input
                                        type="text"
                                        placeholder="Keywords, hashtags..."
                                        value={searchData.query}
                                        onChange={(e) => setSearchData(prev => ({ ...prev, query: e.target.value }))}
                                        disabled={isStreaming}
                                        className="w-full bg-[#020a11] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 ml-1">Result Type</label>
                                    <div className="relative">
                                        <select
                                            value={searchData.query_type}
                                            onChange={(e) => setSearchData(prev => ({ ...prev, query_type: e.target.value }))}
                                            disabled={isStreaming}
                                            className="w-full bg-[#020a11] border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all"
                                        >
                                            <option value="Latest">Latest</option>
                                            <option value="Top">Top Relevance</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                            <HiOutlineAdjustmentsHorizontal />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 ml-1">Since Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={searchData.since_date}
                                            onChange={(e) => setSearchData(prev => ({ ...prev, since_date: e.target.value }))}
                                            disabled={isStreaming}
                                            className="w-full bg-[#020a11] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all scheme-dark"
                                        />
                                        <HiOutlineCalendar className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 ml-1">Until Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={searchData.until_date}
                                            onChange={(e) => setSearchData(prev => ({ ...prev, until_date: e.target.value }))}
                                            disabled={isStreaming}
                                            className="w-full bg-[#020a11] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all scheme-dark"
                                        />
                                        <HiOutlineCalendar className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Status Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Network Scope", value: statistics.followed_users, icon: HiOutlineUserGroup, color: "text-blue-400" },
                                { label: "Global Hits", value: statistics.total_tweets, icon: RiHistoryLine, color: "text-purple-400" },
                                { label: "Analyzed", value: statistics.processed, icon: HiOutlineChartBar, color: "text-emerald-400" },
                                { label: "Saved Intel", value: statistics.saved, icon: HiOutlineCheckCircle, color: "text-rose-400" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xs hover:border-white/20 transition-all hover:translate-y-[-2px]">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                                            <item.icon className="text-xl" />
                                        </div>
                                        <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                                    </div>
                                    <div className="mt-3 text-3xl font-bold tracking-tight">{item.value.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar Area */}
                        {(isStreaming || progress.total > 0) && (
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Processing Intelligence</span>
                                        <h3 className="text-xl font-bold mt-1">Global Sentiment Pipeline</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-white">{progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%</span>
                                        <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">{progress.current} / {progress.total} Units</p>
                                    </div>
                                </div>
                                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                    <div
                                        className="h-full bg-linear-to-r from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">

                            {/* Real-time Results Feed */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <HiOutlineDocumentText className="text-cyan-400" />
                                        Intelligence Report ({newsResults.length})
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Live Intel</span>
                                    </div>
                                </div>

                                {newsResults.length === 0 && !isStreaming ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                        <HiOutlineMagnifyingGlass className="text-6xl mb-4 opacity-10" />
                                        <p className="text-sm tracking-wide">Enter query to begin data synthesis</p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {newsResults.map((news) => (
                                            <div
                                                key={news.id}
                                                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                                                                {news.current}/{news.total}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 font-mono">
                                                                <HiOutlineArrowTopRightOnSquare className="text-xs" />
                                                                {news.source}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 font-medium">
                                                            {new Date(news.created_at).toLocaleTimeString()}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors leading-snug">
                                                        {news.title}
                                                    </h3>

                                                    <div className="bg-black/30 rounded-xl p-5 border border-white/5 text-gray-300 text-sm leading-relaxed mb-4">
                                                        {typeof news.content === 'string' ? news.content : JSON.stringify(news.content)}
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <a
                                                            href={news.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/5 px-4 py-2 rounded-lg border border-cyan-400/10"
                                                        >
                                                            Inspect Raw Source <HiOutlineArrowTopRightOnSquare />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Live Command Logger */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <HiOutlineCommandLine className="text-amber-400" />
                                        <h2 className="text-xl font-bold">Synthesizer Logs</h2>
                                    </div>

                                    <div className="bg-[#020a11] border border-white/10 rounded-3xl h-[650px] flex flex-col shadow-2xl relative overflow-hidden group">
                                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                                                <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">advance_synth_v2.0 --live</span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-3 scrollbar-hide">
                                            {streamLogs.length === 0 && (
                                                <div className="text-gray-700 flex flex-col items-center justify-center h-full opacity-50">
                                                    <RiHistoryLine className="text-3xl mb-2" />
                                                    <p className="italic">Kernel idle. Awaiting user input...</p>
                                                </div>
                                            )}
                                            {streamLogs.map((log) => (
                                                <div key={log.id} className={`flex gap-3 leading-relaxed group/line ${log.type === 'error' ? 'text-rose-400' :
                                                    log.type === 'success' ? 'text-emerald-400' :
                                                        log.type === 'progress' ? 'text-cyan-400' :
                                                            log.type === 'analyzing' ? 'text-purple-400' :
                                                                log.type === 'complete' ? 'text-amber-400' :
                                                                    'text-gray-400'
                                                    }`}>
                                                    <span className="shrink-0 opacity-20 select-none font-bold group-hover/line:opacity-50 transition-opacity">[{log.timestamp.split(' ')[0]}]</span>
                                                    <span className="wrap-break-word">{getLogIcon(log.type)} {log.message}</span>
                                                </div>
                                            ))}
                                            <div ref={logsEndRef} />
                                        </div>

                                        <div className="p-4 border-t border-white/5 bg-black/40 text-[10px] font-mono text-gray-500 flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-1.5 w-1.5 rounded-full ${isStreaming ? 'bg-emerald-500' : 'bg-gray-700'}`}></span>
                                                <span>SYSTEM: {isStreaming ? "ONLINE" : "STANDBY"}</span>
                                            </div>
                                            <span>PORT: 8080</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                [color-scheme:dark]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-in-from-bottom {
                    from { transform: translateY(20px); }
                    to { transform: translateY(0); }
                }
                .animate-in {
                    animation-duration: 0.6s;
                    animation-fill-mode: both;
                    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
                }
                .fade-in { animation-name: fade-in; }
                .slide-in-from-bottom-6 { animation-name: slide-in-from-bottom; }
            `}</style>
        </div>
    );
};

export default AdvancedSearchStream;