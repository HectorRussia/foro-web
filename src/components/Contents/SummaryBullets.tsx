import { useMemo, useRef, useState, type ReactNode } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { isAxiosError } from "axios";
import api from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import {
    LuBookmark,
    LuCopy,
    LuExternalLink,
    LuFileText,
    LuRefreshCw,
    LuSearch,
    LuSparkles,
    LuX,
} from "react-icons/lu";
import { FiBarChart } from "react-icons/fi";
import type { ContentResultItem, ContentSearchRequest, ContentSearchResponse, SearchMode } from "../../interface/searchContent";
import { HiOutlineArrowPathRoundedSquare, HiOutlineChartBar, HiOutlineChatBubbleLeft, HiOutlineHeart } from "react-icons/hi2";


dayjs.extend(relativeTime);

const DEFAULT_QUERY = "";
const DEFAULT_LIMIT = 15;

const filters = [
    { label: "ทั้งหมด", value: false },
    { label: "วิดีโอ", value: true },
] as const;

function formatNumber(num: number = 0) {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return `${num}`;
}

function formatRelativeTime(value: string | null) {
    if (!value) return "ล่าสุด";

    const parsed = dayjs(value);
    if (!parsed.isValid()) return "ล่าสุด";

    const diffHours = dayjs().diff(parsed, "hour");
    if (diffHours < 1) return parsed.fromNow(true);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = dayjs().diff(parsed, "day");
    if (diffDays < 30) return `${diffDays}d`;
    return parsed.format("D MMM");
}

function extractRefCodes(text: string) {
    return Array.from(new Set(text.match(/F\d+/g) ?? []));
}

function SummaryBadge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
            {children}
        </span>
    );
}

function LoadingLine({ className }: { className: string }) {
    return <div className={`rounded-full bg-white/5 ${className}`} />;
}

function LoadingPill({ className }: { className: string }) {
    return <div className={`rounded-full bg-white/5 ${className}`} />;
}

