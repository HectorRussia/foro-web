import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SkeletonCard from '../components/SkeletonCard';
import {
    HiOutlineTrash,
    HiOutlineClock,
    HiOutlineArrowUturnLeft
} from "react-icons/hi2";
import { RiLoader4Line } from "react-icons/ri";
import { LuSparkles, LuRefreshCw, LuFilter } from "react-icons/lu";
import { AnimatePresence, motion } from 'framer-motion';
import PostList from '../components/PostList';
import { type NewsItem, type NewsResult } from '../interface/news';
import { getNews, getTriggerStatus, updateTriggerStatus, searchAndAnalyzeBulk, fetchRssNews } from '../api/news';
import { getCategories } from '../api/category';
import { createCategoryNews } from '../api/categoryNews';
import { toast } from 'react-hot-toast';
import { type Category } from '../interface/category';
import { type PostListWithMembers } from '../components/PostList';
import HomeCanvas from '../components/Canvas/HomeCanvas';
import { getPresets, createPreset, deletePreset, type PresetSearch } from '../api/preset';



const getNewsTimestamp = (item: Pick<NewsResult, 'tweet_created_at' | 'published_at' | 'created_at'>) =>
    item.tweet_created_at || item.published_at || item.created_at;

const isRssNewsItem = (item: any) =>
    item?.source_type === 'rss' ||
    item?.item_type === 'rss' ||
    (!!item?.source_item_id && !item?.tweet_id) ||
    !!item?.feed_url;

const toNewsResult = (item: any): NewsResult => {
    const isRss = isRssNewsItem(item);
    const createdAt = item?.tweet_created_at || item?.published_at || item?.created_at || new Date().toISOString();

    return {
        id: item?.id ?? item?.tweet_id ?? item?.source_item_id ?? item?.url ?? crypto.randomUUID(),
        title: item?.title || item?.tweet_name || item?.name || (isRss ? 'RSS News' : 'Twitter News'),
        content: item?.llm_analysis || item?.content || item?.summary || item?.title || '',
        source: item?.tweet_name || item?.username || item?.source || item?.feed_title || item?.feed_url || (isRss ? 'RSS' : 'Twitter'),
        url: item?.url || '#',
        tweet_id: item?.tweet_id || undefined,
        tweet_profile_pic: item?.tweet_profile_pic || item?.profile_image_url_https || null,
        created_at: createdAt,
        tweet_created_at: item?.tweet_created_at || undefined,
        published_at: item?.published_at || undefined,
        source_type: item?.source_type || (isRss ? 'rss' : undefined),
        source_item_id: item?.source_item_id || undefined,
        feed_url: item?.feed_url || item?.source_url || undefined,
        retweet_count: Number(item?.retweet_count) || 0,
        reply_count: Number(item?.reply_count) || 0,
        like_count: Number(item?.like_count) || 0,
        quote_count: Number(item?.quote_count) || 0,
        view_count: Number(item?.view_count) || 0,
        media_urls: Array.isArray(item?.media_urls) ? item.media_urls : [],
        media_type: item?.media_type ?? null
    };
};

const getNewsResultKey = (item: NewsResult) =>
    String(item.tweet_id || item.source_item_id || item.url || item.id);

const mergeNewsResults = (current: NewsResult[], incoming: NewsResult[]) => {
    const merged = new Map<string, NewsResult>();

    current.forEach(item => merged.set(getNewsResultKey(item), item));
    incoming.forEach(item => {
        const key = getNewsResultKey(item);
        merged.set(key, { ...merged.get(key), ...item });
    });

    return Array.from(merged.values())
        .sort((a, b) => dayjs(getNewsTimestamp(b)).valueOf() - dayjs(getNewsTimestamp(a)).valueOf());
};

