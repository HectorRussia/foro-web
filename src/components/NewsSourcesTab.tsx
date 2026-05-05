import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
    HiOutlineAcademicCap,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineBeaker,
    HiOutlineBriefcase,
    HiOutlineBuildingLibrary,
    HiOutlineCake,
    HiOutlineChartBar,
    HiOutlineCheck,
    HiOutlineChatBubbleBottomCenterText,
    HiOutlineCodeBracket,
    HiOutlineCommandLine,
    HiOutlineCpuChip,
    HiOutlineCurrencyDollar,
    HiOutlineGlobeAlt,
    HiOutlineGlobeAsiaAustralia,
    HiOutlineHeart,
    HiOutlineHomeModern,
    HiOutlineNewspaper,
    HiOutlinePaperAirplane,
    HiOutlinePlus,
    HiOutlineShieldCheck,
    HiOutlineSparkles,
    HiOutlineTrophy,
    HiOutlineTruck,
    HiOutlineTv,
    HiOutlineXMark,
} from 'react-icons/hi2';

import { RSS_CATALOG, TOPIC_LABELS, type RssSource } from '../config/rssCatalog';
import type { PostList as IPostList, PostListUser } from '../api/postList';
import { getRssSourceAvatarUrl } from '../api/rssFollow';

type PostListWithMembers = IPostList & { members: PostListUser[] };
type TopicIcon = ComponentType<{ className?: string }>;

interface NewsSourcesTabProps {
    subscribedSources: RssSource[];
    postLists: PostListWithMembers[];
    isFetchingPostLists?: boolean;
    busySourceId?: string | null;
    busyPostListKey?: string | null;
    onToggleSource: (source: RssSource) => void | Promise<void>;
    onTogglePostList: (source: RssSource, list: PostListWithMembers) => void | Promise<void>;
}

interface SourceCardProps {
    source: RssSource;
    isSubscribed: boolean;
    isBusy: boolean;
    postLists: PostListWithMembers[];
    isFetchingPostLists?: boolean;
    busyPostListKey?: string | null;
    onToggle: () => void | Promise<void>;
    onTogglePostList: (list: PostListWithMembers) => void | Promise<void>;
}

const THAI_FILTER_KEY = 'thai';
const ALL_VIEW_TOPIC_PRIORITY = [
    'news',
    'politics',
    'finance',
    'business',
    'tech',
    'ai',
    'science',
    'health',
    'environment',
    'security',
    'developer',
    'crypto',
    'gaming',
    'entertainment',
    'sports',
    'lifestyle',
    'travel',
    'food',
    'education',
    'opinion',
    'realestate',
    'auto',
] as const;

const FEATURED_SOURCE_IDS = [
    'bbc',
    'bloomberg',
    'cnbc',
    'npr-news',
    'guardian-world',
    'al-jazeera',
    'abc-news',
    'cbs-news',
    'time',
    'bangkok-post',
    'fortune',
    'marketwatch',
    'thestandard',
    'matichon',
    'techcrunch',
    'verge',
    'mit-tech-review',
] as const;

const TOPIC_ICON_MAP: Record<string, TopicIcon> = {
    ai: HiOutlineCpuChip,
    tech: HiOutlineCommandLine,
    developer: HiOutlineCodeBracket,
    security: HiOutlineShieldCheck,
    gaming: HiOutlineTv,
    crypto: HiOutlineCurrencyDollar,
    business: HiOutlineBriefcase,
    finance: HiOutlineChartBar,
    science: HiOutlineBeaker,
    news: HiOutlineNewspaper,
    politics: HiOutlineBuildingLibrary,
    health: HiOutlineHeart,
    sports: HiOutlineTrophy,
    entertainment: HiOutlineTv,
    lifestyle: HiOutlineSparkles,
    travel: HiOutlinePaperAirplane,
    food: HiOutlineCake,
    environment: HiOutlineGlobeAsiaAustralia,
    education: HiOutlineAcademicCap,
    opinion: HiOutlineChatBubbleBottomCenterText,
    realestate: HiOutlineHomeModern,
    auto: HiOutlineTruck,
};

