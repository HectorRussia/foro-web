import { LuCopy, LuFileText } from 'react-icons/lu';
import type { ForoFilterSummary } from '../../interface/news';
import { dedupeStrings, normalizeForoFilterSummary, parseForoBullet } from '../../api/todayNews';

export const ForoFilterSummarySkeleton = () => (
    <div className="foro-filter-summary-card foro-filter-summary-skeleton col-span-full" aria-hidden="true">
        <div className="foro-filter-summary-skeleton-header">
            <div className="foro-filter-summary-skeleton-icon foro-filter-summary-shimmer" />
            <div className="foro-filter-summary-skeleton-heading">
                <div className="foro-filter-summary-skeleton-line foro-filter-summary-shimmer w-32" />
                <div className="foro-filter-summary-skeleton-line foro-filter-summary-shimmer w-52" />
            </div>
        </div>
        <div className="foro-filter-summary-skeleton-pill-row">
            <div className="foro-filter-summary-skeleton-pill foro-filter-summary-shimmer" />
            <div className="foro-filter-summary-skeleton-pill foro-filter-summary-shimmer w-100 max-w-full" />
        </div>
        <div className="foro-filter-summary-skeleton-title foro-filter-summary-shimmer" />
        <div className="foro-filter-summary-skeleton-list">
            <div className="foro-filter-summary-skeleton-line foro-filter-summary-shimmer" />
            <div className="foro-filter-summary-skeleton-line foro-filter-summary-shimmer w-10/12" />
            <div className="foro-filter-summary-skeleton-line foro-filter-summary-shimmer w-11/12" />
            <div className="foro-filter-summary-skeleton-line foro-filter-summary-shimmer w-8/12" />
        </div>
    </div>
);

export const ForoFilterSummaryCard = ({
    summary,
    citationLabels = [],
    onCopy,
}: {
    summary: ForoFilterSummary;
    citationLabels?: string[];
    onCopy: () => void;
}) => {
    const normalizedSummary = normalizeForoFilterSummary(summary);
    if (!normalizedSummary) return null;

    const parsedBullets = normalizedSummary.bullets.map((bullet, index) => ({
        ...parseForoBullet(bullet),
        key: `${bullet}-${index}`,
    }));
    const inlineCitationLabels = dedupeStrings(parsedBullets.flatMap(item => item.citations));
    const summaryCitationLabels = dedupeStrings(
        inlineCitationLabels.length > 0 ? inlineCitationLabels : citationLabels,
    );

    return (
        <div className="foro-filter-summary-card col-span-full">
            <div className="foro-filter-summary-glow" aria-hidden="true" />
            <div className="foro-filter-summary-header">
                <div className="foro-filter-summary-brand">
                    <span className="foro-filter-summary-icon">
                        <LuFileText />
                    </span>
                    <span>
                        <span className="foro-filter-summary-kicker">FORO FILTER</span>
                        {normalizedSummary.dateLabel && (
                            <span className="foro-filter-summary-date">{normalizedSummary.dateLabel}</span>
                        )}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onCopy}
                    className="icon-btn-large foro-filter-copy-btn"
                    title="คัดลอกผลลัพธ์"
                >
                    <LuCopy className="text-[14px]" />
                </button>
            </div>

            {(normalizedSummary.outputLabel || normalizedSummary.subtitle) && (
                <div className="foro-filter-summary-pills">
                    {normalizedSummary.outputLabel && <span>{normalizedSummary.outputLabel}</span>}
                    {normalizedSummary.subtitle && <span>{normalizedSummary.subtitle}</span>}
                </div>
            )}

            <h2 className="foro-filter-summary-title">{normalizedSummary.title}</h2>

            {parsedBullets.length > 0 ? (
                <div className="foro-filter-summary-list">
                    {parsedBullets.map(parsed => (
                            <div key={parsed.key} className="foro-filter-summary-item">
                                <span className="foro-filter-summary-item-text">{parsed.text}</span>
                                {parsed.citations.length > 0 && (
                                    <span className="foro-filter-summary-citations">
                                        {parsed.citations.map(citation => (
                                            <span key={`${parsed.text}-${citation}`} className="foro-filter-citation-badge">
                                                {citation}
                                            </span>
                                        ))}
                                    </span>
                                )}
                            </div>
                    ))}
                </div>
            ) : summaryCitationLabels.length > 0 ? (
                <div className="foro-filter-summary-reference-rail" aria-label="FORO Filter references">
                    {summaryCitationLabels.map(citation => (
                        <span key={`summary-reference-${citation}`} className="foro-filter-citation-badge">
                            {citation}
                        </span>
                    ))}
                </div>
            ) : null}

            {normalizedSummary.note && <p className="foro-filter-summary-note">{normalizedSummary.note}</p>}
        </div>
    );
};


