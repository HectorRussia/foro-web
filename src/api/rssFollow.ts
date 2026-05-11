import api from './axiosInstance';
import type { RssSource } from '../config/rssCatalog';
import type { FollowedUser } from '../interface/userTarget';

export interface RssFollowPayload {
    rss_url: string;
    name: string;
    profile_image_url_https: string | null;
}

export interface RssPreviewItem {
    title: string;
    url: string;
    summary?: string | null;
    source_item_id?: string | null;
    published_at?: string | null;
    author?: string | null;
    media_urls?: string[];
}

export interface RssPreviewResponse {
    status: string;
    data: {
        feed_url: string;
        feed_title: string;
        items: RssPreviewItem[];
    };
}

export const getRssSourceAvatarUrl = (source: Pick<RssSource, 'siteUrl' | 'name'>) => {
    try {
        const hostname = new URL(source.siteUrl).hostname;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
        return null;
    }
};

export const buildRssFollowPayload = (source: RssSource): RssFollowPayload => ({
    rss_url: source.url,
    name: source.name,
    profile_image_url_https: getRssSourceAvatarUrl(source),
});

export const followRssSource = async (source: RssSource): Promise<FollowedUser> => {
    const response = await api.post('/follow/rss', buildRssFollowPayload(source));
    return (response.data?.data ?? response.data) as FollowedUser;
};

export const previewRssSource = async (rssUrl: string): Promise<RssPreviewResponse> => {
    const response = await api.get<RssPreviewResponse>('/follow/rss/preview', {
        params: { rss_url: rssUrl },
    });
    return response.data;
};
