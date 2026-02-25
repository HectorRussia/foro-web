export interface NewsItem {
    id: number,
    title: string,
    content: string,
    url: string,
    user_id: number,
    tweet_profile_pic: string
    created_at: string
    tweet_id?: string
    retweet_count?: number
    reply_count?: number
    like_count?: number
    quote_count?: number
    view_count?: number
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

export interface NewsResult {
    id: number;
    title: string;
    content: any;
    source: string;
    url: string;
    tweet_id?: string;
    tweet_profile_pic?: string;
    current?: number;
    total?: number;
    created_at: string;
    retweet_count?: number
    reply_count?: number
    like_count?: number
    quote_count?: number
    view_count?: number
}

export interface SSEEventData {
    message: string;
    followed_count?: number;
    step?: string;
    current?: number;
    total?: number;
    total_tweets?: number;
    analysis?: string | any;
    source?: string;
    url?: string;
    tweet_id?: string;
    error_code?: string;
    retweet_count?: number;
    reply_count?: number;
    like_count?: number;
    quote_count?: number;
    view_count?: number;
    tweet_created_at?: string;
}

export interface SSEEvent {
    event: string;
    data: SSEEventData;
}