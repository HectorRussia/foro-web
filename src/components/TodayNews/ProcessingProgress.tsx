import type { TodayNewsViewModel } from '../../hooks/useTodayNews';

type ProcessingProgressProps = Pick<TodayNewsViewModel, 'isStreaming' | 'progress'>;

export const ProcessingProgress = ({ isStreaming, progress }: ProcessingProgressProps) => (
    <>
                    {/* Processing Progress Status */}
                    {isStreaming && progress.total > 0 && (
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#0a1622]/90 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10">
                            <div className="flex flex-col min-w-25">
                                <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest mb-1">Processing</span>
                                <span className="text-sm font-bold text-gray-200">{progress.current} / {progress.total}</span>
                            </div>
                            <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-linear-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-500 rounded-full"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent w-full animate-progress-shimmer"></div>
                            </div>
                        </div>
                    )}
    </>
);
