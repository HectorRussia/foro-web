export interface NewsItem {
    id: number,
    item_type?: string | null,
    title: string,
    content: string,
    url: string,
    user_id: number,
    tweet_profile_pic?: string | null
    created_at: string
    tweet_id?: string | null
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
    tweet_created_at?: string | null
    media_urls?: string[] | null
    media_type?: string | null
    analyzed_with_ai?: boolean | null
    trigger_news?: number
    citation_id?: string | null
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
    tweet_id?: string | null;
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
    tweet_created_at?: string | null
    media_urls?: string[] | null
    media_type?: string | null
    analyzed_with_ai?: boolean | null
    citation_id?: string | null
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
    tweet_id?: string | null;
    error_code?: string;
    retweet_count?: number;
    reply_count?: number;
    like_count?: number;
    quote_count?: number;
    view_count?: number;
    tweet_created_at?: string | null;
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
    page?: number;
    limit?: number;
    has_next?: boolean;
    has_previous?: boolean;
    has_prev?: boolean;
    twitter_cursor?: string | null;
    twitter_has_next?: boolean;
    search_query?: string;
    message?: string;
}

export interface AdvancedSearchBulkPayload {
    query?: string;
    query_type?: string;
    cursor?: string | null;
    since_date?: string;
    until_date?: string;
    post_list_id?: number | null;
    use_followed_users?: boolean;
    specific_users?: string[];
    fetch_rss_first?: boolean;
    rss_limit_per_feed?: number;
    analyze_rss_with_ai?: boolean;
}

export interface NewsFilterPayloadItem {
    id: string | number;
    title: string;
    content: unknown;
    source: string;
    url: string;
    tweet_id?: string | null;
    source_item_id?: string | null;
    created_at: string;
    metrics: {
        retweet_count?: number;
        reply_count?: number;
        like_count?: number;
        quote_count?: number;
        view_count?: number;
    };
}

export interface NewsFilterPayload {
    prompt: string;
    news_items: NewsFilterPayloadItem[];
}

export type ForoFilterSummary =
    | string
    | {
        title?: string;
        headline?: string;
        subtitle?: string;
        whyNow?: string;
        outputLabel?: string;
        date_range?: string;
        dateRange?: string;
        dateLabel?: string;
        main_summary?: string;
        bullet_points?: string[];
        bullets?: string[];
        matchedSignals?: string[];
        sections?: Array<{
            title?: string;
            items?: string[];
        }>;
        foro_note?: string;
        confidence_score?: number | null;
        [key: string]: unknown;
    };

export interface NewsFilterResponseItem {
    id?: string | number;
    news_id?: string | number;
    title?: string;
    content?: unknown;
    source?: string;
    tweet_id?: string | number | null;
    source_item_id?: string | null;
    url?: string;
    citation_id?: string | null;
    citationId?: string | null;
    citation?: string | null;
    reference_id?: string | null;
    created_at?: string;
    metrics?: {
        retweet_count?: number;
        reply_count?: number;
        like_count?: number;
        quote_count?: number;
        view_count?: number;
    };
    [key: string]: unknown;
}

export interface NewsFilterResponse {
    status?: 'success' | 'error' | string;
    prompt?: string;
    total_news_input?: number;
    filtered_news_count?: number;
    filtered_news?: NewsFilterResponseItem[];
    summary?: ForoFilterSummary | null;
    message?: string;
}
