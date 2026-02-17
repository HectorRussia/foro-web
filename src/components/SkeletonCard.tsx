
interface SkeletonCardProps {
    variant?: 'grid' | 'compact' | 'list';
}

const SkeletonCard = ({ variant = 'grid' }: SkeletonCardProps) => {
    const isCompact = variant === 'compact';
    const isGrid = variant === 'grid';

    return (
        <div className={`animate-pulse bg-[#0f172a] border border-[#1e293b] rounded-2xl flex flex-col relative shadow-lg overflow-hidden
            ${isCompact ? 'p-4' : 'p-6'}
            ${isGrid ? 'h-full justify-between' : ''}
        `}>
            {/* Header Area */}
            <div className={`flex items-start justify-between ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-center gap-3 w-full">
                    {/* Profile Circle */}
                    <div className={`bg-slate-800 rounded-full shrink-0 ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`} />

                    <div className="min-w-0 flex-1 space-y-2">
                        {/* Title Line */}
                        <div className={`h-4 bg-slate-800 rounded-md w-3/4 ${isCompact ? 'h-3.5' : 'h-4'}`} />
                        {!isCompact && (
                            /* Date Line */
                            <div className="h-2 bg-slate-800 rounded-md w-1/4" />
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className={`space-y-2 grow ${isCompact ? 'mb-3' : 'mb-4'}`}>
                <div className="h-4 bg-slate-800 rounded-md w-full" />
                <div className="h-4 bg-slate-800 rounded-md w-11/12" />
                {isGrid && (
                    <>
                        <div className="h-4 bg-slate-800 rounded-md w-full" />
                        <div className="h-4 bg-slate-800 rounded-md w-10/12" />
                    </>
                )}
                {!isGrid && !isCompact && (
                    <div className="h-4 bg-slate-800 rounded-md w-8/12" />
                )}
            </div>

            {/* Tags Placeholder */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-slate-800 rounded-full w-16" />
                <div className="h-6 bg-slate-800 rounded-full w-20" />
            </div>

            {/* Footer Buttons */}
            <div className={`flex items-center gap-2 border-t border-[#1e293b] ${isCompact ? 'pt-2 mt-auto' : 'pt-4 mt-auto'}`}>
                <div className={`flex-1 bg-slate-800 rounded-lg ${isCompact ? 'h-7' : 'h-10'}`} />
                <div className={`flex-1 bg-slate-800 rounded-lg ${isCompact ? 'h-7' : 'h-10'}`} />
            </div>

            {/* Shine effect overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    );
};

export default SkeletonCard;
