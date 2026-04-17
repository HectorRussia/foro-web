import api from './axiosInstance';

export interface BookmarkNewsItem {
    id: number;
    item_type: string;
    title: string;
    username: string | null;
    content: string;
    url: string;
    tweet_profile_pic: string | null;
    tweet_id: string | null;
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    view_count: number;
    tweet_created_at: string | null;
    has_video: boolean;
    media_urls: string[] | null;
    media_type: string | null;
    created_at: string;
}

export interface BookmarkResponse {
    id: number;
    news_id: number;
    user_id: number;
    news_item: BookmarkNewsItem;
    created_at: string;
}

export interface PaginatedBookmarkResponse {
    items: BookmarkResponse[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface BookmarkCheckResponse {
    is_bookmarked: boolean;
    bookmark_id: number | null;
}

export interface ContentSearchBookmarkPayload {
    title: string;
    username: string;
    content: string;
    url: string;
    tweet_id: string;
    tweet_profile_pic: string;
    tweet_created_at: string;
    has_video: boolean;
    media_urls?: string[] | null;
    media_type?: string | null;
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count?: number;
    view_count: number;
    source_type: string;
    ref_code: string;
    search_query: string;
}

/** Bookmark ข่าวที่อยู่ใน DB แล้ว */
export const createBookmark = async (newsId: number): Promise<BookmarkResponse> => {
    const response = await api.post<BookmarkResponse>('/bookmarks', { news_id: newsId });
    return response.data;
};

/** Bookmark จาก content search (save + bookmark) */
export const createContentSearchBookmark = async (
    payload: ContentSearchBookmarkPayload
): Promise<BookmarkResponse> => {
    const response = await api.post<BookmarkResponse>('/bookmarks/content-search', payload);
    return response.data;
};

/** เช็คสถานะ bookmark */
export const checkBookmark = async (newsId: number): Promise<BookmarkCheckResponse> => {
    const response = await api.get<BookmarkCheckResponse>(`/bookmarks/check/${newsId}`);
    return response.data;
};

/** ลบ bookmark ตาม news_id */
export const removeBookmarkByNewsId = async (newsId: number): Promise<void> => {
    await api.delete(`/bookmarks/by-news/${newsId}`);
};

/** ดึง bookmarks ทั้งหมดของ user (pagination) */
export const getBookmarks = async (page = 1, limit = 10): Promise<PaginatedBookmarkResponse> => {
    const response = await api.get<PaginatedBookmarkResponse>('/bookmarks', {
        params: { page, limit },
    });
    return response.data;
};
