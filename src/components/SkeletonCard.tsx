
interface SkeletonCardProps {
    variant?: 'grid' | 'compact' | 'list';
}

const SkeletonCard = ({ variant = 'grid' }: SkeletonCardProps) => {
    const isCompact = variant === 'compact';
    const isGrid = variant === 'grid';

    return (
        <div className={`feed-card feed-card-skeleton-shimmer animate-pulse flex flex-col relative overflow-hidden
            ${isCompact ? 'p-4' : 'p-6'}
            ${isGrid ? 'h-full justify-between' : ''}
        `}>
            {/* Header Area */}
            <div className={`flex items-start justify-between ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div className="flex items-center gap-3 w-full">
                    {/* Profile Circle */}
                    <div className={`bg-white/8 rounded-full shrink-0 ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`} />

                    <div className="min-w-0 flex-1 space-y-2">
                        {/* Title Line */}
                        <div className={`h-4 bg-white/8 rounded-md w-3/4 ${isCompact ? 'h-3.5' : 'h-4'}`} />
                        {!isCompact && (
                            /* Date Line */
                            <div className="h-2 bg-white/8 rounded-md w-1/4" />
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className={`space-y-2 grow ${isCompact ? 'mb-3' : 'mb-4'}`}>
                <div className="h-4 bg-white/8 rounded-md w-full" />
                <div className="h-4 bg-white/8 rounded-md w-11/12" />
                {isGrid && (
                    <>
                        <div className="h-4 bg-white/8 rounded-md w-full" />
                        <div className="h-4 bg-white/8 rounded-md w-10/12" />
                    </>
                )}
                {!isGrid && !isCompact && (
                    <div className="h-4 bg-white/8 rounded-md w-8/12" />
                )}
            </div>

            {/* Interaction Stats Placeholder */}
            <div className={`flex items-center gap-4 mb-4 ${isCompact ? 'px-1' : ''}`}>
                <div className="flex items-center gap-1.5 w-12 h-3 bg-white/8 rounded-md" />
                <div className="flex items-center gap-1.5 w-12 h-3 bg-white/8 rounded-md" />
                <div className="flex items-center gap-1.5 w-12 h-3 bg-white/8 rounded-md" />
                <div className="flex items-center gap-1.5 w-12 h-3 bg-white/8 rounded-md ml-auto" />
            </div>

            {/* Tags Placeholder */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-white/8 rounded-full w-16" />
                <div className="h-6 bg-white/8 rounded-full w-20" />
            </div>

            {/* Footer Buttons */}
            <div className={`flex items-center gap-2 border-t border-white/5 ${isCompact ? 'pt-2 mt-auto' : 'pt-4 mt-auto'}`}>
                <div className={`flex-1 bg-white/8 rounded-lg ${isCompact ? 'h-7' : 'h-10'}`} />
                <div className={`flex-1 bg-white/8 rounded-lg ${isCompact ? 'h-7' : 'h-10'}`} />
            </div>
        </div>
    );
};

export default SkeletonCard;
