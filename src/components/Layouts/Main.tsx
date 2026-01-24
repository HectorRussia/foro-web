import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { LuLayoutDashboard } from 'react-icons/lu';
import DashboardCard from '../DashboardCard';
import api from '../../api/axiosInstance';

const CATEGORIES = ["หมวดรวม", "เทคโนโลยี", "การตลาด"];
const TIME_FILTERS = ["ทั้งหมด", "วันนี้", "7 วัน", "30 วัน", "เก่ากว่า 30 วัน"];

const iconMain = [{
    icon: <LuLayoutDashboard />,
    label: "Layout"
}, {
    icon: <FaPlus />,
    label: "Plus"
}]

export interface NewsItem {
    id: number,
    title: string,
    content: string,
    url: string,
    user_id: number,
    tweet_profile_pic: string
    created_at: string
}
export interface PaginatedNewsResponse {
    items: NewsItem[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
}

const Main = () => {

    const [activeCategory, setActiveCategory] = useState('หมวดรวม');
    const [activeTime, setActiveTime] = useState('วันนี้');
    const [news, setNews] = useState<PaginatedNewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
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

    const timeRangeMap: Record<string, number | null> = {
        'ทั้งหมด': null,
        'วันนี้': 1,
        '7 วัน': 7,
        '30 วัน': 30,
        'เก่ากว่า 30 วัน': -30,
    };

    useEffect(() => {
        fetchNews(1, timeRangeMap[activeTime]);
    }, [activeTime]);

    return (
        <main className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        แดชบอร์ดข่าวสารของคุณ
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">ติดตามกระแสและสรุปเนื้อหาที่คุณสนใจล่าสุด</p>
                </div>

                <div className="flex items-center gap-3 z-100">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b4e] border border-gray-700 transition-all text-sm font-medium">
                        {iconMain[0].icon}
                        <span className="hidden sm:inline">เลือกเลย์เอาต์</span>
                    </button>
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
                    <div className="flex items-center gap-2 bg-[#0f172a] p-1 rounded-lg border border-[#1e293b]">
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
                    <h2 className="text-lg font-semibold text-white/90">
                        {activeCategory}
                    </h2>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="space-y-4">
                {news?.items?.map(post => (
                    <DashboardCard key={post.id} post={post} />
                ))}
            </div>
        </main>
    )
}

export default Main