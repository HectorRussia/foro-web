import api from './axiosInstance';
import type { RssSource } from '../config/rssCatalog';
import type { FollowedUser } from '../interface/userTarget';

export interface RssFollowPayload {
    rss_url: string;
    name: string;
    profile_image_url_https: string | null;
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
