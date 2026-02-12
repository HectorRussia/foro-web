import api from './axiosInstance';
import type { CategoryNewsCreate, CategoryNewsResponse } from '../interface/categoryNews';

export const createCategoryNews = async (data: CategoryNewsCreate): Promise<CategoryNewsResponse> => {
    const response = await api.post<CategoryNewsResponse>('/category-news', data);
    return response.data;
};
