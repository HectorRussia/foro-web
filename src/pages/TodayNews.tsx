import { useState, useRef, useEffect, type CSSProperties } from 'react';
import dayjs from 'dayjs';
import Sidebar from '../components/Layouts/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SkeletonCard from '../components/SkeletonCard';
import {
    HiOutlineArrowUturnLeft
} from "react-icons/hi2";
import { LuEraser, LuSparkles, LuRefreshCw, LuFilter } from "react-icons/lu";
import { AnimatePresence, motion } from 'framer-motion';
import PostList from '../components/PostList';
import { type AdvancedSearchBulkPayload, type NewsItem, type NewsResult } from '../interface/news';
import { getNews, getTriggerStatus, updateTriggerStatus, searchAndAnalyzeBulk } from '../api/news';
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
    const source = item?.tweet_name || item?.username || item?.source || item?.feed_title || item?.name ||
        (isRss ? item?.feed_url || item?.source_url || item?.url || '' : 'Twitter');

    return {
        id: item?.id ?? item?.tweet_id ?? item?.source_item_id ?? item?.url ?? crypto.randomUUID(),
        title: item?.title || item?.tweet_name || item?.name || (isRss ? 'RSS News' : 'Twitter News'),
        content: item?.llm_analysis || item?.content || item?.summary || item?.title || '',
        source,
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
        media_type: item?.media_type ?? null,
        analyzed_with_ai: item?.analyzed_with_ai ?? null
    };
};

const getNewsResultKey = (item: NewsResult) =>
    String(item.tweet_id || item.source_item_id || item.url || item.id);

const NEWS_PAGE_LIMIT = 40;
const LOAD_MORE_SKELETON_COUNT = 5;
const DB_HYDRATE_RETRY_DELAYS_MS = [0, 350, 700, 1200];

type FeedNotice = {
    variant: 'loading' | 'success' | 'error';
    message: string;
};

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

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
    payload: AdvancedSearchBulkPayload,
    signal: AbortSignal
) => {
    const result = await searchAndAnalyzeBulk(payload, signal);

    return {
        items: Array.isArray(result?.items) ? result.items : [],
        twitter_cursor: result?.twitter_cursor,
        twitter_has_next: Boolean(result?.twitter_has_next && result?.twitter_cursor)
    };
};

const loadLatestNewsResults = async (options: { retryUntilFound?: boolean } = {}) => {
    const delays = options.retryUntilFound ? DB_HYDRATE_RETRY_DELAYS_MS : [0];
    let latestResults: NewsResult[] = [];

    for (const delayMs of delays) {
        if (delayMs > 0) {
            await wait(delayMs);
        }

        const newsResponse = await getNews(1, NEWS_PAGE_LIMIT, 1);
        latestResults = Array.isArray(newsResponse.items)
            ? newsResponse.items
                .map(toNewsResult)
                .sort((a, b) => dayjs(getNewsTimestamp(b)).valueOf() - dayjs(getNewsTimestamp(a)).valueOf())
            : [];

        if (!options.retryUntilFound || latestResults.length > 0) {
            break;
        }
    }

    return latestResults;
};

