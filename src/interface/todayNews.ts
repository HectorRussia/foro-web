export type TodayNewsLayoutMode = 'grid' | 'compact';

export type TodayNewsSortFilter = 'mostView' | 'mostLiked';

export type FeedNotice = {
    variant: 'loading' | 'success' | 'error';
    message: string;
};

export type FilterComparableItem = {
    id?: string | number | null;
    news_id?: string | number | null;
    tweet_id?: string | number | null;
    source_item_id?: string | null;
    url?: string | null;
};

export type FilterCitationMap = Record<string, string>;

export type NormalizedForoSummary = {
    outputLabel: string;
    title: string;
    subtitle?: string;
    dateLabel?: string;
    bullets: string[];
    note?: string;
};

export type HomeQuickPreset = {
    key: string;
    label: string;
    presetId: number;
};
