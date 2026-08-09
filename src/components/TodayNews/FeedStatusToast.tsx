import { AnimatePresence, motion } from 'framer-motion';
import { LuArrowRight, LuRefreshCw } from 'react-icons/lu';
import type { FeedNotice } from '../../interface/todayNews';

type FeedStatusToastProps = {
    feedNotice: FeedNotice | null;
    isGlobal?: boolean;
    onOpenFeed?: () => void;
};

export const FeedStatusToast = ({
    feedNotice,
    isGlobal = false,
    onOpenFeed,
}: FeedStatusToastProps) => (
                    <AnimatePresence>
                        {feedNotice && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                onClick={onOpenFeed}
                                disabled={!onOpenFeed}
                                aria-live="polite"
                                aria-label={`${feedNotice.message}${onOpenFeed ? ' เปิดหน้าฟีดข่าว' : ''}`}
                                className={`home-feed-status-toast is-${feedNotice.variant} ${isGlobal ? 'is-global' : ''}`.trim()}
                            >
                                <span className="home-feed-status-icon" aria-hidden="true">
                                    <LuRefreshCw className={feedNotice.variant === 'loading' ? 'animate-spin' : ''} />
                                </span>
                                <span className="home-feed-status-copy">
                                    <span className="home-feed-status-kicker">FORO</span>
                                    <span className="home-feed-status-message">{feedNotice.message}</span>
                                </span>
                                {onOpenFeed ? (
                                    <span className="home-feed-status-action" aria-hidden="true">
                                        <span>ดูฟีด</span>
                                        <LuArrowRight />
                                    </span>
                                ) : null}
                            </motion.button>
                        )}
                    </AnimatePresence>
);
