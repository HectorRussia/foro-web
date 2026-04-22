import api from './axiosInstance';

export interface PresetSearch {
    id: number;
    name: string;
    type: 'content' | 'forofilter';
    user_id: number;
    created_at: string;
    updated_at: string | null;
}

export const getPresets = (type?: 'content' | 'forofilter') =>
    api.get<PresetSearch[]>('/preset-searches/', { params: type ? { type } : {} }).then(r => r.data);

export const createPreset = (name: string, type: 'content' | 'forofilter') =>
    api.post<PresetSearch>('/preset-searches/', { name, type }).then(r => r.data);

export const updatePreset = (id: number, data: { name?: string; type?: 'content' | 'forofilter' }) =>
    api.put<PresetSearch>(`/preset-searches/${id}`, data).then(r => r.data);

export const deletePreset = (id: number) =>
    api.delete(`/preset-searches/${id}`);