const TodayNews = () => {

    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [layoutMode] = useState<'grid' | 'compact'>('grid');

    // Filter State
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    const [/* statusMessage */, setStatusMessage] = useState('ระบบพร้อมทำงาน');
    const [feedNotice, setFeedNotice] = useState<FeedNotice | null>(null);
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
            const dbResults = await loadLatestNewsResults();
            const hasNews = dbResults.length > 0;

            // 4. Decision: Show news IF (Run is Active) OR (User hasn't explicitly clicked Clear)
            if (hasNews && (triggerData.trigger === 1 || !isCleared)) {
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

    useEffect(() => {
        if (!feedNotice || feedNotice.variant === 'loading') return;
        const timer = window.setTimeout(() => setFeedNotice(null), 4200);
        return () => window.clearTimeout(timer);
    }, [feedNotice]);

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
    const startBulkAnalysis = async (
        cursorOverride?: string,
        options: { preserveExisting?: boolean } = {}
    ) => {
        if (isStreaming) return;
        const isLoadingMoreRequest = Boolean(
            (typeof cursorOverride === 'string' && cursorOverride) ||
            options.preserveExisting
        );

        setIsStreaming(true);
        setIsLoadingMore(isLoadingMoreRequest);
        setStatusMessage('กำลังเชื่อมต่อและวิเคราะห์ข่าว...');
        setFeedNotice({
            variant: 'loading',
            message: 'กำลังเชื่อมต่อฐานข้อมูล... ดึงฟีดข่าวล่าสุด',
        });
        if (isLoadingMoreRequest) {
            setFeedNotice(null);
        }

        // If not loading more, clear previous results and cache
        if ((!cursorOverride || typeof cursorOverride !== 'string') && !options.preserveExisting) {
            setNewsResults([]);
            setNextCursor(null);
            localStorage.removeItem('today_news_twitter_cursor');
            localStorage.removeItem('today_news_is_cleared'); // Reset clear flag on new start
            setHasStarted(true);
        } else {
            setHasStarted(true);
        }

        setProgress({ current: 0, total: 0 }); // Hide progress bar for bulk call
        abortControllerRef.current = new AbortController();

        const payload: AdvancedSearchBulkPayload = {
            query_type: searchParams.query_type,
            since_date: searchParams.since_date,
            until_date: searchParams.until_date,
            cursor: (typeof cursorOverride === 'string') ? cursorOverride : searchParams.cursor,
            fetch_rss_first: !(typeof cursorOverride === 'string' && cursorOverride),
            rss_limit_per_feed: 20,
            analyze_rss_with_ai: true
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
                abortControllerRef.current.signal
            );


            const hasResponseItems = Array.isArray(result?.items) && result.items.length > 0;

            if (hasResponseItems) {
                const mappedResults: NewsResult[] = result.items.map(toNewsResult);

                setNewsResults(prev => mergeNewsResults(prev, mappedResults));

                setStatusMessage('วิเคราะห์เสร็จสิ้น');
            } else {
                setStatusMessage('ไม่พบข้อมูลข่าวใหม่');
            }
            if (result?.twitter_cursor) {
                localStorage.setItem('today_news_twitter_cursor', result.twitter_cursor);
                setNextCursor(result.twitter_cursor);
            } else if (!result?.twitter_has_next) {
                // Backend can return X items without a unified cursor after grouped retry.
                localStorage.removeItem('today_news_twitter_cursor');
                setNextCursor(null);
            }

            const dbResults = await loadLatestNewsResults({
                retryUntilFound: !hasResponseItems,
            });

            if (dbResults.length > 0) {
                setNewsResults(prev => mergeNewsResults(prev, dbResults));
                setHasStarted(true);
                setStatusMessage('\u0e27\u0e34\u0e40\u0e04\u0e23\u0e32\u0e30\u0e2b\u0e4c\u0e40\u0e2a\u0e23\u0e47\u0e08\u0e2a\u0e34\u0e49\u0e19');
            }

            const syncedCount = dbResults.length || result.items.length;
            const rssCount = dbResults.filter(item => item.source_type === 'rss').length;
            const rssText = rssCount > 0 ? `${rssCount} ข่าวจาก RSS + ` : '';
            const moreText = result.twitter_cursor ? ' • มี cursor สำหรับโหลด X ต่อ' : ' • ค้นหา RSS + X แล้ว';
            setFeedNotice({
                variant: 'success',
                message: `อัปเดตข้อมูลเรียบร้อย • ${rssText}${syncedCount} การ์ด${moreText}`,
            });
            if (isLoadingMoreRequest) {
                setFeedNotice(null);
            }
        } catch (error: any) {
            if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
                setStatusMessage('หยุดการประมวลผลแล้ว');
                setFeedNotice(null);
                return;
            }

            console.error('Bulk analysis failed:', error);
            setStatusMessage(`เกิดข้อผิดพลาด: ${error.message || 'Unknown error'}`);
            setFeedNotice({
                variant: 'error',
                message: 'อัปเดตข้อมูลไม่สำเร็จ ลองฟีดข้อมูลอีกครั้ง',
            });
            if (isLoadingMoreRequest) {
                setFeedNotice(null);
            }
            toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลข่าว');
        } finally {
            setIsStreaming(false);
            setIsLoadingMore(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    const stopStream = () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setIsStreaming(false);
        setIsLoadingMore(false);
        setStatusMessage('หยุดการประมวลผลแล้ว');
        setFeedNotice(null);
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
        media_type: res.media_type,
        analyzed_with_ai: res.analyzed_with_ai
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
                (m.follow_user_type || m.follow_user_follow_type) === 'rss' || Boolean(m.follow_user_source_url)
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
    const canSearchMore = !isStreaming && hasStarted && displayNews.length > 0 && !aiFilteredIds;
    const selectedHomeQuickPresets = homePresets.size > 0
        ? foroPresets.filter(preset => homePresets.has(preset.id))
        : foroPresets.slice(0, 3);
    const homeQuickPresets = selectedHomeQuickPresets
        .map(preset => ({
            key: `preset-${preset.id}`,
            label: preset.name,
            presetId: preset.id,
        }));
    const visibleHomeQuickPresets = homeQuickPresets.slice(0, 3);
    const activeListStyle = {
        '--active-list-accent': selectedPostList?.color_list || '#2997ff',
    } as CSSProperties;
    const activeListName = selectedPostList?.name || '\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14';
    const feedToolbar = (
        <div className="col-span-full feed-section-header root-feed-section-header home-feed-toolbar">
            <div className="feed-section-title-row">
                <h3 className="section-title">
                    โพสต์ล่าสุด
                </h3>
                <span className="home-feed-count-badge">{`${displayNews.length} \u0e01\u0e32\u0e23\u0e4c\u0e14`}</span>
            </div>
            <div className="feed-section-filters">
                {hasStarted && displayNews.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="icon-btn-large header-secondary-action root-feed-maintenance-action"
                        title={'\u0e25\u0e49\u0e32\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14'}
                    >
                        <LuEraser className="text-[15px]" />
                    </button>
                )}
                <button
                    onClick={() => toggleFilter('mostView')}
                    className={`btn-pill root-sort-pill ${activeFilters.includes('mostView') ? 'active' : ''}`.trim()}
                >
                    ยอดวิว
                </button>
                <button
                    onClick={() => toggleFilter('mostLiked')}
                    className={`btn-pill root-sort-pill ${activeFilters.includes('mostLiked') ? 'active' : ''}`.trim()}
                >
                    เอนเกจเมนต์
                </button>
            </div>
        </div>
    );

    return (
        <div className="foro-page-shell">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_30%)]" />
                    <AnimatePresence>
                        {feedNotice && (
                            <motion.div
                                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className={`home-feed-status-toast is-${feedNotice.variant}`}
                            >
                                <span className="home-feed-status-icon" aria-hidden="true">
                                    <LuRefreshCw className={feedNotice.variant === 'loading' ? 'animate-spin' : ''} />
                                </span>
                                <span className="home-feed-status-copy">
                                    <span className="home-feed-status-kicker">FORO</span>
                                    <span className="home-feed-status-message">{feedNotice.message}</span>
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Header Section */}
                    <header className="root-home-header relative shrink-0 mb-5 px-6 pt-5 sm:px-8 sm:pt-6 lg:px-11">
                        <div className="root-home-title-stack flex flex-col mb-2">
                            <h1 className="root-home-title text-[40px] sm:text-[42px] font-black text-white tracking-tight leading-[1.05] mb-1">
                                หน้าหลัก
                            </h1>
                            <span className="root-home-subtitle text-gray-500 text-[10px] sm:text-[11px] font-black tracking-widest uppercase mb-1 opacity-70">
                                WATCHLIST FEED
                            </span>
                        </div>

                        {/* Search & Actions Bar */}
                        <div className="relative z-10">
                            <div className="home-control-panel root-home-control-panel">

                                {/* Left Section: Trash or Back or Empty */}
                                <div
                                    className={`home-selected-list-bar ${selectedPostList ? 'is-active-list home-active-list-accent' : ''}`.trim()}
                                    style={activeListStyle}
                                >
                                    <div className="home-selected-list-bar-copy">
                                        <span className="home-selected-list-bar-text">{activeListName}</span>
                                    </div>
                                    {!hasStarted && isRestorable ? (
                                        <button
                                            onClick={handleRestore}
                                            className="icon-btn-large header-secondary-action root-home-maintenance-action"
                                            title="ย้อนกลับ"
                                        >
                                            <HiOutlineArrowUturnLeft className="text-lg" />
                                        </button>
                                    ) : null}
                                </div>

                                {/* Right Section: Search/AI/Sync */}
                                <div className="home-ai-filter-cluster root-home-ai-filter-cluster">
                                    <div className="home-ai-quick-presets">
                                        {visibleHomeQuickPresets.map(preset => {
                                            const isActive = aiFilteredIds !== null && selectedPresetId === preset.presetId;
                                            const isDisabled = newsResults.length === 0 || isAIProcessing;

                                            return (
                                                <button
                                                    key={preset.key}
                                                    onClick={() => {
                                                        if (isDisabled) return;
                                                        setAiPrompt(preset.label);
                                                        setSelectedPresetId(preset.presetId);
                                                        handleAIFilter(preset.label);
                                                    }}
                                                    disabled={isDisabled}
                                                    className={`home-ai-quick-preset-btn ${isActive ? 'is-active' : ''}`.trim()}
                                                >
                                                    {preset.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* FORO Filter Button */}
                                    <div className="relative" ref={aiFilterRef}>
                                        <button
                                            onClick={openForoFilter}
                                            className={`btn-pill home-ai-filter-btn root-home-filter-btn ${isAIFilterOpen ? 'active' : ''}`.trim()}
                                        >
                                            <span className={`home-ai-filter-btn-signal ${isAIFilterOpen ? 'is-visible is-active' : ''}`.trim()} aria-hidden="true" />
                                            <span className="home-ai-filter-btn-label">FORO Filter</span>
                                        </button>
                                    </div>

                                    {/* Sync Button */}
                                    {!isStreaming ? (
                                        <button
                                            onClick={() => startBulkAnalysis()}
                                            disabled={isStreaming}
                                            className="btn-pill primary root-home-sync-btn"
                                        >
                                            <LuRefreshCw className={`text-[15px] ${isStreaming ? 'animate-spin' : ''}`} />
                                            <span>ฟีดข้อมูล</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopStream}
                                            className="btn-pill root-home-sync-btn is-streaming"
                                        >
                                            <LuRefreshCw className="text-[15px] animate-spin" />
                                            <span>ฟีดข้อมูล</span>
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

                    <div className="root-home-feed-body relative flex-1 overflow-y-auto px-6 pb-8 sm:px-8 lg:px-11 lg:pr-9 scrollbar-hide">
                        {/* News Stream Grid */}
                        <div className={`
                        ${layoutMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-20'
                                : 'flex flex-col space-y-4 pb-20'}
                    `}>
                            {newsResults.length === 0 ? (
                                <>
                                    {isStreaming ? feedToolbar : null}
                                    <div
                                        className={`home-splash ${isStreaming ? 'is-loading' : ''}`.trim()}
                                        onMouseMove={(event) => {
                                            const bounds = event.currentTarget.getBoundingClientRect();
                                            event.currentTarget.style.setProperty('--mx', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
                                            event.currentTarget.style.setProperty('--my', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
                                        }}
                                    >
                                        <HomeCanvas />

                                        {!isStreaming && (
                                            <div className="home-splash-inner">
                                                <h3 className="home-splash-title no-select-ui">
                                                    FORO ติดตามทุกเรื่องที่คุณสนใจ
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                </>
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
                                    {feedToolbar}

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

                                    {isLoadingMore && Array.from({ length: LOAD_MORE_SKELETON_COUNT }).map((_, index) => (
                                        <div key={`load-more-skeleton-${index}`} className="home-load-more-skeleton animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <SkeletonCard variant={layoutMode} />
                                        </div>
                                    ))}
                                </>
                            )}


                        </div>

                        {canSearchMore && (
                            <div className="home-load-more-wrap animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <button
                                    onClick={() => nextCursor
                                        ? startBulkAnalysis(nextCursor)
                                        : startBulkAnalysis(undefined, { preserveExisting: true })
                                    }

                                    className="home-load-more-btn"
                                    title={nextCursor ? `Next Signal: ${nextCursor}` : 'โหลดเพิ่มเติม'}
                                >
                                    โหลดเพิ่มเติม
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