const fetchFeedSources = async (
    payload: any,
    signal: AbortSignal,
    selectedPostListId?: number,
    shouldFetchRss = true
) => {
    const requests = [
        searchAndAnalyzeBulk(payload, signal),
        ...(shouldFetchRss ? [fetchRssNews({
            ...(selectedPostListId ? { post_list_id: selectedPostListId } : {}),
            limit_per_feed: 20
        }, signal)] : [])
    ];

    const [bulkResult, rssResult] = await Promise.allSettled(requests);
    const errors: unknown[] = [];
    const items: any[] = [];
    let twitterCursor: string | undefined;
    let twitterHasNext = false;

    if (bulkResult.status === 'fulfilled') {
        const result = bulkResult.value;
        if (Array.isArray(result?.items)) items.push(...result.items);
        twitterCursor = result?.twitter_cursor;
        twitterHasNext = Boolean(result?.twitter_has_next && result?.twitter_cursor);
    } else {
        errors.push(bulkResult.reason);
        console.error('Bulk analysis failed:', bulkResult.reason);
    }

    if (rssResult?.status === 'fulfilled') {
        const rssItems = Array.isArray(rssResult.value?.items) ? rssResult.value.items : [];
        items.push(...rssItems.map((item: any) => ({ ...item, source_type: item.source_type || 'rss' })));
    } else if (rssResult?.status === 'rejected') {
        errors.push(rssResult.reason);
        console.error('RSS fetch failed:', rssResult.reason);
    }

    if (errors.length === requests.length) throw errors[0];

    return {
        items,
        twitter_cursor: twitterCursor,
        twitter_has_next: twitterHasNext
    };
};

