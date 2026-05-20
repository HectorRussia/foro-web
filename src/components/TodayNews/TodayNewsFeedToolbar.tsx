import { LuEraser, LuFilter, LuX } from 'react-icons/lu';
import type { NewsResult } from '../../interface/news';
import type { TodayNewsSortFilter } from '../../interface/todayNews';

type TodayNewsFeedToolbarProps = {
    feedCount: number;
    isFilterUiActive: boolean;
    clearAIFilter: () => void;
    hasStarted: boolean;
    displayNews: NewsResult[];
    activeFilters: string[];
    handleClear: () => void;
    toggleFilter: (filter: TodayNewsSortFilter) => void;
};

export const TodayNewsFeedToolbar = ({
    feedCount,
    isFilterUiActive,
    clearAIFilter,
    hasStarted,
    displayNews,
    activeFilters,
    handleClear,
    toggleFilter,
}: TodayNewsFeedToolbarProps) => (

        <div className="col-span-full feed-section-header root-feed-section-header home-feed-toolbar">
            <div className="feed-section-title-row">
                <h3 className="section-title">
                    โพสต์ล่าสุด
                </h3>
                <span className="home-feed-count-badge">{`${feedCount} \u0e01\u0e32\u0e23\u0e4c\u0e14`}</span>
                {isFilterUiActive && (
                    <button
                        type="button"
                        onClick={clearAIFilter}
                        className="ai-filtered-badge root-ai-filtered-badge"
                        title="ล้างตัวกรอง"
                    >
                        <LuFilter className="text-[12px]" />
                        <span>FORO FILTER</span>
                        <LuX className="text-[12px]" />
                    </button>
                )}
            </div>
            <div className="feed-section-filters">
                {hasStarted && displayNews.length > 0 && !isFilterUiActive && (
                    <button
                        onClick={handleClear}
                        className="icon-btn-large header-secondary-action root-feed-maintenance-action"
                        title={'\u0e25\u0e49\u0e32\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14'}
                    >
                        <LuEraser className="text-[15px]" />
                    </button>
                )}
                <button
                    onClick={() => toggleFilter('mostView')}
                    className={`btn-pill root-sort-pill ${activeFilters.includes('mostView') ? 'active' : ''}`.trim()}
                >
                    ยอดวิว
                </button>
                <button
                    onClick={() => toggleFilter('mostLiked')}
                    className={`btn-pill root-sort-pill ${activeFilters.includes('mostLiked') ? 'active' : ''}`.trim()}
                >
                    เอนเกจเมนต์
                </button>
            </div>
        </div>
);
