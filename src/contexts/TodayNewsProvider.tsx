import type { ReactNode } from 'react';
import { useTodayNewsController } from '../hooks/useTodayNews';
import { TodayNewsContext } from './TodayNewsContext';

export const TodayNewsProvider = ({ children }: { children: ReactNode }) => {
    const todayNews = useTodayNewsController();

    return (
        <TodayNewsContext.Provider value={todayNews}>
            {children}
        </TodayNewsContext.Provider>
    );
};