const TodayNews = () => {

    const [isStreaming, setIsStreaming] = useState(false);
    const [layoutMode] = useState<'grid' | 'compact'>('grid');

    // Filter State
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    const [/* statusMessage */, setStatusMessage] = useState('ระบบพร้อมทำงาน');
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

    // Preset State
    const [foroPresets, setForoPresets] = useState<PresetSearch[]>([]);
    const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
    const [homePresets, setHomePresets] = useState<Set<number>>(() => {
        try {
            const stored = localStorage.getItem('foro_home_presets');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch { return new Set(); }
    });
    const [isLoadingPresets, setIsLoadingPresets] = useState(false);
    const [isSavingPreset, setIsSavingPreset] = useState(false);

    // Search Parameters
    const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [selectedPostList, setSelectedPostList] = useState<PostListWithMembers | null>(null);
    const [searchParams] = useState({

        query: "",
        query_type: "latest",
        since_date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        until_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        cursor: ""
    });

    const [searchTerm, /* setSearchTerm */] = useState('');

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
                const dbResults: NewsResult[] = newsResponse.items
                    .map(toNewsResult)
                    .sort((a, b) => dayjs(getNewsTimestamp(b)).valueOf() - dayjs(getNewsTimestamp(a)).valueOf());
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

    // Handle click outside to close AI filter dropdown is now handled by the backdrop in the modal itself 
    // to avoid conflicts with the new portal-like structure.


    // Start Bulk Analysis
    const startBulkAnalysis = async (cursorOverride?: string) => {
        if (isStreaming) return;
        setIsStreaming(true);
        setStatusMessage('กำลังเชื่อมต่อและวิเคราะห์ข่าว...');

        // If not loading more, clear previous results and cache
        if (!cursorOverride || typeof cursorOverride !== 'string') {
            setNewsResults([]);
            setNextCursor(null);
            localStorage.removeItem('today_news_twitter_cursor');
            localStorage.removeItem('today_news_is_cleared'); // Reset clear flag on new start
            setHasStarted(true);
        }

        setProgress({ current: 0, total: 0 }); // Hide progress bar for bulk call
        abortControllerRef.current = new AbortController();

        const payload: any = {
            query_type: searchParams.query_type,
            since_date: searchParams.since_date,
            until_date: searchParams.until_date,
            cursor: (typeof cursorOverride === 'string') ? cursorOverride : searchParams.cursor
        };

        if (searchParams.query) {
            payload.query = searchParams.query;
        }

        if (selectedPostList) {
            payload.post_list_id = selectedPostList.id;
        } else {
            payload.use_followed_users = true;
        }





        try {
            const result = await fetchFeedSources(
                payload,
                abortControllerRef.current.signal,
                selectedPostList?.id,
                !(typeof cursorOverride === 'string' && cursorOverride)
            );


            if (result && result.items) {
                const mappedResults: NewsResult[] = result.items.map(toNewsResult);

                setNewsResults(prev => mergeNewsResults(prev, mappedResults));

                if (result.twitter_cursor) {
                    localStorage.setItem('today_news_twitter_cursor', result.twitter_cursor);
                    setNextCursor(result.twitter_cursor);
                } else if (!result.twitter_has_next) {
                    localStorage.removeItem('today_news_twitter_cursor');
                    setNextCursor(null);
                }

                setStatusMessage('วิเคราะห์เสร็จสิ้น');
            } else {
                setStatusMessage('ไม่พบข้อมูลข่าวใหม่');
            }
        } catch (error: any) {
            console.error('Bulk analysis failed:', error);
            setStatusMessage(`เกิดข้อผิดพลาด: ${error.message || 'Unknown error'}`);
            toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลข่าว');
        } finally {
            setIsStreaming(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    const stopStream = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setIsStreaming(false);
        setStatusMessage('หยุดการประมวลผลแล้ว');
    };

    const loadForoPresets = async () => {
        setIsLoadingPresets(true);
        try {
            const presets = await getPresets('forofilter');
            setForoPresets(presets);
        } catch (error) {
            console.error('Failed to load presets:', error);
        } finally {
            setIsLoadingPresets(false);
        }
    };

    const handleSelectPreset = (preset: PresetSearch) => {
        setSelectedPresetId(preset.id);
        setAiPrompt(preset.name);
    };

    const handleSavePreset = async () => {
        if (!aiPrompt.trim()) {
            toast.error('กรุณาพิมพ์ prompt ก่อนบันทึก');
            return;
        }
        setIsSavingPreset(true);
        try {
            const newPreset = await createPreset(aiPrompt.trim(), 'forofilter');
            setForoPresets(prev => [newPreset, ...prev]);
            setSelectedPresetId(newPreset.id);
            toast.success('บันทึก preset สำเร็จ');
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || 'บันทึก preset ไม่สำเร็จ');
        } finally {
            setIsSavingPreset(false);
        }
    };

    const handleDeletePreset = async () => {
        if (!selectedPresetId) return;
        try {
            await deletePreset(selectedPresetId);
            setForoPresets(prev => prev.filter(p => p.id !== selectedPresetId));
            setHomePresets(prev => {
                const next = new Set(prev);
                next.delete(selectedPresetId);
                localStorage.setItem('foro_home_presets', JSON.stringify([...next]));
                return next;
            });
            setSelectedPresetId(null);
            setAiPrompt('');
            toast.success('ลบ preset สำเร็จ');
        } catch (error) {
            console.error('Failed to delete preset:', error);
            toast.error('ลบ preset ไม่สำเร็จ');
        }
    };

    const toggleHomePreset = (id: number) => {
        setHomePresets(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else if (next.size >= 3) {
                toast.error('เลือกโชว์บน Home ได้สูงสุด 3 preset');
                return prev;
            } else {
                next.add(id);
            }
            localStorage.setItem('foro_home_presets', JSON.stringify([...next]));
            return next;
        });
    };

    const openForoFilter = () => {
        setIsAIFilterOpen(true);
        loadForoPresets();
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

    const handleAIFilter = async (promptOverride?: string) => {
        const prompt = promptOverride ?? aiPrompt;
        if (!prompt.trim()) {
            toast.error('กรุณาพิมพ์ข้อมูลที่ต้องการให้ AI วิเคราะห์');
            return;
        }

        setIsAIProcessing(true);

        // Structure to send to backend exactly as requested
        const payload = {
            prompt: prompt,
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
            // refactor to use api/news.ts pattern axios
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
        tweet_profile_pic: res.tweet_profile_pic || null,
        created_at: res.created_at,
        tweet_id: res.tweet_id || undefined,
        tweet_created_at: res.tweet_created_at,
        published_at: res.published_at,
        source_type: res.source_type,
        source_item_id: res.source_item_id,
        feed_url: res.feed_url,
        source: res.source,
        retweet_count: res.retweet_count,
        reply_count: res.reply_count,
        like_count: res.like_count,
        quote_count: res.quote_count,
        view_count: res.view_count,
        media_urls: res.media_urls,
        media_type: res.media_type
    });

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    const getFilteredNews = () => {
        let filtered = [...newsResults];

        // Search filter
        if (searchTerm) {
            const lowTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                (item.title?.toLowerCase().includes(lowTerm)) ||
                (item.content?.toLowerCase().includes(lowTerm)) ||
                (item.source?.toLowerCase().includes(lowTerm))
            );
        }

        // 1. Filter by Post List if selected
        if (selectedPostList && selectedPostList.members) {
            const memberAccounts = new Set(selectedPostList.members.map(m => {
                const handle = m.follow_user_x_account || "";
                return handle.startsWith('@') ? handle.slice(1).toLowerCase() : handle.toLowerCase();
            }).filter(Boolean));
            const memberSources = new Set(selectedPostList.members
                .map(m => m.follow_user_source_url || '')
                .filter(Boolean)
                .map(source => source.toLowerCase()));
            const hasRssMembers = selectedPostList.members.some(m =>
                m.follow_user_follow_type === 'rss' || Boolean(m.follow_user_source_url)
            );

            filtered = filtered.filter(item => {
                if (item.source_type === 'rss') {
                    const rssSource = (item.feed_url || item.source_item_id || item.url || '').toLowerCase();
                    if (!rssSource) return hasRssMembers;
                    return memberSources.size > 0
                        ? [...memberSources].some(source => rssSource.includes(source) || source.includes(rssSource))
                        : hasRssMembers;
                }

                // Try to extract handle from URL: https://x.com/BBCBreaking/status/123 -> BBCBreaking
                const urlMatch = item.url?.toLowerCase().match(/x\.com\/([^/]+)/);
                const handleFromUrl = urlMatch ? urlMatch[1] : null;

                // Also check source if it looks like a handle
                const sourceHandle = item.source?.startsWith('@') ? item.source.slice(1).toLowerCase() : item.source?.toLowerCase();

                return (handleFromUrl && memberAccounts.has(handleFromUrl)) ||
                    (sourceHandle && memberAccounts.has(sourceHandle));
            });
        }

        const sorted = filtered.sort((a, b) => {

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
            return dayjs(getNewsTimestamp(b)).valueOf() - dayjs(getNewsTimestamp(a)).valueOf();
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
        <div className="foro-page-shell">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_30%)]" />
                    {/* Header Section */}
                    <header className="relative shrink-0 mb-6 px-6 pt-6 sm:px-8 sm:pt-8">
                        <div className="flex flex-col mb-8">
                            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                                หน้าหลัก
                            </h1>
                            <span className="text-gray-500 text-[10px] sm:text-[11px] font-black tracking-widest uppercase mb-1 opacity-70">
                                WATCHLIST FEED
                            </span>
                        </div>

                        {/* Search & Actions Bar */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between gap-4 bg-[#0c0c0d] border border-white/6 p-2 pl-4 pr-3.5 rounded-3xl min-h-17 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">

                                {/* Left Section: Trash or Back or Empty */}
                                <div className="flex items-center gap-3">
                                    {!hasStarted && isRestorable ? (
                                        <button
                                            onClick={handleRestore}
                                            className="p-3 bg-[#1a1a1c] text-gray-500 hover:text-white border border-white/5 transition-all rounded-2xl"
                                            title="ย้อนกลับ"
                                        >
                                            <HiOutlineArrowUturnLeft className="text-lg" />
                                        </button>
                                    ) : hasStarted && displayNews.length > 0 ? (
                                        <button
                                            onClick={handleClear}
                                            className="p-3 bg-[#1a1a1c] text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 border border-white/5 transition-all rounded-2xl"
                                            title="ล้างข้อมูลทั้งหมด"
                                        >
                                            <HiOutlineTrash className="text-lg" />
                                        </button>
                                    ) : (
                                        <div className="w-10" /> // Placeholder
                                    )}
                                </div>

                                {/* Right Section: Search/AI/Sync */}
                                <div className="flex items-center gap-2.5">
                                    {/* FORO Filter Button */}
                                    <div className="relative" ref={aiFilterRef}>
                                        <button
                                            onClick={openForoFilter}
                                            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full font-bold border transition-all text-xs
                                                ${isAIFilterOpen
                                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-[0_0_0_1px_rgba(59,130,246,0.08)]'
                                                    : 'bg-[#121214] border-white/6 text-gray-200 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <LuFilter className={`text-[15px] ${isAIFilterOpen ? 'text-blue-400' : 'text-blue-400'}`} />
                                            <span>FORO Filter</span>
                                        </button>
                                    </div>

                                    {/* Sync Button */}
                                    {!isStreaming ? (
                                        <button
                                            onClick={() => startBulkAnalysis()}
                                            disabled={isStreaming}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shadow-xl active:scale-95 bg-linear-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-400 shadow-blue-600/30 text-xs"
                                        >
                                            <LuRefreshCw className={`text-[15px] ${isStreaming ? 'animate-spin' : ''}`} />
                                            <span>ฟีดข้อมูล</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopStream}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-xs"
                                        >
                                            <RiLoader4Line className="text-[15px] animate-spin" />
                                            <span>กำลังฟีด...</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Indicator (Optional) - Hidden for now to match clean bar design */}
                            {/* <div className="flex items-center justify-start gap-2 pl-2 mt-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${statusMessage.includes('วิเคราะห์') || statusMessage.includes('ประมวลผล') ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${statusMessage.includes('วิเคราะห์') || statusMessage.includes('ประมวลผล') ? 'text-emerald-400/80' : 'text-blue-400/80'}`}>
                                    {statusMessage}
                                </span>
                            </div> */}

                            {/* Home Preset Quick Chips */}
                            {foroPresets.filter(p => homePresets.has(p.id)).length > 0 && (
                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                    {foroPresets.filter(p => homePresets.has(p.id)).map(preset => {
                                        const isActive = aiFilteredIds !== null && selectedPresetId === preset.id;
                                        return (
                                            <button
                                                key={preset.id}
                                                onClick={() => {
                                                    setAiPrompt(preset.name);
                                                    setSelectedPresetId(preset.id);
                                                    handleAIFilter(preset.name);
                                                }}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all
                                                    ${isActive
                                                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                                                        : 'bg-white/4 text-gray-400 border-white/8 hover:bg-white/8 hover:text-white hover:border-white/15'}`}
                                            >
                                                <LuSparkles className="text-[10px] text-blue-400" />
                                                <span>{preset.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </header>

                    {/* FORO Filter Modal */}
                    <AnimatePresence>
                        {isAIFilterOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsAIFilterOpen(false)}
                                    className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md"
                                />

                                {/* Modal Container */}
                                <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none sm:p-6">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.94, y: 18 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.94, y: 18 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="pointer-events-auto relative w-full max-w-140 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-4xl border border-white/8 border-t-2 border-t-blue-500/80 bg-[#121214]/95 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.82)] backdrop-blur-2xl sm:p-6"
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_42%)]" />
                                        <div className="relative space-y-4 sm:space-y-5">
                                            {/* Header */}
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500/35 bg-[#12203b] text-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.18)]">
                                                    <LuFilter className="text-[18px]" />
                                                </div>
                                                <div className="min-w-0 pt-0.5">
                                                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-400/70">ANALYSIS MODE</p>
                                                    <h2 className="mt-1 text-[24px] font-black leading-none tracking-tight text-white sm:text-[28px]">FORO Filter</h2>
                                                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">บอก FORO ว่าอยากให้ช่วยมองประเด็นนี้แบบไหน</p>
                                                </div>
                                            </div>

                                            {/* Quick Mode Select */}
                                            <section className="rounded-3xl border border-white/8 bg-white/3 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] sm:p-5">
                                                <div className="mb-4">
                                                    <p className="text-[15px] font-black tracking-tight text-white">เลือกโหมดเร็ว</p>
                                                    <p className="mt-1 text-sm leading-relaxed text-slate-400">แตะเพื่อใช้ prompt ทันที แล้วเลือกตรง ๆ ได้เลยว่าอันไหนจะโชว์บนหน้า Home</p>
                                                </div>

                                                {isLoadingPresets ? (
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        {[1, 2, 3, 4].map(i => (
                                                            <div key={i} className="h-28 rounded-[20px] border border-white/8 bg-white/5 animate-pulse" />
                                                        ))}
                                                    </div>
                                                ) : foroPresets.length === 0 ? (
                                                    <div className="rounded-[20px] border border-dashed border-white/10 bg-white/2 px-4 py-6 text-center">
                                                        <p className="text-[13px] font-bold text-gray-500">ยังไม่มี preset</p>
                                                        <p className="mt-1 text-[11px] text-gray-600">พิมพ์ prompt แล้วกด "บันทึก preset"</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                            {foroPresets.map(preset => {
                                                                const isActive = selectedPresetId === preset.id;
                                                                const isHomePreset = homePresets.has(preset.id);

                                                                return (
                                                                    <div
                                                                        key={preset.id}
                                                                        role="button"
                                                                        tabIndex={0}
                                                                        onClick={() => handleSelectPreset(preset)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                                e.preventDefault();
                                                                                handleSelectPreset(preset);
                                                                            }
                                                                        }}
                                                                        className={`flex min-h-31.5 cursor-pointer flex-col rounded-[20px] border p-4 text-left transition-all outline-none
                                                                            ${isActive
                                                                                ? 'border-blue-500/40 bg-blue-500/10 shadow-[0_0_0_1px_rgba(37,99,235,0.08)_inset]'
                                                                                : 'border-white/8 bg-white/3 hover:border-white/12 hover:bg-white/5'}`}
                                                                    >
                                                                        <span className="block text-[15px] font-bold leading-snug text-white line-clamp-2">
                                                                            {preset.name}
                                                                        </span>

                                                                        <div className="mt-auto pt-4">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    toggleHomePreset(preset.id);
                                                                                }}
                                                                                disabled={!isHomePreset && homePresets.size >= 3}
                                                                                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black transition-all
                                                                                    ${isHomePreset
                                                                                        ? 'border-blue-500/40 bg-blue-500/15 text-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.12)_inset]'
                                                                                        : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/15 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/2 disabled:text-slate-600'}`}
                                                                            >
                                                                                {isHomePreset ? 'ซ่อนจาก Home' : 'โชว์บน Home'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        <p className="mt-3 text-[11px] text-slate-500">เลือกให้โชว์บนหน้า Home ได้สูงสุด 3 อัน</p>
                                                    </>
                                                )}

                                                {/* Delete preset */}
                                                {selectedPresetId && (
                                                    <button
                                                        onClick={handleDeletePreset}
                                                        className="mt-3 flex items-center gap-1.5 rounded-full border border-rose-500/10 bg-rose-500/5 px-3 py-1.5 text-[10px] font-black text-rose-400/70 transition-all hover:border-rose-500/30 hover:text-rose-400"
                                                    >
                                                        <span className="text-sm leading-none">×</span>
                                                        <span>ลบ preset นี้</span>
                                                    </button>
                                                )}
                                            </section>

                                            {/* Prompt Section */}
                                            <section className="rounded-3xl border border-white/8 bg-white/3 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] sm:p-5">
                                                <div className="mb-3">
                                                    <p className="text-[15px] font-black tracking-tight text-white">Prompt</p>
                                                    <p className="mt-1 text-sm leading-relaxed text-slate-400">จะให้สรุป จับมุม จัดอันดับ หรือหัก angle จากข่าวที่คัดมาก็ได้</p>
                                                </div>

                                                <textarea
                                                    value={aiPrompt}
                                                    onChange={(e) => { setAiPrompt(e.target.value); setSelectedPresetId(null); }}
                                                    placeholder="เช่น สรุปข่าวที่น่าเอาไปเล่าต่อ หรือหาโพสต์ไหนน่าทำคอนเทนต์"
                                                    rows={4}
                                                    className="min-h-33 w-full resize-none rounded-[20px] border border-blue-500/15 bg-[#0b111d] px-4 py-4 text-[14px] leading-6 text-white placeholder:text-slate-600 focus:border-blue-500/35 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                />

                                                <div className="mt-3 flex items-center justify-between gap-3">
                                                    <p className="text-xs leading-relaxed text-slate-500">บันทึก preset แล้วค่อยกดปุ่ม "โชว์บน Home" ที่การ์ดนั้นได้เลย</p>
                                                    <button
                                                        onClick={handleSavePreset}
                                                        disabled={isSavingPreset || !aiPrompt.trim()}
                                                        className="shrink-0 text-xs font-semibold text-blue-400/80 transition-all hover:text-blue-300 disabled:cursor-not-allowed disabled:text-slate-600"
                                                    >
                                                        {isSavingPreset ? 'กำลังบันทึก...' : '+ บันทึก preset'}
                                                    </button>
                                                </div>
                                            </section>

                                            {/* Actions */}
                                            <div className="flex gap-3 pt-1">
                                                <button
                                                    onClick={() => setIsAIFilterOpen(false)}
                                                    className="flex-1 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-[14px] font-bold text-slate-300 transition-all hover:bg-white/7 hover:text-white"
                                                >
                                                    ยกเลิก
                                                </button>
                                                <button
                                                    onClick={() => handleAIFilter()}
                                                    disabled={isAIProcessing || newsResults.length === 0 || !aiPrompt.trim()}
                                                    className={`flex-1 rounded-2xl px-4 py-3 text-[14px] font-bold text-white transition-all shadow-[0_18px_40px_rgba(37,99,235,0.35)]
                                                        ${isAIProcessing || newsResults.length === 0 || !aiPrompt.trim()
                                                            ? 'cursor-not-allowed bg-slate-800 text-slate-500 shadow-none'
                                                            : 'bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-[0.99]'}`}
                                                >
                                                    {isAIProcessing ? 'กำลังวิเคราะห์...' : 'กรองฟีด'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>

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
                                <div className="absolute inset-0 backdrop-blur-3xl" />
                                <div className="relative p-4 md:p-6 border border-blue-500/20 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-blue-500/5">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-5 text-center sm:text-left">
                                        <div className="shrink-0 p-2.5 md:p-3.5 bg-blue-500/20 rounded-xl md:rounded-[1.25rem] shadow-inner">
                                            <LuSparkles className="text-blue-400 text-xl md:text-2xl animate-pulse" />
                                        </div>
                                        <div className="flex-1 space-y-2 w-full">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                                <h3 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400 tracking-tight">
                                                    บทสรุปจาก AI
                                                </h3>
                                                <span className="px-3 py-1 rounded-full border border-blue-500/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400/70">
                                                    AI Insight Summary
                                                </span>
                                            </div>
                                            <p className="text-gray-200 leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
                                                {aiSummary}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-24 -right-24 w-48 h-48 blur-[100px] rounded-full hidden sm:block" />
                                </div>
                            </motion.div>
                        </div>
                    )}

                    <div className="relative flex-1 overflow-y-auto px-6 pr-4 pb-8 sm:px-8 scrollbar-hide">
                        {/* News Stream Grid */}
                        <div className={`
                        ${layoutMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-20'
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
                                <div className="col-span-full py-64 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <HomeCanvas />

                                    {/* Radial Glow Effect in the Center */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.98, 1.02, 0.98] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-112.5 pointer-events-none rounded-[100%]"
                                        style={{
                                            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.12) 40%, transparent 60%)',
                                            filter: 'blur(80px)'
                                        }}
                                    />

                                    <motion.div
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10"
                                    >
                                        <h3 className="text-[28px] md:text-[38px] font-black text-transparent bg-clip-text bg-linear-to-b from-white via-white/90 to-white/30 tracking-tight uppercase">
                                            FORO ติดตามทุกเรื่องที่คุณสนใจ
                                        </h3>
                                    </motion.div>
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
                                <>
                                    {/* Content Header (Only when data present) */}
                                    <div className="col-span-full flex items-center justify-between mb-2 px-1">
                                        <h3 className="text-[13px] font-black text-white uppercase tracking-widest">
                                            โพสต์ล่าสุด
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => toggleFilter('mostView')}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all border
                                                    ${activeFilters.includes('mostView')
                                                        ? 'bg-white text-black border-white'
                                                        : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'}`}
                                            >
                                                ยอดวิว
                                            </button>
                                            <button
                                                onClick={() => toggleFilter('mostLiked')}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all border
                                                    ${activeFilters.includes('mostLiked')
                                                        ? 'bg-white text-black border-white'
                                                        : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'}`}
                                            >
                                                เอนเกจเมนต์
                                            </button>
                                        </div>
                                    </div>

                                    {displayNews.map((res) => (
                                        <div key={res.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <DashboardCard
                                                post={mapToNewsItem(res)}
                                                variant={layoutMode}
                                                categories={categories}
                                                onAddToCategory={handleAddNewsToCategory}
                                                onDelete={handleDeleteIndividual}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}


                        </div>

                        {!isStreaming && nextCursor && !aiFilteredIds && (
                            <div className="flex justify-center mt-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <button
                                    onClick={() => startBulkAnalysis(nextCursor)}

                                    className="group relative flex items-center justify-center gap-4 px-12 py-5 rounded-4xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 w-full md:w-100 overflow-hidden shadow-2xl shadow-amber-500/5 active:scale-95"
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
                            <div className="flex flex-col min-w-25">
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
                </section>
                <aside className="foro-right-rail">
                    <PostList
                        activeId={selectedPostList?.id}
                        onSelect={(list) => setSelectedPostList(list)}
                    />
                </aside>
            </div>
        </div>
    );
};

export default TodayNews;
