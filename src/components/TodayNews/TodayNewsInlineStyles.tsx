export const TodayNewsInlineStyles = () => (
    <style>{`
        @keyframes progress-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-progress-shimmer {
            animation: progress-shimmer 2s infinite linear;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
);