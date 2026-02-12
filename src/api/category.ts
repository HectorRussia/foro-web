import api from './axiosInstance';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../interface/category';

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
};

export const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: UpdateCategoryInput): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
};