function SummaryLoadingSkeleton() {
    return (
        <div className="relative mt-8 overflow-hidden rounded-4xl border border-white/8 bg-[#101114] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,142,255,0.14),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(74,222,128,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_infinite] bg-linear-to-r from-transparent via-white/6 to-transparent" />

            <div className="relative">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#2d8eff]/25 bg-[#2d8eff]/12">
                            <div className="h-6 w-6 rounded-lg bg-[#2d8eff]/30 animate-pulse" />
                        </div>
                        <div className="space-y-2 pt-1">
                            <LoadingLine className="h-3.5 w-36" />
                            <LoadingLine className="h-2.5 w-52" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <LoadingPill className="h-7 w-20" />
                        <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5">
                            <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
                    <div className="rounded-[26px] border border-white/8 bg-white/3 p-5 sm:p-6">
                        <div className="flex items-center gap-2">
                            <LoadingPill className="h-2.5 w-2.5" />
                            <LoadingLine className="h-2.5 w-24" />
                        </div>
                        <div className="mt-5 space-y-3">
                            <LoadingLine className="h-6 w-11/12" />
                            <LoadingLine className="h-6 w-10/12" />
                            <LoadingLine className="h-6 w-9/12" />
                        </div>

                        <div className="mt-6 grid gap-3">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/10 p-3.5"
                                >
                                    <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3fa0ff]/70 shadow-[0_0_16px_rgba(63,160,255,0.35)]" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <LoadingLine className="h-4 w-full" />
                                        <LoadingLine className="h-4 w-11/12" />
                                    </div>
                                    <LoadingPill className="h-6 w-12 shrink-0" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <LoadingLine className="h-9 w-28" />
                            <LoadingLine className="h-9 w-20" />
                            <LoadingLine className="h-9 w-24" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[26px] border border-white/8 bg-white/3 p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <LoadingLine className="h-2.5 w-24" />
                                <LoadingLine className="h-2.5 w-14" />
                            </div>
                            <div className="mt-4 space-y-3">
                                <LoadingLine className="h-4 w-full" />
                                <LoadingLine className="h-4 w-10/12" />
                                <LoadingLine className="h-4 w-9/12" />
                            </div>
                        </div>

                        <div className="rounded-[26px] border border-white/8 bg-white/3 p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <LoadingLine className="h-2.5 w-20" />
                                <LoadingPill className="h-7 w-16" />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div key={idx} className="rounded-2xl border border-white/5 bg-black/10 p-3">
                                        <LoadingLine className="h-3.5 w-16" />
                                        <LoadingLine className="mt-2 h-5 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultCard({
    card,
    onSaveSearch,
}: {
    card: ContentResultItem;
    onSaveSearch: () => void;
}) {
    const mediaUrl = card.media_urls?.[0] ?? null;
    const isMediaCard = Boolean(mediaUrl);
    const mediaLabel =
        card.media_type?.toUpperCase() ||
        (card.has_video ? "VIDEO" : mediaUrl ? "PHOTO" : "TEXT");
    const showMediaBadge = Boolean(mediaUrl);

    return (
        <article className="group flex h-full flex-col rounded-[26px] border border-[#2a6ff5]/55 bg-[#171717] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.32)] transition hover:border-[#2f78ff]/85 hover:bg-[#191919] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
                    <img
                        src={card.tweet_profile_pic || "https://placehold.co/80x80/png"}
                        alt={card.title}
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10 sm:h-11 sm:w-11"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-extrabold leading-none text-white sm:text-[15px]">{card.title}</span>
                            <SummaryBadge>{card.ref_code}</SummaryBadge>
                        </div>
                        <div className="text-xs font-medium text-slate-400">{card.username}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                    {showMediaBadge ? (
                        <span className="rounded-full border border-blue-500/35 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-blue-200">
                            {mediaLabel}
                        </span>
                    ) : null}
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                        {formatRelativeTime(card.created_at)}
                    </span>
                    <button className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/5 hover:text-white">
                        <LuBookmark className="h-3.5 w-3.5" />
                    </button>
                    <a
                        href={card.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-white/5 hover:text-white"
                    >
                        <LuExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>

            <div
                className={[
                    "mt-4 grid gap-4",
                    isMediaCard
                        ? "lg:grid-cols-[112px_minmax(0,1fr)] lg:gap-5"
                        : "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5",
                ].join(" ")}
            >
                {isMediaCard 
                ? 
                (
                    <div className="relative shrink-0">
                        <div className="aspect-square overflow-hidden rounded-[20px] border border-white/10 bg-[#111112] ring-1 ring-white/10">
                            <img
                                src={mediaUrl ?? undefined}
                                alt={card.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full min-h-32.5 flex-col justify-between rounded-[20px] border border-white/8 bg-white/3 p-4 sm:p-4.5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                                Text card
                            </span>
                            <SummaryBadge>{card.ref_code}</SummaryBadge>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="text-sm font-bold text-white">
                                {card.title}
                            </div>
                            <div className="text-xs font-medium text-slate-400">
                                {card.username}
                            </div>
                            <div className="text-xs font-medium text-slate-500">
                                ไม่มีสื่อแนบ แสดงผลแบบแนวนอนเพื่ออ่านง่ายขึ้น
                            </div>
                        </div>
                    </div>
                )}

                <div className="min-w-0">
                    <p className="line-clamp-4 text-[15px] font-semibold leading-7 text-slate-100 sm:text-[16px] sm:leading-7">
                        {card.content}
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-4">
                <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3 text-xs text-slate-400">
                    <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
                        <span className="inline-flex items-center gap-1">
                            <HiOutlineChartBar className="text-sm opacity-60" />
                            {formatNumber(card.view_count)}
                        </span>
                        <span  className="inline-flex items-center gap-1"> 
                            <HiOutlineChatBubbleLeft className="text-sm opacity-60" />
                            {formatNumber(card.reply_count)}
                        </span>
                        <span  className="inline-flex items-center gap-1">
                            <HiOutlineHeart className="text-sm opacity-60" />
                            {formatNumber(card.like_count)}
                        </span>
                        <span  className="inline-flex items-center gap-1">
                            <HiOutlineArrowPathRoundedSquare className="text-sm opacity-60" />
                            {formatNumber(card.retweet_count)}
                        </span>
                    </div>

                    <button
                        onClick={onSaveSearch}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        สร้างคอนเทนต์
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function SummaryBullets() {
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const [includeVideoOnly, setIncludeVideoOnly] = useState(false);
    const [maxResults, setMaxResults] = useState(DEFAULT_LIMIT);
    const [searchResponse, setSearchResponse] = useState<ContentSearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const resultRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const summary = searchResponse?.summary ?? null;
    const evidencePack = searchResponse?.evidence_pack ?? null;
    const factSheet = searchResponse?.fact_sheet ?? null;
    const hasSummaryContent = Boolean(summary);
    const showSummaryPanel = isLoading || Boolean(error) || hasSummaryContent;

    const visibleResults = useMemo(() => {
        const baseResults = searchResponse?.results ?? [];
        return baseResults.filter((item) => (includeVideoOnly ? item.has_video : true));
    }, [includeVideoOnly, searchResponse]);

    const runSearch = async (mode: SearchMode, overrides?: Partial<ContentSearchRequest>) => {
        const nextQuery = (overrides?.query ?? query).trim();
        const nextMaxResults = overrides?.max_results ?? maxResults;
        const nextIncludeVideoOnly = overrides?.include_video_only ?? includeVideoOnly;

        if (!nextQuery) {
            toast.error("กรุณาพิมพ์คำค้นหาก่อน");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post<ContentSearchResponse>(
                mode === "save" ? "/contents/search-and-save" : "/contents/search",
                {
                    query: nextQuery,
                    max_results: nextMaxResults,
                    include_video_only: nextIncludeVideoOnly,
                }
            );

            setSearchResponse(response.data);
            setQuery(response.data.query || nextQuery);

            if (mode === "save") {
                toast.success("บันทึกคอนเทนต์เรียบร้อยแล้ว");
            }
        } catch (err: unknown) {
            const message = isAxiosError(err)
                ? err.response?.data?.detail ||
                  err.response?.data?.message ||
                  err.message ||
                  "ค้นหาคอนเทนต์ไม่สำเร็จ"
                : err instanceof Error
                    ? err.message
                    : "ค้นหาคอนเทนต์ไม่สำเร็จ";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setQuery("");
        setIncludeVideoOnly(false);
        setMaxResults(DEFAULT_LIMIT);
        setSearchResponse(null);
        setError(null);
    };

    const handleQuickSearch = () => {
        void runSearch("search", { max_results: 5 });
    };

    const clearQuery = () => {
        setQuery("");
    };

    const handleSaveSearch = () => {
        void runSearch("save");
    };

    const scrollToResult = (refCode: string) => {
        const target = resultRefs.current[refCode];
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <section className="px-3 pb-6 pt-7 text-center sm:pt-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl">
                    ค้นหาคอนเทนต์
                </h1>
                <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-slate-400 sm:text-base">
                    สำรวจเทรนด์และเจาะลึกข้อมูลจากทั่วโลก
                </p>

                <div className="mx-auto mt-6 w-full max-w-190 rounded-full border border-white/10 bg-[#1a1a1b] px-4 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.34)] sm:px-5 sm:py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full px-2 sm:px-3">
                            <LuSearch className="h-5 w-5 shrink-0 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        void runSearch("search");
                                    }
                                }}
                                className="min-w-0 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500 sm:text-[15px]"
                                placeholder="ค้นหา..."
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2.5 sm:shrink-0">
                            <button
                                type="button"
                                onClick={handleQuickSearch}
                                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
                                title="Quick search"
                            >
                                <LuSparkles className="h-4.5 w-4.5" />
                            </button>
                            <button
                                type="button"
                                onClick={clearQuery}
                                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
                                title="Clear search"
                                disabled={!query}
                            >
                                <LuX className="h-4.5 w-4.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => void runSearch("search")}
                                disabled={isLoading}
                                className="h-11 rounded-full bg-white px-7 text-sm font-extrabold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
                            >
                                {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-4 flex w-full max-w-190 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        {filters.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                    setIncludeVideoOnly(item.value);
                                    void runSearch("search", { include_video_only: item.value });
                                }}
                                className={[
                                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                    includeVideoOnly === item.value
                                        ? "border-[#2f6cff]/70 bg-[#203a68] text-[#dbe8ff] shadow-[0_0_0_1px_rgba(74,126,255,0.22)_inset]"
                                        : "border-white/10 bg-white/0 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
                                ].join(" ")}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 rounded-full border border-white/0 px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <LuRefreshCw className="h-4 w-4" />
                            ล้างผลลัพธ์
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveSearch}
                            disabled={isLoading || !query.trim()}
                            className="inline-flex items-center gap-2 rounded-full border border-[#1f4b82] bg-[#0f1720] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#2f74ca] hover:bg-[#111b28] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <LuBookmark className="h-4 w-4" />
                            บันทึกเป็น Preset
                        </button>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
                {showSummaryPanel ? (
                    <div className="rounded-4xl border border-white/5 bg-[#171718] px-5 py-6 shadow-[0_32px_100px_rgba(0,0,0,0.5)] sm:px-8 sm:py-8">
                        {hasSummaryContent ? (
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#2d8eff] text-white shadow-[0_0_30px_rgba(45,142,255,0.3)]">
                                        <LuFileText className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <div className="text-sm font-black tracking-wider text-[#2d8eff]">
                                            FORO SUMMARY
                                        </div>
                                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                            {searchResponse?.intent ? `${searchResponse.intent} digest` : "Editorial digest from search"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {searchResponse?.total_results !== undefined ? (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                                            {searchResponse.total_results} results
                                        </span>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => void runSearch("search")}
                                        className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                        title="Refresh"
                                    >
                                        <LuCopy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {isLoading ? (
                            <SummaryLoadingSkeleton />
                        ) : error ? (
                            <div className="mt-8 rounded-3xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
                                {error}
                            </div>
                        ) : summary ? (
                            <>
                                <div className="mt-8">
                                    <h2 className="text-[22px] font-extrabold leading-tight text-white sm:text-2xl">
                                        {summary.title}
                                    </h2>
                                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        {summary.subtitle}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {summary.date_range}
                                    </p>
                                    <p className="mt-6 text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
                                        {summary.main_summary}
                                    </p>

                                    <ul className="mt-8 space-y-5">
                                        {summary.bullet_points.map((text, index) => {
                                            const refCodes = extractRefCodes(text);
                                            return (
                                                <li key={`${index}-${text}`} className="flex items-start gap-3.5">
                                                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#3fa0ff] shadow-[0_0_12px_rgba(63,160,255,0.5)]" />
                                                    <div className="flex flex-wrap items-baseline gap-2.5">
                                                        <p className="text-base font-bold leading-relaxed text-slate-200">
                                                            {text}
                                                        </p>
                                                        {refCodes.map((code) => (
                                                            <button
                                                                key={code}
                                                                type="button"
                                                                onClick={() => scrollToResult(code)}
                                                                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300 transition hover:border-[#3fa0ff]/40 hover:text-white"
                                                            >
                                                                {code}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="mt-10 border-t border-white/5 pt-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-sky-400/40 text-[10px] shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                                                ✓
                                            </span>
                                            {summary.foro_note || "สรุปโดย FORO อ้างอิงจากผลการค้นหา"}
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-full bg-[#0d2a1d] px-4 py-2 text-[13px] font-bold text-[#4ade80] ring-1 ring-[#4ade80]/20">
                                            <FiBarChart className="h-3.5 w-3.5" />
                                            อัตราความมั่นยำ (Confidence){" "}
                                            {summary.confidence_score !== null
                                                ? `${Math.round(summary.confidence_score * 100)}%`
                                                : "N/A"}
                                        </div>
                                    </div>
                                </div>

                                {evidencePack || factSheet ? (
                                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                                        {evidencePack ? (
                                            <div className="rounded-3xl border border-white/8 bg-[#111112] p-5">
                                                <div className="text-xs font-black tracking-[0.2em] text-slate-500">
                                                    EVIDENCE PACK
                                                </div>
                                                <div className="mt-4 space-y-4 text-sm text-slate-300">
                                                    <div>
                                                        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                                                            Key claims
                                                        </div>
                                                        <div className="space-y-3">
                                                            {evidencePack.key_claims.slice(0, 3).map((claim) => (
                                                                <div key={claim.claim} className="rounded-2xl border border-white/5 bg-white/3 px-4 py-3">
                                                                    <div className="font-semibold text-slate-100">{claim.claim}</div>
                                                                    <div className="mt-1 text-xs text-slate-500">
                                                                        Confidence {Math.round(claim.confidence * 100)}%
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {evidencePack.gaps.length > 0 ? (
                                                        <div>
                                                            <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                                                                Gaps
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {evidencePack.gaps.slice(0, 3).map((gap) => (
                                                                    <li key={gap} className="rounded-xl border border-white/5 bg-white/3 px-3 py-2">
                                                                        {gap}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}

                                        {factSheet ? (
                                            <div className="rounded-3xl border border-white/8 bg-[#111112] p-5">
                                                <div className="text-xs font-black tracking-[0.2em] text-slate-500">
                                                    FACT SHEET
                                                </div>
                                                <div className="mt-4 space-y-4 text-sm text-slate-300">
                                                    <div>
                                                        <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                                                            Verified facts
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {factSheet.verified_facts.slice(0, 3).map((fact) => (
                                                                <li key={fact} className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2">
                                                                    {fact}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {factSheet.named_entities.slice(0, 5).map((entity) => (
                                                            <span key={entity} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                                                                {entity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                ) : null}

                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    {searchResponse && visibleResults.length > 0 ? (
                        visibleResults.map((card) => (
                            <div
                                key={card.ref_code}
                                ref={(node) => {
                                    resultRefs.current[card.ref_code] = node;
                                }}
                            >
                                <ResultCard
                                    card={card}
                                    onSaveSearch={handleSaveSearch}
                                />
                            </div>
                        ))
                    ) : searchResponse ? (
                        <div className="col-span-full rounded-4xl border border-white/5 bg-[#151516] px-6 py-16 text-center text-slate-400">
                            ไม่พบรายการที่ตรงกับตัวกรองนี้
                        </div>
                    ) : null}
                </div>
            </section>
        </>
    );
}
