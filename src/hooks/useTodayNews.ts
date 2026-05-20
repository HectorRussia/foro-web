import { useEffect, useRef, useState, type CSSProperties } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { createCategoryNews } from '../api/categoryNews';
import { getCategories } from '../api/category';
import { createPreset, deletePreset, getPresets, type PresetSearch } from '../api/preset';
import { deleteNews, filterNews, getTriggerStatus, updateTriggerStatus } from '../api/news';
import type { AdvancedSearchBulkPayload, ForoFilterSummary, NewsFilterPayload, NewsItem, NewsResult } from '../interface/news';
import type { Category } from '../interface/category';
import type { PostListWithMembers } from '../components/PostList';
import type { FeedNotice, FilterCitationMap } from '../interface/todayNews';
import {
    buildFilterCitationMap,
    buildForoSummaryClipboardText,
    clearTodayNewsClearedState,
    dedupeStrings,
    fetchFeedSources,
    getCitationLabelForNews,
    getComparableHostname,
    getComparableRssSourceNames,
    getFilterComparableIds,
    getNewsResultKey,
    getNewsTimestamp,
    isRecord,
    isRssNewsItem,
    loadLatestNewsResults,
    mergeNewsResults,
    normalizeCitationLabel,
    normalizeFilterUrl,
    readClearedNewsKeys,
    toCleanString,
    toNewsResult,
    valuesOverlap,
    TODAY_NEWS_CLEARED_IDS_KEY,
    TODAY_NEWS_CLEARED_KEY,
} from '../api/todayNews';

