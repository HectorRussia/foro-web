import api from './axiosInstance';
import type {
    AdvancedSearchBulkPayload,
    AdvancedSearchBulkResponse,
    NewsFilterPayload,
    NewsFilterResponse,
    PaginatedNewsResponse,
    NewsAnalysisResponse
} from '../interface/news';

export const getNews = async (
    page = 1,
    limit = 10,
    days_range: number | null = null,
    search?: string,
    min_view_count?: number,
    min_engagement?: number,
): Promise<PaginatedNewsResponse> => {
    const response = await api.get<PaginatedNewsResponse>('/news', {
        params: {
            page,
            limit,
            ...(days_range !== null && { days_range }),
            ...(search ? { search } : {}),
            ...(min_view_count !== undefined ? { min_view_count } : {}),
            ...(min_engagement !== undefined ? { min_engagement } : {}),
        },
    });
    return response.data;
};

export const deleteNews = async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
};

export const getNewsAnalysis = async (): Promise<NewsAnalysisResponse> => {
    const response = await api.get<NewsAnalysisResponse>('/news/analyze');
    return response.data;
};

export const analyzeNews = async (): Promise<void> => {
    await api.post('/news/analyze');
};

// Axios ใน Browser ไม่รองรับการอ่าน ReadableStream แบบ Real-time (จะรอจนกว่าข้อมูลจะมาครบทั้งหมดถึงจะเริ่มทำงาน) 
// ซึ่งจะทำให้ UI ของไม่ "ไหล" ตามเหตุการณ์จริง
export const analyzeNewsProTier = async (): Promise<Response> => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/news-sse/analyze-individual`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response;
};

export const getTriggerStatus = async (): Promise<{ trigger: number }> => {
    const response = await api.get('/news/trigger');
    return response.data;
};

export const updateTriggerStatus = async (trigger: number, news_ids?: number[]): Promise<void> => {
    await api.patch('/news/trigger', { trigger, news_ids });
};

export const searchAndAnalyzeBulk = async (
    payload: AdvancedSearchBulkPayload,
    signal?: AbortSignal
): Promise<AdvancedSearchBulkResponse> => {
    const response = await api.post<AdvancedSearchBulkResponse>('/advanced-search/search-and-analyze-bulk', payload, { signal });
    return response.data;
};

export const filterNews = async (payload: NewsFilterPayload): Promise<NewsFilterResponse> => {
    const response = await api.post<NewsFilterResponse>('/news/filter', payload);
    return response.data;
};

export interface RssFetchPayload {
    post_list_id?: number | null;
    limit_per_feed?: number;
    analyze_with_ai?: boolean;
}

export interface RssFetchedNewsItem {
    id: number;
    title: string;
    url: string;
    feed_url: string;
    source_item_id: string;
    published_at: string | null;
    media_urls?: string[] | null;
    analyzed_with_ai?: boolean;
}

export interface RssFetchResponse {
    status: string;
    total_feeds?: number;
    saved_count?: number;
    updated_count?: number;
    skipped_count?: number;
    error_count?: number;
    items?: RssFetchedNewsItem[];
    updated_items?: RssFetchedNewsItem[];
    errors?: unknown[];
}

export const fetchRssNews = async (
    payload: RssFetchPayload = {},
    signal?: AbortSignal
): Promise<RssFetchResponse> => {
    const response = await api.post<RssFetchResponse>('/news/rss/fetch', payload, { signal });
    return response.data;
};
