export interface NewsItem {
    id: number,
    title: string,
    content: string,
    url: string,
    user_id: number,
    tweet_profile_pic: string
    created_at: string
}
export interface PaginatedNewsResponse {
    items: NewsItem[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface NewsAnalysisResponse {
    id?: number;
    created_at?: string;
}
