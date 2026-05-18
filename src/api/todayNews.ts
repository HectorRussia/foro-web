import dayjs from 'dayjs';
import { getNews, searchAndAnalyzeBulk } from './news';
import type { AdvancedSearchBulkPayload, ForoFilterSummary, NewsResult } from '../interface/news';
import type { FilterCitationMap, FilterComparableItem, NormalizedForoSummary } from '../interface/todayNews';

export const getNewsTimestamp = (item: Pick<NewsResult, 'tweet_created_at' | 'published_at' | 'created_at'>) =>
    item.tweet_created_at || item.published_at || item.created_at;

type NewsRecord = Record<string, unknown>;

const toNewsRecord = (item: unknown): NewsRecord =>
    Boolean(item) && typeof item === 'object' && !Array.isArray(item)
        ? item as NewsRecord
        : {};

const toOptionalString = (value: unknown) =>
    value === null || value === undefined || value === '' ? undefined : String(value);

const toNullableString = (value: unknown) =>
    value === null || value === undefined || value === '' ? null : String(value);

const toNewsResultId = (value: unknown): NewsResult['id'] =>
    typeof value === 'string' || typeof value === 'number' ? value : crypto.randomUUID();

export const getSourceType = (item: unknown) => {
    const record = toNewsRecord(item);
    return String(record.source_type || record.item_type || '').trim().toLowerCase();
};

export const isRssNewsItem = (item: unknown) => {
    const record = toNewsRecord(item);
    return getSourceType(record) === 'rss' ||
        (!!record.source_item_id && !record.tweet_id) ||
        !!record.feed_url ||
        !!record.source_url ||
        !!record.rss_url ||
        !!record.rss_feed_url;
};

export const toNewsResult = (item: unknown): NewsResult => {
    const record = toNewsRecord(item);
    const isRss = isRssNewsItem(record);
    const createdAt = String(record.tweet_created_at || record.published_at || record.created_at || new Date().toISOString());
    const source = String(record.tweet_name || record.username || record.source || record.feed_title || record.name ||
        (isRss ? record.feed_url || record.source_url || record.url || '' : 'Twitter'));
    const id = record.id ?? record.tweet_id ?? record.source_item_id ?? record.url;

    return {
        id: toNewsResultId(id),
        title: String(record.title || record.tweet_name || record.name || (isRss ? 'RSS News' : 'Twitter News')),
        content: record.llm_analysis || record.content || record.summary || record.title || '',
        source,
        url: String(record.url || '#'),
        tweet_id: toOptionalString(record.tweet_id),
        tweet_profile_pic: toNullableString(record.tweet_profile_pic || record.profile_image_url_https),
        created_at: createdAt,
        tweet_created_at: toOptionalString(record.tweet_created_at),
        published_at: toOptionalString(record.published_at),
        source_type: isRss ? 'rss' : getSourceType(record) || undefined,
        source_item_id: toOptionalString(record.source_item_id),
        feed_url: toOptionalString(record.feed_url || record.source_url || record.rss_url || record.rss_feed_url),
        retweet_count: Number(record.retweet_count) || 0,
        reply_count: Number(record.reply_count) || 0,
        like_count: Number(record.like_count) || 0,
        quote_count: Number(record.quote_count) || 0,
        view_count: Number(record.view_count) || 0,
        media_urls: Array.isArray(record.media_urls) ? record.media_urls.map(value => String(value)) : [],
        media_type: toNullableString(record.media_type),
        analyzed_with_ai: typeof record.analyzed_with_ai === 'boolean' ? record.analyzed_with_ai : null,
        citation_id: toNullableString(record.citation_id || record.citationId)
    };
};

export const getNewsResultKey = (item: NewsResult) =>
    String(item.tweet_id || item.source_item_id || item.url || item.id);

export const NEWS_PAGE_LIMIT = 40;
export const LOAD_MORE_SKELETON_COUNT = 5;
const DB_HYDRATE_RETRY_DELAYS_MS = [0, 350, 700, 1200];
const FORO_FILTER_CITATION_PATTERN = /\[(?:F|W)\d+\]/gi;
export const TODAY_NEWS_CLEARED_KEY = 'today_news_is_cleared';
export const TODAY_NEWS_CLEARED_IDS_KEY = 'today_news_cleared_ids';

export const readClearedNewsKeys = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(TODAY_NEWS_CLEARED_IDS_KEY) || '[]');
        return new Set(
            Array.isArray(parsed)
                ? parsed.map(item => String(item ?? '').trim()).filter(Boolean)
                : [],
        );
    } catch {
        return new Set<string>();
    }
};

