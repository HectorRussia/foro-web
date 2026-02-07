import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { LuLayoutDashboard, LuSparkles } from 'react-icons/lu';
import dayjs from 'dayjs';
import DashboardCard from '../DashboardCard';
import api from '../../api/axiosInstance';
import { type PaginatedNewsResponse } from '../../interface/news';

const CATEGORIES = ["หมวดรวม", "เทคโนโลยี", "การตลาด"];
const TIME_FILTERS = ["ทั้งหมด", "วันนี้", "7 วัน", "30 วัน", "เก่ากว่า 30 วัน"];

const iconMain = [{
    icon: <LuLayoutDashboard />,
    label: "Layout"
}, {
    icon: <FaPlus />,
    label: "Plus"
}]

const LAYOUT_OPTIONS = [
    { id: 'list', label: 'Standard', icon: <LuLayoutDashboard /> },
    { id: 'grid', label: 'Grid', icon: <LuLayoutDashboard className="rotate-90" /> },
    { id: 'compact', label: 'Compact', icon: <LuLayoutDashboard className="scale-y-75" /> }
] as const;

const timeRangeMap: Record<string, number | null> = {
    'ทั้งหมด': null,
    'วันนี้': 1,
    '7 วัน': 7,
    '30 วัน': 30,
    'เก่ากว่า 30 วัน': -30,
};
const Main = () => {

    const [activeCategory, setActiveCategory] = useState('หมวดรวม');
    const [activeTime, setActiveTime] = useState('วันนี้');
    const [news, setNews] = useState<PaginatedNewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'list' | 'grid' | 'compact'>('list');

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzedToday, setHasAnalyzedToday] = useState(false);

    useEffect(() => {
        const checkTodayAnalysis = async () => {
            // If we are not on "Today" tab, we might not need to check, but let's check anyway to be ready
            // OR only check when activeTime becomes 'วันนี้'
            if (activeTime === 'วันนี้') {
                try {
                    const response = await api.get('/news/analyze');
                    const data = response.data;

                    // Check if data exists and is from today
                    // Assuming the API returns an object with a 'created_at' or 'date' field
                    // If the API returns the analysis directly, we check its timestamp
                    if (data && data.created_at) {
                        const isToday = dayjs(data.created_at).isSame(dayjs(), 'day');
                        if (isToday) {
                            setHasAnalyzedToday(true);
                        } else {
                            // Found old analysis, but not today's
                            setHasAnalyzedToday(false);
                        }
                    }
                } catch (error) {
                    // If 404, implies no analysis exists
                    console.log('No analysis found for today');
                    setHasAnalyzedToday(false);
                }
            }
        };
        checkTodayAnalysis();
    }, [activeTime]);

    const handleAnalyzeNews = async () => {
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        try {
            await api.post('/news/analyze');
            setHasAnalyzedToday(true);
        } catch (error) {
            console.error('Error analyzing news:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const fetchNews = async (page = 1, range: number | null = null) => {
        try {

            if (isLoading) return;
            setIsLoading(true);

            const response = await api.get<PaginatedNewsResponse>('/news', {
                params: {
                    page: page,
                    limit: 10,
                    days_range: range
                }
            });
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(1, timeRangeMap[activeTime]);
    }, [activeTime]);

    return (
        <main className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                        แดชบอร์ดข่าวสารของคุณ
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">ติดตามกระแสและอ่านสรุปเนื้อหาโดย LLM จากสิ่งที่คุณสนใจที่สุด</p>
                </div>

                <div className="flex items-center gap-3 z-50">
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b4e] border border-gray-700 transition-all text-sm font-medium z-10 relative">
                            {layoutMode === 'list' && <LuLayoutDashboard />}
                            {layoutMode === 'grid' && <LuLayoutDashboard className="rotate-90" />}
                            {layoutMode === 'compact' && <LuLayoutDashboard className="scale-y-75" />}
                            <span className="hidden sm:inline">
                                {layoutMode === 'list' ? 'Standard' : layoutMode === 'grid' ? 'Grid View' : 'Compact'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left md:origin-top-right z-50">
                            <div className="p-1">
                                {LAYOUT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setLayoutMode(option.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                                            ${layoutMode === option.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        <span className={option.id === 'grid' ? 'rotate-90' : option.id === 'compact' ? 'scale-y-75' : ''}>
                                            <LuLayoutDashboard />
                                        </span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all text-sm font-medium">
                        {iconMain[1].icon}
                        <span>เพิ่มหมวดใหม่</span>
                    </button>
                </div>
            </header>

            {/* Filters Section */}
            <div className="flex flex-col gap-6 mb-8">
                {/* Categories - Centered Pills */}
                <div className="flex justify-center flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === cat
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                : 'bg-[#0f172a] border-[#1e293b] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Time Filters & Secondary Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                    <div className="flex items-center gap-2 bg-[#0f172a] p-1 rounded-lg border border-[#1e293b] overflow-x-auto max-w-full">
                        {TIME_FILTERS.map(time => (
                            <button
                                key={time}
                                disabled={isLoading}
                                onClick={() => setActiveTime(time)}
                                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all 
                                            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
                                            ${activeTime === time ? 'bg-[#1e293b] text-white' : 'text-gray-400'}
                                        `}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    {/* Analyze Button - Shows only when "วันนี้" is selected and hasn't been clicked today */}
                    {activeTime === 'วันนี้' && !hasAnalyzedToday && (
                        <button
                            onClick={handleAnalyzeNews}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                        >
                            {isAnalyzing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <LuSparkles className="text-yellow-300" />
                            )}
                            <span className="text-sm font-medium">
                                {isAnalyzing ? 'กำลังวิเคราะห์...' : 'ดูข่าววันนี้'}
                            </span>
                        </button>
                    )}
                    <h2 className="text-lg font-semibold text-white/90">
                        {activeCategory}
                    </h2>
                </div>

            </div>

            {/* Cards Grid */}
            <div className={`
                ${layoutMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                    : layoutMode === 'compact'
                        ? 'flex flex-col space-y-2'
                        : 'flex flex-col space-y-4'
                }
            `}>
                {news?.items?.map(post => (
                    <DashboardCard key={post.id} post={post} variant={layoutMode} />
                ))}
            </div>
        </main >
    )
}

export default Main