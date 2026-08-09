import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodayNews } from '../../contexts/TodayNewsContext';
import type { FeedNotice } from '../../interface/todayNews';
import { FeedStatusToast } from './FeedStatusToast';

export const GlobalNewsSyncStatus = () => {
    const navigate = useNavigate();
    const { backgroundJob, feedNotice } = useTodayNews();
    const visibleNotice = useMemo<FeedNotice | null>(() => {
        if (backgroundJob.status === 'running') {
            return {
                variant: 'loading',
                message: backgroundJob.message,
            };
        }

        return feedNotice;
    }, [backgroundJob.message, backgroundJob.status, feedNotice]);

    return (
        <FeedStatusToast
            feedNotice={visibleNotice}
            isGlobal
            onOpenFeed={() => navigate('/today-news')}
        />
    );
};
