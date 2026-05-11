export interface UserTweetSearch {
    id: string,
    name: string,
    screen_name: string,
    username: string | null,
    location: string,
    url: string,
    description: string,
    email: string | null,
    protected: boolean,
    verified: boolean,
    followers_count: number,
    following_count: number,
    friends_count: number,
    favourites_count: number,
    statuses_count: number,
    media_tweets_count: number,
    created_at: string,
    profile_banner_url: string,
    profile_image_url_https: string,
    can_dm: boolean,
    isBlueVerified: boolean
}

export interface FollowedUser {
    id: number;
    x_account: string | null;
    follow_type?: 'x' | 'rss' | string | null;
    source_url?: string | null;
    name: string | null;
    profile_image_url_https: string | null;
    status: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface Recommendation {
    x_account: string;
    name: string;
    reason: string;
    followers?: string;
    followers_count?: number;
    following?: string;
    following_count?: number;
    posts?: string;
    statuses_count?: number;
    profile_image?: string;
    profile_image_url_https?: string;
}

export interface RecommendationResponse {
    status: string;
    data: {
        recommendations: Recommendation[];
        total_found: string;
        message: string;
        query: string;
    };
}
// vercel not deploy 
