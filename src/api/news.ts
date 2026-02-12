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
