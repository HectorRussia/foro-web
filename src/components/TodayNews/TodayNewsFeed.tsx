import DashboardCard from '../DashboardCard';
import SkeletonCard from '../SkeletonCard';
import HomeCanvas from '../Canvas/HomeCanvas';
import { LuSparkles } from 'react-icons/lu';
import type { TodayNewsViewModel } from '../../hooks/useTodayNews';
import { LOAD_MORE_SKELETON_COUNT } from '../../api/todayNews';
import { ForoFilterSummaryCard, ForoFilterSummarySkeleton } from './ForoFilterSummary';
import { TodayNewsFeedToolbar } from './TodayNewsFeedToolbar';

type TodayNewsFeedProps = Pick<
    TodayNewsViewModel,
    | 'layoutMode'
    | 'newsResults'
    | 'isStreaming'
    | 'isAiFilterActive'
    | 'displayNews'
    | 'clearAIFilter'
    | 'isAIProcessing'
    | 'aiSummary'
    | 'aiFilterCitationLabels'
    | 'handleCopyAISummary'
    | 'mapToNewsItem'
    | 'categories'
    | 'handleAddNewsToCategory'
    | 'handleDeleteIndividual'
    | 'isLoadingMore'
    | 'canSearchMore'
    | 'nextCursor'
    | 'startBulkAnalysis'
    | 'feedCount'
    | 'isFilterUiActive'
    | 'hasStarted'
    | 'activeFilters'
    | 'handleClear'
    | 'toggleFilter'
>;

export const TodayNewsFeed = ({
    layoutMode,
    newsResults,
    isStreaming,
    isAiFilterActive,
    displayNews,
    clearAIFilter,
    isAIProcessing,
    aiSummary,
    aiFilterCitationLabels,
    handleCopyAISummary,
    mapToNewsItem,
    categories,
    handleAddNewsToCategory,
    handleDeleteIndividual,
    isLoadingMore,
    canSearchMore,
    nextCursor,
    startBulkAnalysis,
    feedCount,
    isFilterUiActive,
    hasStarted,
    activeFilters,
    handleClear,
    toggleFilter,
}: TodayNewsFeedProps) => {
    const feedToolbar = (
        <TodayNewsFeedToolbar
            feedCount={feedCount}
            isFilterUiActive={isFilterUiActive}
            clearAIFilter={clearAIFilter}
            hasStarted={hasStarted}
            displayNews={displayNews}
            activeFilters={activeFilters}
            handleClear={handleClear}
            toggleFilter={toggleFilter}
        />
    );

    return (
                    <div className="root-home-feed-body relative flex-1 overflow-y-auto px-6 pb-8 sm:px-8 lg:px-11 lg:pr-9 scrollbar-hide">
                        {/* News Stream Grid */}
                        <div className={`
                        ${layoutMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-20'
                                : 'flex flex-col space-y-4 pb-20'}
                    `}>
                            {newsResults.length === 0 ? (
                                <>
                                    {isStreaming ? feedToolbar : null}
                                    <div
                                        className={`home-splash ${isStreaming ? 'is-loading' : ''}`.trim()}
                                        onMouseMove={(event) => {
                                            const bounds = event.currentTarget.getBoundingClientRect();
                                            event.currentTarget.style.setProperty('--mx', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
                                            event.currentTarget.style.setProperty('--my', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
                                        }}
                                    >
                                        <HomeCanvas />

                                        {!isStreaming && (
                                            <div className="home-splash-inner">
                                                <h3 className="home-splash-title no-select-ui">
                                                    FORO ติดตามทุกเรื่องที่คุณสนใจ
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : isAiFilterActive && displayNews.length === 0 ? (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/5 rounded-[40px] border border-white/10 text-gray-400 text-center animate-in fade-in">
                                    <LuSparkles className="text-5xl mb-4 text-blue-500/30" />
                                    <h3 className="text-lg font-bold">ไม่พบข่าวที่ตรงกับการคัดกรอง</h3>
                                    <p className="text-sm opacity-60 mt-1">ลองเปลี่ยนคำสั่งใหม่ หรือเช็คจำนวนข่าวทั้งหมด</p>
                                    <button
                                        onClick={clearAIFilter}
                                        className="mt-6 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
                                    >
                                        ล้างการคัดกรอง
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {feedToolbar}

                                    {isAIProcessing ? (
                                        <>
                                            <ForoFilterSummarySkeleton />
                                            {Array.from({ length: LOAD_MORE_SKELETON_COUNT }).map((_, index) => (
                                                <div key={`foro-filter-skeleton-${index}`} className="home-load-more-skeleton animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <SkeletonCard variant={layoutMode} />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {aiSummary && (
                                                <ForoFilterSummaryCard
                                                    summary={aiSummary}
                                                    citationLabels={aiFilterCitationLabels}
                                                    onCopy={handleCopyAISummary}
                                                />
                                            )}

                                            {displayNews.map((res) => (
                                                <div key={res.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <DashboardCard
                                                        post={mapToNewsItem(res)}
                                                        variant={layoutMode}
                                                        categories={categories}
                                                        onAddToCategory={handleAddNewsToCategory}
                                                        onDelete={handleDeleteIndividual}
                                                    />
                                                </div>
                                            ))}

                                            {isLoadingMore && Array.from({ length: LOAD_MORE_SKELETON_COUNT }).map((_, index) => (
                                                <div key={`load-more-skeleton-${index}`} className="home-load-more-skeleton animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <SkeletonCard variant={layoutMode} />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}


                        </div>

                        {canSearchMore && (
                            <div className="home-load-more-wrap animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <button
                                    onClick={() => nextCursor
                                        ? startBulkAnalysis(nextCursor)
                                        : startBulkAnalysis(undefined, { preserveExisting: true })
                                    }

                                    className="home-load-more-btn"
                                    title={nextCursor ? `Next Signal: ${nextCursor}` : 'โหลดเพิ่มเติม'}
                                >
                                    โหลดเพิ่มเติม
                                </button>
                            </div>
                        )}
                    </div>
    );
};
