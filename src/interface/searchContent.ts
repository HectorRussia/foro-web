export type ContentSearchRequest = {
    query: string;
    max_results?: number;
    include_video_only?: boolean;
};

export type ContentSearchSummary = {
    title: string;
    subtitle: string;
    date_range: string;
    main_summary: string;
    bullet_points: string[];
    foro_note: string | null;
    confidence_score: number | null;
};

export type ContentResultItem = {
    id: number | null;
    ref_code: string;
    title: string;
    username: string;
    content: string;
    url: string | null;
    tweet_id: string | null;
    tweet_profile_pic: string | null;
    created_at: string | null;
    has_video: boolean;
    media_urls?: string[] | null;
    media_type?: string | null;
    view_count: number;
    like_count: number;
    retweet_count: number;
    reply_count: number;
};

export type EvidenceClaim = {
    claim: string;
    supporting_sources: string[];
    confidence: number;
};

export type EvidencePack = {
    key_claims: EvidenceClaim[];
    conflicting_claims: string[];
    gaps: string[];
};

export type FactSheet = {
    verified_facts: string[];
    reported_claims: string[];
    named_entities: string[];
    source_count: number;
};

export type ContentSearchResponse = {
    success: boolean;
    query: string;
    intent: string;
    total_results: number;
    summary: ContentSearchSummary | null;
    results: ContentResultItem[];
    evidence_pack: EvidencePack | null;
    fact_sheet: FactSheet | null;
    search_plan: Record<string, any> | null;
    timings: Record<string, number> | null;
};

export type SearchMode = "search" | "save";