import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { LuLayoutDashboard, LuSearch, LuX } from 'react-icons/lu';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import DashboardCard from '../DashboardCard';
import { createCategoryNews } from '../../api/categoryNews';
import { getCategories } from '../../api/category';
import { deleteNews, getNews } from '../../api/news';
import { type Category } from '../../interface/category';

type SortMode = 'views' | 'engagement' | null;

const VIEW_THRESHOLD = 10_000;
const ENGAGEMENT_THRESHOLD = 100;

const LAYOUT_OPTIONS = [
    { id: 'grid', label: 'Grid', icon: <LuLayoutDashboard className="rotate-90" /> },
    { id: 'compact', label: 'Compact', icon: <LuLayoutDashboard className="scale-y-75" /> }
] as const;

const Main = () => {
    const queryClient = useQueryClient();
    const [layoutMode, setLayoutMode] = useState<'grid' | 'compact'>('grid');
    const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
    const { ref, inView } = useInView({ rootMargin: '200px' });
    const mainRef = useRef<HTMLElement>(null);

    // Search & Filter state
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeSort, setActiveSort] = useState<SortMode>(null);

    // Debounce search (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const minViewCount = activeSort === 'views' ? VIEW_THRESHOLD : undefined;
    const minEngagement = activeSort === 'engagement' ? ENGAGEMENT_THRESHOLD : undefined;

    const toggleSort = useCallback((mode: SortMode) => {
        setActiveSort((prev) => (prev === mode ? null : mode));
    }, []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['news', debouncedSearch, activeSort],
        queryFn: ({ pageParam = 1 }) =>
            getNews(pageParam, 10, null, debouncedSearch || undefined, minViewCount, minEngagement),
        getNextPageParam: (lastPage) => {
            const currentPage = Number(lastPage.page);
            const totalPages = Number(lastPage.pages);
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchCats = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchCats();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.layout-dropdown-container')) {
                setIsLayoutDropdownOpen(false);
            }
        };
        if (isLayoutDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLayoutDropdownOpen]);

    const handleAddNewsToCategory = async (categoryId: number, newsId: number) => {
        try {
            await createCategoryNews({ category_id: categoryId, news_id: newsId });
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
            queryClient.invalidateQueries({ queryKey: ['news'] });
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error('เกิดข้อผิดพลาดในการลบข่าว');
        }
    };

    return (
        <main ref={mainRef} className="reader-library-view read-library-main">
            {/* Header */}
            <header className="reader-header">
                <h1 className="hero-search-title reader-page-title">
                    อ่านข่าว
                </h1>
                <p className="hero-search-subtitle reader-page-subtitle">
                    บทความและข่าวสารที่คุณบันทึกไว้อ่านแบบ Deep Read
                </p>
            </header>

            {/* Filter & Search Section */}
            <div className="reader-toolbar">
                {/* Search Bar */}
                <div className="reader-search-shell">
                    <div className="reader-search-input-wrap">
                        <LuSearch className="reader-search-icon" size={18} />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="ค้นหาจากชื่อบัญชี เนื้อหา หรือคำสำคัญ..."
                            className="reader-search-input"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput('')}
                                className="reader-search-clear"
                                aria-label="ล้างคำค้นหา"
                            >
                                <LuX size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Segmented Filters & Layout Wrapper */}
                <div className="reader-toolbar-actions">
                    <div className="reader-toolbar-count">
                        {data?.pages[0]?.total || 0} รายการ
                    </div>

                    <div className="reader-toolbar-actions-group">
                        <button
                            onClick={() => toggleSort('views')}
                            className={`btn-pill reader-sort-pill ${activeSort === 'views' ? 'active' : ''}`}
                            title={`ยอดวิว ≥ ${VIEW_THRESHOLD.toLocaleString()}`}
                        >
                            ยอดวิว
                        </button>
                        <button
                            onClick={() => toggleSort('engagement')}
                            className={`btn-pill reader-sort-pill ${activeSort === 'engagement' ? 'active' : ''}`}
                            title={`Engagement ≥ ${ENGAGEMENT_THRESHOLD.toLocaleString()}`}
                        >
                            เอ็นเกจเมนต์
                        </button>
                    </div>

                    <div className="relative layout-dropdown-container reader-layout-dropdown">
                        <button
                            onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                            className="reader-layout-button"
                            aria-label="เปลี่ยนรูปแบบการแสดงผล"
                        >
                            {layoutMode === 'grid' ? <LuLayoutDashboard className="rotate-90" /> : <LuLayoutDashboard className="scale-y-75" />}
                        </button>

                        <div className={`absolute right-0 top-full mt-2 w-48 bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 z-50 ${isLayoutDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                            <div className="p-1.5">
                                {LAYOUT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setLayoutMode(option.id);
                                            setIsLayoutDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors
                                            ${layoutMode === option.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className={option.id === 'grid' ? 'rotate-90' : 'scale-y-75'}>{option.icon}</span>
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className={`reader-feed-grid ${layoutMode === 'grid' ? 'is-grid' : 'is-list'}`}>
                {status === 'pending' ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="text-gray-500 text-xs font-black uppercase tracking-widest animate-pulse">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : status === 'error' ? (
                    <div className="col-span-full text-center py-20 text-red-400 font-bold uppercase tracking-widest">Error loading news</div>
                ) : (
                    <>
                        {(() => {
                            const seenTweetIds = new Set<string>();
                            return data?.pages.map((group, i) => (
                                <Fragment key={i}>
                                    {group.items.map(post => {
                                        if (post.tweet_id) {
                                            if (seenTweetIds.has(post.tweet_id)) return null;
                                            seenTweetIds.add(post.tweet_id);
                                        }
                                        return (
                                            <DashboardCard
                                                key={post.id}
                                                post={post}
                                                variant={layoutMode}
                                                categories={categories}
                                                onAddToCategory={handleAddNewsToCategory}
                                                onDelete={handleDeleteNews}
                                            />
                                        );
                                    })}
                                </Fragment>
                            ));
                        })()}
                    </>
                )}
            </div>

            {/* Infinite Scroll Loader */}
            <div ref={ref} className="py-20 flex flex-col items-center justify-center w-full gap-4">
                {(isFetchingNextPage || hasNextPage) ? (
                    <div className="w-8 h-8 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                ) : (
                    <div className="flex flex-col items-center gap-2 opacity-30 text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                        <span>สิ้นสุดรายการข่าว</span>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="app-workshop-dialog bg-[#111112] w-full max-w-sm rounded-4xl border border-white/5 p-8 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTrash className="text-3xl text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">ยืนยันการลบ?</h3>
                        <p className="text-gray-500 mb-8 font-bold text-sm leading-relaxed">ข้อมูลข่าวจะถูกลบออกถาวรและไม่สามารถกู้คืนได้</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 px-6 rounded-2xl text-gray-400 hover:bg-white/5 font-black text-xs uppercase tracking-widest transition-all">ยกเลิก</button>
                            <button onClick={confirmDelete} className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">ลบข่าว</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Main;
