import { AnimatePresence, motion } from 'framer-motion';
import { LuRefreshCw } from 'react-icons/lu';
import type { FeedNotice } from '../../interface/todayNews';

type FeedStatusToastProps = {
    feedNotice: FeedNotice | null;
};

export const FeedStatusToast = ({ feedNotice }: FeedStatusToastProps) => (
                    <AnimatePresence>
                        {feedNotice && (
                            <motion.div
                                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className={`home-feed-status-toast is-${feedNotice.variant}`}
                            >
                                <span className="home-feed-status-icon" aria-hidden="true">
                                    <LuRefreshCw className={feedNotice.variant === 'loading' ? 'animate-spin' : ''} />
                                </span>
                                <span className="home-feed-status-copy">
                                    <span className="home-feed-status-kicker">FORO</span>
                                    <span className="home-feed-status-message">{feedNotice.message}</span>
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
);
