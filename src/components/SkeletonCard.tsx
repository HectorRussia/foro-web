interface SkeletonCardProps {
    variant?: 'grid' | 'compact' | 'list';
}

const SkeletonBlock = ({ className }: { className: string }) => (
    <div className={`rounded-full bg-white/8 ${className}`} />
);

const SkeletonCard = ({ variant = 'grid' }: SkeletonCardProps) => {
    const isCompact = variant === 'compact';

    return (
        <div
            className={`feed-card feed-card-skeleton-shimmer animate-pulse relative flex h-full min-h-[168px] flex-col overflow-hidden font-card ${
                isCompact ? 'p-4' : 'p-5 md:p-6'
            }`}
        >
            <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3.5">
                    <div className={`${isCompact ? 'h-10 w-10' : 'h-12 w-12'} shrink-0 rounded-[14px] bg-white/8`} />
                    <div className="min-w-0 space-y-2">
                        <SkeletonBlock className={`${isCompact ? 'h-3 w-24' : 'h-3.5 w-[8.5rem]'}`} />
                        <SkeletonBlock className={`${isCompact ? 'h-2.5 w-[4.5rem]' : 'h-3 w-24'} bg-white/6`} />
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <SkeletonBlock className={`${isCompact ? 'h-6 w-10' : 'h-7 w-14'} bg-white/7`} />
                    <SkeletonBlock className={`${isCompact ? 'h-6 w-10' : 'h-7 w-14'} bg-white/7`} />
                </div>
            </div>

            <div className={`relative z-10 flex grow gap-4 ${isCompact ? 'mb-4' : 'mb-5'}`}>
                <div className={`${isCompact ? 'h-20 w-20' : 'h-28 w-28'} shrink-0 rounded-[18px] bg-white/8`} />

                <div className="min-w-0 flex-1 space-y-3 pt-1">
                    <SkeletonBlock className="h-3.5 w-[92%]" />
                    <SkeletonBlock className="h-3.5 w-full bg-white/7" />
                    <SkeletonBlock className="h-3.5 w-[72%] bg-white/7" />
                    {!isCompact ? <SkeletonBlock className="h-3.5 w-[48%] bg-white/6" /> : null}
                </div>
            </div>

            <div className="relative z-10 mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-3 w-10 bg-white/7" />
                    <SkeletonBlock className="h-3 w-10 bg-white/7" />
                    <SkeletonBlock className="h-3 w-10 bg-white/7" />
                </div>

                <div className={`${isCompact ? 'h-8 w-24' : 'h-9 w-[8.5rem]'} shrink-0 rounded-full bg-white/8`} />
            </div>
        </div>
    );
};

export default SkeletonCard;
