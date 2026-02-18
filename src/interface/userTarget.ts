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
    x_account: string;
    name: string;
    profile_image_url_https: string;
    status: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface Recommendation {
    x_account: string;
    name: string;
    reason: string;
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