export const clearTodayNewsClearedState = () => {
    localStorage.removeItem(TODAY_NEWS_CLEARED_KEY);
    localStorage.removeItem(TODAY_NEWS_CLEARED_IDS_KEY);
};

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const toCleanString = (value: unknown) =>
    typeof value === 'string' ? value.trim() : '';

export const toCleanStringArray = (value: unknown) =>
    Array.isArray(value)
        ? value.map(item => String(item ?? '').trim()).filter(Boolean)
        : [];

export const normalizeFilterText = (value: unknown) =>
    String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/^@/, '')
        .replace(/\s+/g, ' ');

export const normalizeFilterKey = (value: unknown) =>
    normalizeFilterText(value).replace(/[^a-z0-9]/g, '');

export const normalizeFilterUrl = (value: unknown) =>
    String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/\/+$/, '');

export const isUrlLike = (value: unknown) =>
    /^https?:\/\//i.test(String(value || '').trim());

export const getComparableHostname = (value: unknown) => {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    try {
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
        return url.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
        return '';
    }
};

export const valuesOverlap = (left: string, right: string) => {
    const normalizedLeft = normalizeFilterText(left);
    const normalizedRight = normalizeFilterText(right);
    if (!normalizedLeft || !normalizedRight) return false;
    if (
        normalizedLeft === normalizedRight ||
        normalizedLeft.includes(normalizedRight) ||
        normalizedRight.includes(normalizedLeft)
    ) {
        return true;
    }

    const leftKey = normalizeFilterKey(normalizedLeft);
    const rightKey = normalizeFilterKey(normalizedRight);
    const shortestKeyLength = Math.min(leftKey.length, rightKey.length);

    return shortestKeyLength >= 3 && (
        leftKey === rightKey ||
        leftKey.includes(rightKey) ||
        rightKey.includes(leftKey)
    );
};

export const getComparableRssSourceNames = (values: unknown[]) => {
    const candidates = values.flatMap(value => {
        const raw = String(value ?? '').trim();
        if (!raw) return [];

        if (!isUrlLike(raw) && !['rss', 'rss news'].includes(raw.toLowerCase())) {
            return [normalizeFilterText(raw)];
        }

        const hostname = getComparableHostname(raw);
        if (!hostname) return [];

        const meaningfulParts = hostname
            .split('.')
            .filter(part => part && !['www', 'feed', 'feeds', 'rss', 'xml'].includes(part));

        return [
            hostname.replace(/[._-]+/g, ' '),
            meaningfulParts.join(' '),
            meaningfulParts[0],
        ].map(normalizeFilterText).filter(Boolean);
    });

    return dedupeStrings(candidates);
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const getFilterComparableIds = (item: FilterComparableItem) =>
    [item.id, item.news_id, item.tweet_id, item.source_item_id, item.url]
        .map(value => String(value ?? '').trim())
        .filter(Boolean);

export const normalizeCitationLabel = (value: unknown, fallbackIndex?: number) => {
    const raw = String(value ?? '').trim();
    const stripped = raw.replace(/^\[|\]$/g, '').toUpperCase();

    if (/^[FW]\d+$/.test(stripped)) return stripped;
    if (/^\d+$/.test(stripped)) return `F${stripped}`;
    return typeof fallbackIndex === 'number' ? `F${fallbackIndex + 1}` : '';
};

export const getFilterItemCitationLabel = (item: unknown, index: number) => {
    if (!isRecord(item)) return `F${index + 1}`;

    return normalizeCitationLabel(
        item.citation_id ?? item.citationId ?? item.citation ?? item.reference_id,
        index,
    );
};

export const buildFilterCitationMap = (items: FilterComparableItem[]) =>
    items.reduce<FilterCitationMap>((citationMap, item, index) => {
        const citationLabel = getFilterItemCitationLabel(item, index);
        getFilterComparableIds(item).forEach(id => {
            citationMap[id] = citationLabel;
        });
        return citationMap;
    }, {});

export const getCitationLabelForNews = (item: NewsResult, citationMap: FilterCitationMap) => {
    for (const id of getFilterComparableIds(item)) {
        const citationLabel = citationMap[id];
        if (citationLabel) return citationLabel;
    }
    return undefined;
};

export const dedupeStrings = (values: string[]) =>
    Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));

