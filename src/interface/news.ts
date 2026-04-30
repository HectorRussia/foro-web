export interface NewsItem {
    id: number,
    item_type?: string | null,
    title: string,
    content: string,
    url: string,
    user_id: number,
    tweet_profile_pic?: string | null
    created_at: string
    tweet_id?: string
    username?: string | null
    retweet_count?: number
    reply_count?: number
    like_count?: number
    quote_count?: number
    view_count?: number
    source?: string
    source_type?: string | null
    source_item_id?: string | null
    feed_url?: string | null
    published_at?: string | null
    tweet_created_at?: string
    media_urls?: string[]
    media_type?: string | null
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
    id: string | number;
    title: string;
    content: any;
    source: string;
    url: string;
    tweet_id?: string;
    tweet_profile_pic?: string | null;
    current?: number;
    total?: number;
    created_at: string;
    source_type?: string | null;
    source_item_id?: string | null;
    feed_url?: string | null;
    published_at?: string | null;
    retweet_count?: number
    reply_count?: number
    like_count?: number
    quote_count?: number
    view_count?: number
    tweet_created_at?: string
    media_urls?: string[]
    media_type?: string | null
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
    tweet_profile_pic?: string;
    twitter_cursor?: string;
    twitter_has_next?: boolean;
}

export interface SSEEvent {
    event: string;
    data: SSEEventData;
}

export interface AdvancedSearchBulkResponse {
    items: NewsItem[];
    total: number;
    page: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    twitter_cursor?: string;
    twitter_has_next?: boolean;
    search_query?: string;
}
