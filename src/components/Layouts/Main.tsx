import { useEffect, useState } from 'react';
import { LuLayoutDashboard, LuSparkles } from 'react-icons/lu';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import DashboardCard from '../DashboardCard';
import { createCategoryNews } from '../../api/categoryNews';
import { type PaginatedNewsResponse } from '../../interface/news';
import { getCategories } from '../../api/category';
import { deleteNews, getNews, getNewsAnalysis, analyzeNews } from '../../api/news';
import { type Category } from '../../interface/category';

const TIME_FILTERS = ["ทั้งหมด", "วันนี้", "7 วัน", "30 วัน", "เก่ากว่า 30 วัน"];
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

    const [activeTime, setActiveTime] = useState('วันนี้');
    const [news, setNews] = useState<PaginatedNewsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [layoutMode, setLayoutMode] = useState<'list' | 'grid' | 'compact'>('list');

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzedToday, setHasAnalyzedToday] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchCats = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
            console.log('Categories loaded:', data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchCats();
    }, []);

    useEffect(() => {
        // console.log('Categories updated:', categories);
    }, [categories]);

    useEffect(() => {
        const checkTodayAnalysis = async () => {
            // If we are not on "Today" tab, we might not need to check, but let's check anyway to be ready
            // OR only check when activeTime becomes 'วันนี้'
            if (activeTime === 'วันนี้') {
                try {
                    const data = await getNewsAnalysis();

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

    const fetchNews = async (page = 1, range: number | null = null) => {
        try {

            if (isLoading) return;
            setIsLoading(true);

            const data = await getNews(page, 10, range);
            setNews(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeNews = async () => {
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        const loadingToast = toast.loading('กำลังวิเคราะห์ข่าว...');

        try {
            await analyzeNews();
            setHasAnalyzedToday(true);
            toast.success('วิเคราะห์ข่าวเสร็จสิ้น', { id: loadingToast });
            await fetchNews(1, timeRangeMap[activeTime]);
        } catch (error) {
            console.error('Error analyzing news:', error);
            toast.error('เกิดข้อผิดพลาดในการวิเคราะห์ข่าว', { id: loadingToast });
        } finally {
            setIsAnalyzing(false);
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

    const handleDeleteNews = async (newsId: number) => {
        setItemToDelete(newsId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteNews(itemToDelete);
            toast.success('ลบข่าวสำเร็จ');
            // Remove from state
            setNews(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    items: prev.items.filter(item => item.id !== itemToDelete)
                };
            });
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error('เกิดข้อผิดพลาดในการลบข่าว');
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

                </div>
            </header>

            {/* Filters Section */}
            <div className="flex flex-col gap-6 mb-8">
                {/* Time Filters & Secondary Actions */}
                <div className="flex flex-wrap items-center justify-start gap-4 border-b border-[#1e293b] pb-4">
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
                    <DashboardCard
                        key={post.id}
                        post={post}
                        variant={layoutMode}
                        categories={categories}
                        onAddToCategory={handleAddNewsToCategory}
                        onDelete={handleDeleteNews}
                    />
                ))}
            </div>
            {/* Custom Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl shadow-2xl border border-slate-700 p-8 text-center transform transition-all scale-100 animate-scale-in">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTrash className="text-3xl text-red-500" />
                            <div className="absolute ml-6 mt-6 bg-[#1e293b] rounded-full p-1">
                                <span className="bg-red-500 w-4 h-4 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-0.5 bg-white"></div>
                                </span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">ลบข่าว?</h3>
                        <p className="text-slate-400 mb-8 font-light text-sm leading-relaxed">
                            คุณแน่ใจหรือไม่ที่จะลบข่าวนี้?
                            <br />การกระทำนี้ไม่สามารถย้อนกลับได้ ข่าวจะถูกลบออกจากระบบทันที
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 px-6 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all font-medium border border-slate-700/50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all font-medium"
                            >
                                ลบข่าว
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main >
    )
}

export default Main