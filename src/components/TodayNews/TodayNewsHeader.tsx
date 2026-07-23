import type { Dispatch, SetStateAction } from 'react';
import { HiOutlineArrowUturnLeft } from 'react-icons/hi2';
import { LuRefreshCw } from 'react-icons/lu';
import type { TodayNewsViewModel } from '../../hooks/useTodayNews';

type TodayNewsHeaderProps = Pick<
    TodayNewsViewModel,
    | 'selectedPostList'
    | 'activeListStyle'
    | 'activeListName'
    | 'hasStarted'
    | 'isRestorable'
    | 'handleRestore'
    | 'isAIProcessing'
    | 'visibleHomeQuickPresets'
    | 'isFilterUiActive'
    | 'selectedPresetId'
    | 'newsResults'
    | 'setAiPrompt'
    | 'setSelectedPresetId'
    | 'handleAIFilter'
    | 'aiFilterRef'
    | 'openForoFilter'
    | 'isAIFilterOpen'
    | 'isAiFilterActive'
    | 'isStreaming'
    | 'startBulkAnalysis'
    | 'stopStream'
>;

export const TodayNewsHeader = ({
    selectedPostList,
    activeListStyle,
    activeListName,
    hasStarted,
    isRestorable,
    handleRestore,
    isAIProcessing,
    visibleHomeQuickPresets,
    isFilterUiActive,
    selectedPresetId,
    newsResults,
    setAiPrompt,
    setSelectedPresetId,
    handleAIFilter,
    aiFilterRef,
    openForoFilter,
    isAIFilterOpen,
    isAiFilterActive,
    isStreaming,
    startBulkAnalysis,
    stopStream,
}: TodayNewsHeaderProps & {
    setAiPrompt: Dispatch<SetStateAction<string>>;
    setSelectedPresetId: Dispatch<SetStateAction<number | null>>;
}) => (
    <>
                    <header className="root-home-header">
                        <div className="root-home-title-stack">
                            <h1 className="root-home-title">
                                หน้าหลัก
                            </h1>
                            <span className="root-home-subtitle">
                                WATCHLIST FEED
                            </span>
                        </div>

                        <div className="relative z-10">
                            <div className="home-control-panel root-home-control-panel">

                                {/* Left Section: Trash or Back or Empty */}
                                <div
                                    className={`home-selected-list-bar ${selectedPostList ? 'is-active-list home-active-list-accent' : ''}`.trim()}
                                    style={activeListStyle}
                                >
                                    <div className="home-selected-list-bar-copy">
                                        <span className="home-selected-list-bar-text">{activeListName}</span>
                                    </div>
                                    {!hasStarted && isRestorable ? (
                                        <button
                                            onClick={handleRestore}
                                            className="icon-btn-large header-secondary-action root-home-maintenance-action"
                                            title="ย้อนกลับ"
                                        >
                                            <HiOutlineArrowUturnLeft className="text-lg" />
                                        </button>
                                    ) : null}
                                </div>

                                {/* Right Section: Search/AI/Sync */}
                                <div className={`home-ai-filter-cluster root-home-ai-filter-cluster ${isAIProcessing ? 'is-filtering' : ''}`.trim()}>
                                    <div className="home-ai-quick-presets">
                                        {visibleHomeQuickPresets.map(preset => {
                                            const isActive = isFilterUiActive && selectedPresetId === preset.presetId;
                                            const isDisabled = newsResults.length === 0 || isAIProcessing;

                                            return (
                                                <button
                                                    key={preset.key}
                                                    onClick={() => {
                                                        if (isDisabled) return;
                                                        setAiPrompt(preset.label);
                                                        setSelectedPresetId(preset.presetId);
                                                        handleAIFilter(preset.label);
                                                    }}
                                                    disabled={isDisabled}
                                                    className={`home-ai-quick-preset-btn ${isActive ? 'is-active' : ''}`.trim()}
                                                >
                                                    {preset.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="relative" ref={aiFilterRef}>
                                        <button
                                            onClick={openForoFilter}
                                            disabled={isAIProcessing}
                                            className={`btn-pill home-ai-filter-btn root-home-filter-btn ${isAIFilterOpen ? 'active' : ''} ${isAIProcessing ? 'is-filtering' : ''} ${isFilterUiActive ? 'has-active-result' : ''}`.trim()}
                                        >
                                            <span className={`home-ai-filter-btn-signal ${isFilterUiActive || isAIFilterOpen ? 'is-visible' : ''} ${isAIProcessing ? 'is-spinning' : ''} ${isAiFilterActive ? 'is-active' : ''}`.trim()} aria-hidden="true" />
                                            <span className="home-ai-filter-btn-label">{isAIProcessing ? 'กำลังคัดการ์ด' : 'FORO Filter'}</span>
                                        </button>
                                    </div>

                                    {!isStreaming ? (
                                        <button
                                            onClick={() => startBulkAnalysis()}
                                            disabled={isStreaming}
                                            className="btn-pill primary root-home-sync-btn"
                                        >
                                            <LuRefreshCw className={`text-[15px] ${isStreaming ? 'animate-spin' : ''}`} />
                                            <span>ฟีดข้อมูล</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopStream}
                                            className="btn-pill root-home-sync-btn is-streaming"
                                        >
                                            <LuRefreshCw className="text-[15px] animate-spin" />
                                            <span>ฟีดข้อมูล</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </header>
    </>
);
