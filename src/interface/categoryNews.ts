export interface CategoryNewsCreate {
    category_id: number;
    news_id: number;
}

export interface CategoryNewsResponse {
    id: number;
    category_id: number;
    news_id: number;
    created_at: string;
    updated_at: string;
}

export interface CategoryNewsItem {
    id: number;
    category_id: number;
    news_id: number;
    category_name: string;
    news_title: string;
    news_content: string;
    news_url: string;
    news_tweet_profile_pic: string;
    created_at: string;
    updated_at: string;
    retweet_count?: number
    reply_count?: number
    like_count?: number
    quote_count?: number
    view_count?: number
}