const topicPriorityIndex = new Map<string, number>(
    ALL_VIEW_TOPIC_PRIORITY.map((topic, index) => [topic, index]),
);
const featuredPriorityIndex = new Map<string, number>(
    FEATURED_SOURCE_IDS.map((id, index) => [id, index]),
);

const normalizeUrl = (value?: string | null) => String(value || '').trim().toLowerCase().replace(/\/$/, '');

const getSourceHostname = (source: RssSource) => {
    try {
        return new URL(source.siteUrl).hostname.replace(/^www\./, '');
    } catch {
        return source.siteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');
    }
};

const sortSourcesForAllView = (sources: RssSource[]) =>
    [...sources].sort((left, right) => {
        const leftFeatured = featuredPriorityIndex.has(left.id) ? 0 : 1;
        const rightFeatured = featuredPriorityIndex.has(right.id) ? 0 : 1;
        if (leftFeatured !== rightFeatured) return leftFeatured - rightFeatured;

        if (leftFeatured === 0 && rightFeatured === 0) {
            return (
                (featuredPriorityIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
                (featuredPriorityIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER)
            );
        }

        const leftTopicPriority = topicPriorityIndex.get(left.topic) ?? Number.MAX_SAFE_INTEGER;
        const rightTopicPriority = topicPriorityIndex.get(right.topic) ?? Number.MAX_SAFE_INTEGER;
        if (leftTopicPriority !== rightTopicPriority) return leftTopicPriority - rightTopicPriority;

        return left.name.localeCompare(right.name);
    });

const isSourceMemberOfList = (source: RssSource, list: PostListWithMembers) => {
    const sourceUrl = normalizeUrl(source.url);
    return list.members.some((member) => normalizeUrl(member.follow_user_source_url) === sourceUrl);
};

const LanguageBadge = ({ source }: { source: RssSource }) => {
    if (source.lang === 'th') {
        return (
            <span className="rounded bg-emerald-400/12 px-1.5 py-0.5 text-[9px] font-black text-emerald-300">
                TH
            </span>
        );
    }

    return (
        <span className="rounded bg-amber-400/12 px-1.5 py-0.5 text-[9px] font-black text-amber-300">
            EN→TH
        </span>
    );
};

const TopicButton = ({
    active,
    label,
    count,
    Icon,
    onClick,
}: {
    active: boolean;
    label: string;
    count?: number;
    Icon?: TopicIcon;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md border px-2 text-[12px] font-semibold transition-all ${active
            ? 'border-white bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.3)]'
            : 'border-white/8 bg-transparent text-gray-400 hover:border-white/18 hover:bg-white/8 hover:text-white'
            }`}
    >
        {Icon && <Icon className="text-[13px]" />}
        <span>{label}</span>
        {typeof count === 'number' && <span className="text-[10px] font-black opacity-80">{count}</span>}
    </button>
);

const SourceCard = ({
    source,
    isSubscribed,
    isBusy,
    postLists,
    isFetchingPostLists,
    busyPostListKey,
    onToggle,
    onTogglePostList,
}: SourceCardProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const faviconUrl = getRssSourceAvatarUrl(source);
    const hostname = getSourceHostname(source);

    return (
        <div className={`relative flex min-h-[168px] flex-col rounded-[18px] border p-3.5 transition-all duration-200 ${isSubscribed
            ? 'border-blue-400/25 bg-blue-500/6'
            : 'border-white/8 bg-[#151516] hover:border-white/14 hover:bg-[#18181a]'
            }`}>
            <div className="flex items-start gap-3">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-white">
                    {faviconUrl ? (
                        <img
                            src={faviconUrl}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <span className="text-sm font-black text-gray-900">{source.name.charAt(0)}</span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <h3 className="truncate text-[15px] font-black leading-tight text-white">{source.name}</h3>
                        <LanguageBadge source={source} />
                        {source.type === 'community' && (
                            <span className="rounded bg-violet-400/12 px-1.5 py-0.5 text-[9px] font-black text-violet-300">
                                Community
                            </span>
                        )}
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-[12px] font-bold leading-relaxed text-gray-400">
                        {source.description}
                    </p>

                    <a
                        href={source.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-black text-blue-400 hover:text-blue-300"
                    >
                        <span className="truncate">{hostname} · {source.frequency}</span>
                        <HiOutlineArrowTopRightOnSquare className="text-[12px]" />
                    </a>
                </div>

                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className={`flex h-8.5 w-8.5 items-center justify-center rounded-[10px] border transition-all ${isMenuOpen
                            ? 'border-white/18 bg-white/10 text-white'
                            : 'border-white/8 bg-[#111827]/70 text-gray-300 hover:border-blue-400/35 hover:text-white'
                            }`}
                        title="เพิ่มเข้า Post List"
                    >
                        <HiOutlinePlus className={`text-lg transition-transform ${isMenuOpen ? 'rotate-45' : ''}`} />
                    </button>

                    {isMenuOpen && (
                        <>
                            <button
                                type="button"
                                aria-label="ปิดเมนู"
                                className="fixed inset-0 z-30 cursor-default"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0f0f10]/98 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                                <div className="border-b border-white/7 px-3 pb-2 text-[9px] font-black uppercase tracking-widest text-blue-400">
                                    Add to Post List
                                </div>
                                <div className="max-h-56 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {isFetchingPostLists ? (
                                        <div className="px-3 py-4">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                        </div>
                                    ) : postLists.length > 0 ? (
                                        postLists.map((list) => {
                                            const isMember = isSourceMemberOfList(source, list);
                                            const actionKey = `${source.id}-${list.id}`;

                                            return (
                                                <button
                                                    key={list.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onTogglePostList(list);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    disabled={busyPostListKey === actionKey}
                                                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] font-bold text-gray-300 transition-all hover:bg-white/5 hover:text-white disabled:cursor-wait disabled:opacity-60"
                                                >
                                                    <span className="truncate">{list.name}</span>
                                                    {busyPostListKey === actionKey ? (
                                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                                    ) : isMember ? (
                                                        <HiOutlineCheck className="shrink-0 text-sm text-blue-400" />
                                                    ) : null}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="px-3 py-3 text-[12px] font-bold text-gray-500">
                                            ยังไม่มี Post List
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={onToggle}
                disabled={isBusy}
                className={`mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-black transition-all active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 ${isSubscribed
                    ? 'border-blue-400/24 bg-blue-500/10 text-blue-100 hover:bg-blue-500/15'
                    : 'border-white/8 bg-[#111827]/80 text-white hover:border-blue-400/35 hover:bg-blue-600'
                    }`}
            >
                {isBusy ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : isSubscribed ? (
                    <>
                        <HiOutlineCheck className="text-sm" />
                        <span>อยู่ใน Watchlist แล้ว</span>
                    </>
                ) : (
                    <>
                        <HiOutlinePlus className="text-sm" />
                        <span>เพิ่มเข้า Watchlist</span>
                    </>
                )}
            </button>
        </div>
    );
};

const SectionHeader = ({
    title,
    note,
    count,
    th,
}: {
    title: string;
    note: string;
    count: number;
    th?: boolean;
}) => (
    <div className="mb-4 mt-7 flex items-center gap-2.5">
        {th ? (
            <span className="rounded bg-emerald-400/12 px-1.5 py-0.5 text-[10px] font-black text-emerald-300">
                TH
            </span>
        ) : (
            <HiOutlineGlobeAlt className="text-base text-gray-500" />
        )}
        <span className="text-[13px] font-black text-gray-400">{title}</span>
        <span className="hidden text-[11px] font-semibold text-gray-600 sm:inline">· {note}</span>
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[11px] font-black text-gray-600">{count} แหล่ง</span>
    </div>
);

const NewsSourcesTab = ({
    subscribedSources,
    postLists,
    isFetchingPostLists,
    busySourceId,
    busyPostListKey,
    onToggleSource,
    onTogglePostList,
}: NewsSourcesTabProps) => {
    const [activeTopic, setActiveTopic] = useState('all');
    const subscribedIds = useMemo(
        () => new Set(subscribedSources.map((source) => source.id)),
        [subscribedSources],
    );

    const allSources = useMemo(() => Object.values(RSS_CATALOG).flat(), []);
    const thaiSourceCount = useMemo(
        () => allSources.filter((source) => source.lang === 'th').length,
        [allSources],
    );

    const filteredSources = useMemo(() => {
        if (activeTopic === 'all') return sortSourcesForAllView(allSources);
        if (activeTopic === THAI_FILTER_KEY) return allSources.filter((source) => source.lang === 'th');
        return allSources.filter((source) => source.topic === activeTopic);
    }, [activeTopic, allSources]);

    const enSources = filteredSources.filter((source) => source.lang === 'en');
    const thSources = filteredSources.filter((source) => source.lang === 'th');

    const renderSourceCard = (source: RssSource) => (
        <SourceCard
            key={source.id}
            source={source}
            isSubscribed={subscribedIds.has(source.id)}
            isBusy={busySourceId === source.id}
            postLists={postLists}
            isFetchingPostLists={isFetchingPostLists}
            busyPostListKey={busyPostListKey}
            onToggle={() => onToggleSource(source)}
            onTogglePostList={(list) => onTogglePostList(source, list)}
        />
    );

    return (
        <div className="animate-fade-in pt-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                กรองตามหมวด
            </div>

            <div className="mb-6 flex flex-wrap gap-1.5">
                <TopicButton active={activeTopic === 'all'} label="ทั้งหมด" onClick={() => setActiveTopic('all')} />
                <TopicButton
                    active={activeTopic === THAI_FILTER_KEY}
                    label="ข่าวไทย"
                    count={thaiSourceCount}
                    Icon={HiOutlineGlobeAlt}
                    onClick={() => setActiveTopic(THAI_FILTER_KEY)}
                />
                {Object.entries(TOPIC_LABELS).map(([topic, { label, count }]) => (
                    <TopicButton
                        key={topic}
                        active={activeTopic === topic}
                        label={label}
                        count={count}
                        Icon={TOPIC_ICON_MAP[topic] ?? HiOutlineNewspaper}
                        onClick={() => setActiveTopic(topic)}
                    />
                ))}
            </div>

            {enSources.length > 0 && (
                <>
                    <SectionHeader
                        title="แหล่งข่าวต่างประเทศ"
                        note="FORO แปลและสรุปเป็นไทยให้"
                        count={enSources.length}
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                        {enSources.map(renderSourceCard)}
                    </div>
                </>
            )}

            {thSources.length > 0 && (
                <>
                    <SectionHeader
                        title="แหล่งข่าวไทย"
                        note="รวมข่าวไทยไว้ในที่เดียว"
                        count={thSources.length}
                        th
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                        {thSources.map(renderSourceCard)}
                    </div>
                </>
            )}

            {subscribedSources.length > 0 && (
                <div className="mt-9 border-t border-white/8 pt-5">
                    <div className="mb-3 text-[11px] font-black uppercase tracking-wider text-gray-500">
                        รายการใน Watchlist ({subscribedSources.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subscribedSources.map((source) => (
                            <button
                                key={source.id}
                                type="button"
                                onClick={() => onToggleSource(source)}
                                className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-[11px] font-bold text-gray-300 transition-all hover:border-rose-400/25 hover:text-white"
                            >
                                <span>{source.name}</span>
                                <LanguageBadge source={source} />
                                <HiOutlineXMark className="text-xs text-gray-500" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsSourcesTab;
