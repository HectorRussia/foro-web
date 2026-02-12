import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import { deleteCategoryNews, getNewsByCategory } from '../api/categoryNews';
import { FaArrowLeft, FaLayerGroup } from 'react-icons/fa';
import { LuLayoutDashboard } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import type { NewsItem } from '../interface/news';
import type { CategoryNewsItem } from '../interface/categoryNews';

const LAYOUT_OPTIONS = [
    { id: 'list', label: 'Standard', icon: <LuLayoutDashboard /> },
    { id: 'grid', label: 'Grid', icon: <LuLayoutDashboard className="rotate-90" /> },
    { id: 'compact', label: 'Compact', icon: <LuLayoutDashboard className="scale-y-75" /> }
] as const;

const CategoryNews = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [news, setNews] = useState<CategoryNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [layoutMode, setLayoutMode] = useState<'list' | 'grid' | 'compact'>('list');

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchNews = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await getNewsByCategory(parseInt(id));
            setNews(data);
            if (data.length > 0) {
                setCategoryName(data[0].category_name);
            }
        } catch (error) {
            console.error('Error fetching category news:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchNews();
    }, [id]);

    // Map CategoryNewsItem to NewsItem for DashboardCard
    const mapToNewsItem = (item: CategoryNewsItem): NewsItem => ({
        id: item.news_id,
        title: item.news_title,
        content: item.news_content,
        url: item.news_url,
        tweet_profile_pic: item.news_tweet_profile_pic,
        created_at: item.created_at,
        user_id: 0 // Default or mapped if available
    });

    const handleRemoveFromCategory = async (newsId: number) => {
        setItemToDelete(newsId);
        setIsDeleteModalOpen(true);
    };

    const confirmRemove = async () => {
        if (!itemToDelete) return;

        const item = news.find(n => n.news_id === itemToDelete);
        if (!item) return;

        try {
            await deleteCategoryNews(item.id);
            toast.success('ลบข่าวออกจากหมวดหมู่สำเร็จ');
            setNews(prev => prev.filter(n => n.id !== item.id));
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Error removing news from category:', error);
            toast.error('เกิดข้อผิดพลาดในการลบข่าวออกจากหมวดหมู่');
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            <Sidebar />
            <main className="flex-1 ml-20 lg:ml-80 p-4 lg:p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors"
                        >
                            <FaArrowLeft /> ย้อนกลับ
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-400 flex items-center gap-3">
                            <FaLayerGroup className="text-blue-500" />
                            ข่าวในหมวดหมู่: {categoryName || '...'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 z-50">
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b4e] border border-gray-700 transition-all text-sm font-medium z-10 relative text-gray-200">
                                {layoutMode === 'list' && <LuLayoutDashboard />}
                                {layoutMode === 'grid' && <LuLayoutDashboard className="rotate-90" />}
                                {layoutMode === 'compact' && <LuLayoutDashboard className="scale-y-75" />}
                                <span className="hidden sm:inline">
                                    {layoutMode === 'list' ? 'Standard' : layoutMode === 'grid' ? 'Grid View' : 'Compact'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
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

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-slate-700">
                        <FaLayerGroup className="mx-auto text-6xl text-slate-600 mb-4" />
                        <h3 className="text-xl font-medium text-slate-400">ไม่พบข่าวในหมวดหมู่นี้</h3>
                    </div>
                ) : (
                    <div className={`
                        ${layoutMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                            : layoutMode === 'compact'
                                ? 'flex flex-col space-y-2'
                                : 'flex flex-col space-y-4'
                        }
                    `}>
                        {news.map(item => (
                            <DashboardCard
                                key={item.id}
                                post={mapToNewsItem(item)}
                                variant={layoutMode}
                                onRemoveFromCategory={handleRemoveFromCategory}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Custom Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl shadow-2xl border border-slate-700 p-8 text-center transform transition-all scale-100 animate-scale-in">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaLayerGroup className="text-3xl text-red-500" />
                            <div className="absolute ml-6 mt-6 bg-[#1e293b] rounded-full p-1">
                                <span className="bg-red-500 w-4 h-4 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-0.5 bg-white"></div>
                                </span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">ลบออกจากหมวดหมู่?</h3>
                        <p className="text-slate-400 mb-8 font-light text-sm leading-relaxed">
                            คุณแน่ใจหรือไม่ที่จะลบข่าวนี้ออกจากหมวดหมู่ <span className="text-blue-400 font-medium">"{categoryName}"</span>?
                            <br />การกระทำนี้จะลบความสัมพันธ์เท่านั้น ตัวข่าวจะยังคงอยู่ในระบบ
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 px-6 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all font-medium border border-slate-700/50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={confirmRemove}
                                className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all font-medium"
                            >
                                ลบข้อมูล
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryNews;
