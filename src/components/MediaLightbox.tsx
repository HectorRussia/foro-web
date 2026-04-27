import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

interface MediaLightboxProps {
    urls: string[];
    mediaType: string | null | undefined;
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    tweetUrl?: string;
}

const MediaLightbox = ({ urls, mediaType, currentIndex, onClose, onPrev, onNext, tweetUrl }: MediaLightboxProps) => {
    const isVideo = mediaType === 'video' || mediaType === 'animated_gif';
    const total = urls.length;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft' && total > 1) onPrev();
        if (e.key === 'ArrowRight' && total > 1) onNext();
    }, [onClose, onPrev, onNext, total]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    const currentUrl = urls[currentIndex];

    return createPortal(
        <AnimatePresence>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-9999 bg-black/92 backdrop-blur-xl flex items-center justify-center"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/8 border border-white/10 text-white hover:bg-white/15 transition-all"
                >
                    <HiOutlineXMark className="text-xl" />
                </button>

                {/* Media Content */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex items-center justify-center"
                    style={{ maxWidth: '90vw', maxHeight: '85vh' }}
                >
                    {/* Prev Arrow — on image */}
                    {total > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 border border-white/15 text-white hover:bg-black/75 transition-all shadow-lg"
                        >
                            <HiOutlineChevronLeft className="text-base" />
                        </button>
                    )}

                    {/* Next Arrow — on image */}
                    {total > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 border border-white/15 text-white hover:bg-black/75 transition-all shadow-lg"
                        >
                            <HiOutlineChevronRight className="text-base" />
                        </button>
                    )}

                    {/* Counter — on image top */}
                    {total > 1 && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/55 border border-white/10 text-white text-[10px] font-bold tracking-widest z-10">
                            {currentIndex + 1} / {total}
                        </div>
                    )}
                    {isVideo ? (
                        <a
                            href={tweetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group block"
                        >
                            <img
                                src={currentUrl}
                                alt="video thumbnail"
                                className="block w-auto h-auto object-contain rounded-2xl"
                                style={{ maxWidth: '90vw', maxHeight: '80vh', minWidth: 200, minHeight: 120 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 group-hover:bg-black/45 transition-colors">
                                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 border border-white/20 backdrop-blur-sm shadow-2xl group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1 text-white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                                {mediaType === 'animated_gif' ? 'GIF' : 'Video'} · ดูบน X
                            </div>
                        </a>
                    ) : (
                        <img
                            src={currentUrl}
                            alt={`media ${currentIndex + 1}`}
                            className="block w-auto h-auto object-contain rounded-2xl shadow-2xl"
                            style={{ maxWidth: '90vw', maxHeight: '80vh', minWidth: 200, minHeight: 120 }}
                        />
                    )}

                    {/* Dot indicators — on image bottom */}
                    {total > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                            {urls.map((_, i) => (
                                <div
                                    key={i}
                                    className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

export default MediaLightbox;
