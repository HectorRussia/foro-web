import api from './axiosInstance';
import type { CategoryNewsCreate, CategoryNewsResponse, CategoryNewsItem } from '../interface/categoryNews';

export const createCategoryNews = async (data: CategoryNewsCreate): Promise<CategoryNewsResponse> => {
    const response = await api.post<CategoryNewsResponse>('/category-news', data);
    return response.data;
};

export const deleteCategoryNews = async (id: number): Promise<void> => {
    await api.delete(`/category-news/${id}`);
};


export const getNewsByCategory = async (categoryId: number): Promise<CategoryNewsItem[]> => {
    const response = await api.get<CategoryNewsItem[]>(`/category-news/category/${categoryId}`);
    return response.data;
};