export const parseForoBullet = (value: string) => {
    const citations = Array.from(new Set(value.match(FORO_FILTER_CITATION_PATTERN) || []))
        .map(citation => citation.replaceAll('[', '').replaceAll(']', ''));
    const text = value
        .replace(FORO_FILTER_CITATION_PATTERN, '')
        .replace(/^[-•*]\s*/, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

    return { text, citations };
};

export const normalizeForoFilterSummary = (summary: ForoFilterSummary | null): NormalizedForoSummary | null => {
    if (!summary) return null;

    if (typeof summary === 'string') {
        const lines = summary.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const bullets = lines
            .filter(line => /^[-•*]\s+/.test(line))
            .map(line => line.replace(/^[-•*]\s+/, '').trim());
        const plainLines = lines.filter(line => !/^[-•*]\s+/.test(line));

        return {
            outputLabel: 'สรุปภาพรวม',
            title: plainLines[0] || 'ผลลัพธ์จาก FORO Filter',
            subtitle: plainLines.slice(1).join(' ') || undefined,
            bullets,
        };
    }

    if (!isRecord(summary)) return null;

    const sectionItems = Array.isArray(summary.sections)
        ? summary.sections.flatMap(section => isRecord(section) ? toCleanStringArray(section.items) : [])
        : [];
    const mainSummary = toCleanString(summary.main_summary);
    const title = toCleanString(summary.title) || toCleanString(summary.headline) || mainSummary || 'ผลลัพธ์จาก FORO Filter';
    const bulletCandidates = [
        ...toCleanStringArray(summary.bullet_points),
        ...toCleanStringArray(summary.bullets),
        ...toCleanStringArray(summary.matchedSignals),
        ...sectionItems,
    ];
    const bullets = dedupeStrings(
        mainSummary && mainSummary !== title
            ? [mainSummary, ...bulletCandidates]
            : bulletCandidates,
    );

    return {
        outputLabel: toCleanString(summary.outputLabel) || 'สรุปภาพรวม',
        title,
        subtitle: toCleanString(summary.subtitle) || toCleanString(summary.whyNow) || undefined,
        dateLabel: toCleanString(summary.dateLabel) || toCleanString(summary.date_range) || toCleanString(summary.dateRange) || undefined,
        bullets,
        note: toCleanString(summary.foro_note) || undefined,
    };
};

export const buildForoSummaryClipboardText = (summary: ForoFilterSummary | null) => {
    const normalizedSummary = normalizeForoFilterSummary(summary);
    if (!normalizedSummary) return '';

    return [
        normalizedSummary.title,
        normalizedSummary.subtitle,
        normalizedSummary.bullets.map(bullet => `- ${parseForoBullet(bullet).text}`).join('\n'),
        normalizedSummary.note,
    ]
        .filter(Boolean)
        .join('\n\n')
        .trim();
};

export const mergeNewsResults = (current: NewsResult[], incoming: NewsResult[]) => {
    const merged = new Map<string, NewsResult>();

    current.forEach(item => merged.set(getNewsResultKey(item), item));
    incoming.forEach(item => {
        const key = getNewsResultKey(item);
        merged.set(key, { ...merged.get(key), ...item });
    });

    return Array.from(merged.values())
        .sort((a, b) => dayjs(getNewsTimestamp(b)).valueOf() - dayjs(getNewsTimestamp(a)).valueOf());
};

export const fetchFeedSources = async (
    payload: AdvancedSearchBulkPayload,
    signal: AbortSignal
) => {
    const result = await searchAndAnalyzeBulk(payload, signal);

    return {
        items: Array.isArray(result?.items) ? result.items : [],
        twitter_cursor: result?.twitter_cursor,
        twitter_has_next: Boolean(result?.twitter_has_next && result?.twitter_cursor)
    };
};

export const loadLatestNewsResults = async (options: { retryUntilFound?: boolean } = {}) => {
    const delays = options.retryUntilFound ? DB_HYDRATE_RETRY_DELAYS_MS : [0];
    let latestResults: NewsResult[] = [];

    for (const delayMs of delays) {
        if (delayMs > 0) {
            await wait(delayMs);
        }

        const newsResponse = await getNews(1, NEWS_PAGE_LIMIT, 1);
        latestResults = Array.isArray(newsResponse.items)
            ? newsResponse.items
                .map(toNewsResult)
                .sort((a, b) => dayjs(getNewsTimestamp(b)).valueOf() - dayjs(getNewsTimestamp(a)).valueOf())
            : [];

        if (!options.retryUntilFound || latestResults.length > 0) {
            break;
        }
    }

    return latestResults;
};

