import api from './axiosInstance';
import type { PaginatedNewsResponse, NewsAnalysisResponse } from '../interface/news';

export const getNews = async (page = 1, limit = 10, days_range: number | null = null): Promise<PaginatedNewsResponse> => {
    const response = await api.get<PaginatedNewsResponse>('/news', {
        params: {
            page,
            limit,
            days_range
        }
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

export const searchAndAnalyzeBulk = async (payload: any, signal?: AbortSignal): Promise<any> => {
    const response = await api.post('/advanced-search/search-and-analyze-bulk', payload, { signal });
    return response.data;
};