export const useTodayNews = () => {
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
    const [aiFilterCitationMap, setAiFilterCitationMap] = useState<FilterCitationMap>({});
    const [aiSummary, setAiSummary] = useState<ForoFilterSummary | null>(null);
    const aiFilterRef = useRef<HTMLDivElement>(null);
    const aiFilterRunIdRef = useRef(0);

    // Preset State
    const [foroPresets, setForoPresets] = useState<PresetSearch[]>([]);
    const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
    const [homePresets, setHomePresets] = useState<Set<number>>(() => {
        try {
            const stored = localStorage.getItem('foro_home_presets');
            if (!stored) return new Set();
            const parsed = JSON.parse(stored);
            const presetIds = Array.isArray(parsed)
                ? parsed.map(id => Number(id)).filter(Number.isFinite)
                : [];
            return new Set(presetIds);
        } catch { return new Set(); }
    });
    const [isLoadingPresets, setIsLoadingPresets] = useState(false);
    const [isSavingPreset, setIsSavingPreset] = useState(false);
    const hasLoadedForoPresetsRef = useRef(false);
    const isLoadingPresetsRef = useRef(false);

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
            const isCleared = localStorage.getItem(TODAY_NEWS_CLEARED_KEY) === 'true';
            const clearedNewsKeys = readClearedNewsKeys();

            // 2. Clear the 'cleared' flag if we detect an active run starting elsewhere
            if (triggerData.trigger === 1 && isCleared) {
                clearTodayNewsClearedState();
            }

            // 3. Fetch items from DB
            const dbResults = await loadLatestNewsResults();
            const hasNews = dbResults.length > 0;
            const shouldKeepCleared =
                isCleared &&
                triggerData.trigger !== 1 &&
                (
                    !hasNews ||
                    (
                        clearedNewsKeys.size > 0 &&
                        dbResults.every(item => clearedNewsKeys.has(getNewsResultKey(item)))
                    )
                );

            if (isCleared && hasNews && !shouldKeepCleared) {
                clearTodayNewsClearedState();
            }

            // 4. Decision: Show news IF (Run is Active) OR (User hasn't explicitly clicked Clear)
            if (hasNews && (triggerData.trigger === 1 || !shouldKeepCleared)) {
                setNewsResults(dbResults);
                setHasStarted(true);
            } else {
                setNewsResults([]);
            }

            // 5. Update Status Message based on the merged state
            if (triggerData.trigger === 1) {
                setHasStarted(true);
                setStatusMessage('ระบบกำลังทำงานอยู่ (ตรวจพบค้างคา)');
            } else if (shouldKeepCleared && !hasNews) {
                setStatusMessage('ระบบพร้อมทำงาน');
            } else if (shouldKeepCleared && hasNews) {
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
        loadForoPresets();
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
            clearTodayNewsClearedState(); // Reset clear flag on new start
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
        } catch (error: unknown) {
            const isCanceledError = isRecord(error)
                && (error.name === 'CanceledError' || error.code === 'ERR_CANCELED');
            if (isCanceledError) {
                setStatusMessage('หยุดการประมวลผลแล้ว');
                setFeedNotice(null);
                return;
            }

            console.error('Bulk analysis failed:', error);
            setStatusMessage(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    const loadForoPresets = async (options: { force?: boolean } = {}) => {
        if (isLoadingPresetsRef.current) return;
        if (hasLoadedForoPresetsRef.current && !options.force) return;

        isLoadingPresetsRef.current = true;
        setIsLoadingPresets(true);
        try {
            const presets = await getPresets('forofilter');
            setForoPresets(presets);
            hasLoadedForoPresetsRef.current = true;
        } catch (error) {
            console.error('Failed to load presets:', error);
        } finally {
            isLoadingPresetsRef.current = false;
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
        } catch (error: unknown) {
            const detail = isRecord(error) && isRecord(error.response) && isRecord(error.response.data)
                ? toCleanString(error.response.data.detail)
                : '';
            toast.error(detail || 'บันทึก preset ไม่สำเร็จ');
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
        loadForoPresets({ force: true });
    };

    const handleDeleteIndividual = async (id: number) => {
        try {
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

        if (newsResults.length === 0) {
            toast.error('ยังไม่มีข่าวให้ FORO Filter คัดกรอง');
            return;
        }

        const runId = aiFilterRunIdRef.current + 1;
        aiFilterRunIdRef.current = runId;
        setIsAIProcessing(true);
        setIsAIFilterOpen(false);
        setAiSummary(null);
        setAiFilteredIds(null);
        setAiFilterCitationMap({});
        setFeedNotice({
            variant: 'loading',
            message: 'กำลังวิเคราะห์บทสรุปสำหรับคุณ...',
        });

        const payload: NewsFilterPayload = {
            prompt: prompt,
            news_items: newsResults.map(res => ({
                id: res.id,
                title: res.title,
                content: res.content,
                source: res.source,
                url: res.url,
                tweet_id: res.tweet_id,
                source_item_id: res.source_item_id,
                created_at: getNewsTimestamp(res),
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
            const data = await filterNews(payload);
            if (aiFilterRunIdRef.current !== runId) return;

            if (data.status && data.status !== 'success') {
                toast.error(data.message || 'FORO Filter ไม่สำเร็จ');
                setFeedNotice({
                    variant: 'error',
                    message: data.message || 'FORO Filter มีปัญหา ลองใหม่อีกครั้ง',
                });
                return;
            }

            if (Array.isArray(data.filtered_news)) {
                setAiSummary(data.summary || null);
                const ids = dedupeStrings(data.filtered_news.flatMap(item => getFilterComparableIds(item)));
                setAiFilterCitationMap(buildFilterCitationMap(data.filtered_news));
                setAiFilteredIds(ids);
                const filteredCount = typeof data.filtered_news_count === 'number'
                    ? data.filtered_news_count
                    : ids.length;
                setFeedNotice({
                    variant: 'success',
                    message: data.message || (filteredCount > 0
                        ? `คัดกรองสำเร็จ • พบ ${filteredCount} การ์ด`
                        : 'คัดกรองสำเร็จ แต่ไม่พบข่าวที่ตรงกับเงื่อนไข'),
                });
                toast.success('คัดกรองข้อมูลสำเร็จ');
            } else {
                toast.error(data.message || 'คัดกรองไม่สำเร็จ');
                setFeedNotice({
                    variant: 'error',
                    message: data.message || 'คัดกรองไม่สำเร็จ',
                });
            }
        } catch (error) {
            if (aiFilterRunIdRef.current !== runId) return;
            console.error('AI Filter failed:', error);
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ AI');
            setFeedNotice({
                variant: 'error',
                message: 'FORO Filter มีปัญหา ลองใหม่อีกครั้ง',
            });
        } finally {
            if (aiFilterRunIdRef.current === runId) {
                setIsAIProcessing(false);
            }
        }
    };

    const clearAIFilter = () => {
        aiFilterRunIdRef.current += 1;
        setIsAIProcessing(false);
        setAiFilteredIds(null);
        setAiFilterCitationMap({});
        setAiSummary(null);
        setAiPrompt('');
        setSelectedPresetId(null);
        setFeedNotice({
            variant: 'success',
            message: 'ล้างตัวกรองแล้ว',
        });
    };

    const handleCopyAISummary = async () => {
        const clipboardText = buildForoSummaryClipboardText(aiSummary);
        if (!clipboardText) return;

        try {
            await navigator.clipboard.writeText(clipboardText);
            setFeedNotice({
                variant: 'success',
                message: 'คัดลอกผลลัพธ์จาก FORO Filter แล้ว',
            });
            toast.success('คัดลอกผลลัพธ์แล้ว');
        } catch (error) {
            console.error('Failed to copy FORO Filter summary:', error);
            toast.error('คัดลอกไม่สำเร็จ');
        }
    };

    const handleClear = async () => {
        try {
            const newsIds = newsResults
                .map(item => Number(item.id))
                .filter((id): id is number => Number.isFinite(id));
            const clearedKeys = newsResults.map(getNewsResultKey);
            await updateTriggerStatus(0, newsIds.length > 0 ? newsIds : undefined);
            if (newsResults.length > 0) {
                setBackupResults(newsResults);
                setBackupCursor(nextCursor);
                setIsRestorable(true);
            }
            setNewsResults([]);
            aiFilterRunIdRef.current += 1;
            setIsAIProcessing(false);
            setAiFilteredIds(null);
            setAiFilterCitationMap({});
            setAiSummary(null);
            setSelectedPresetId(null);
            setHasStarted(false);
            localStorage.removeItem('today_news_twitter_cursor');
            localStorage.setItem(TODAY_NEWS_CLEARED_KEY, 'true'); // Flag to persist clear on refresh
            localStorage.setItem(TODAY_NEWS_CLEARED_IDS_KEY, JSON.stringify(clearedKeys));
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
            clearTodayNewsClearedState();
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
        analyzed_with_ai: res.analyzed_with_ai,
        citation_id: getCitationLabelForNews(res, aiFilterCitationMap) || res.citation_id || null
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
            const rssMembers = selectedPostList.members.filter(m =>
                (m.follow_user_type || m.follow_user_follow_type) === 'rss' || Boolean(m.follow_user_source_url)
            );
            const memberSources = new Set(rssMembers
                .map(m => normalizeFilterUrl(m.follow_user_source_url))
                .filter(Boolean));
            const memberSourceHosts = new Set(rssMembers
                .map(m => getComparableHostname(m.follow_user_source_url))
                .filter(Boolean));
            const memberSourceNames = new Set(rssMembers.flatMap(m =>
                getComparableRssSourceNames([
                    m.follow_user_name,
                    m.follow_user_source_url,
                ])
            ));
            const hasRssMembers = rssMembers.length > 0;

            filtered = filtered.filter(item => {
                if (isRssNewsItem(item)) {
                    const rssUrls = [
                        item.feed_url,
                        item.source_item_id,
                        item.url,
                        item.source,
                    ].map(normalizeFilterUrl).filter(Boolean);
                    const rssHosts = rssUrls.map(getComparableHostname).filter(Boolean);
                    const rssSourceNames = getComparableRssSourceNames([
                        item.source,
                        item.feed_url,
                        item.source_item_id,
                        item.url,
                    ]);

                    if (rssUrls.length === 0 && rssSourceNames.length === 0) return hasRssMembers;

                    const matchesByUrl = [...memberSources].some(source =>
                        rssUrls.some(rssUrl => valuesOverlap(rssUrl, source))
                    );
                    const matchesByHost = [...memberSourceHosts].some(host =>
                        rssHosts.some(rssHost => valuesOverlap(rssHost, host))
                    );
                    const matchesByName = [...memberSourceNames].some(name =>
                        rssSourceNames.some(rssSourceName => valuesOverlap(rssSourceName, name))
                    );

                    return matchesByUrl || matchesByHost || matchesByName;
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
        if (aiFilteredIds !== null) {
            const filteredIdSet = new Set(aiFilteredIds.map(id => String(id)));
            return sorted.filter(item => {
                return getFilterComparableIds(item).some(id => filteredIdSet.has(id));
            });
        }
        return sorted;
    };

    const displayNews = getFilteredNews();
    const isAiFilterActive = aiFilteredIds !== null;
    const isFilterUiActive = isAIProcessing || isAiFilterActive;
    const aiFilterCitationLabels = dedupeStrings(
        displayNews
            .map(item => getCitationLabelForNews(item, aiFilterCitationMap) || normalizeCitationLabel(item.citation_id))
            .filter((label): label is string => Boolean(label)),
    );
    const feedCount = isAIProcessing ? newsResults.length : displayNews.length;
    const canSearchMore = !isStreaming && !isAIProcessing && hasStarted && displayNews.length > 0 && !isAiFilterActive;
    const selectedHomePresets = homePresets.size > 0
        ? foroPresets.filter(preset => homePresets.has(preset.id))
        : [];
    const selectedHomeQuickPresets = selectedHomePresets.length > 0
        ? selectedHomePresets
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

    return {
        isStreaming,
        isLoadingMore,
        layoutMode,
        activeFilters,
        feedNotice,
        nextCursor,
        hasStarted,
        isRestorable,
        categories,
        isAIFilterOpen,
        setIsAIFilterOpen,
        aiPrompt,
        setAiPrompt,
        isAIProcessing,
        aiSummary,
        aiFilterRef,
        foroPresets,
        selectedPresetId,
        setSelectedPresetId,
        homePresets,
        isLoadingPresets,
        isSavingPreset,
        newsResults,
        progress,
        selectedPostList,
        setSelectedPostList,
        startBulkAnalysis,
        stopStream,
        handleSelectPreset,
        handleSavePreset,
        handleDeletePreset,
        toggleHomePreset,
        openForoFilter,
        handleDeleteIndividual,
        handleAddNewsToCategory,
        handleAIFilter,
        clearAIFilter,
        handleCopyAISummary,
        handleClear,
        handleRestore,
        mapToNewsItem,
        toggleFilter,
        displayNews,
        isAiFilterActive,
        isFilterUiActive,
        aiFilterCitationLabels,
        feedCount,
        canSearchMore,
        visibleHomeQuickPresets,
        activeListStyle,
        activeListName,
    };
};

export type TodayNewsViewModel = ReturnType<typeof useTodayNews>;
