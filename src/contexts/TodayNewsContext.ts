import { createContext, useContext } from 'react';
import type { TodayNewsViewModel } from '../hooks/useTodayNews';

export const TodayNewsContext = createContext<TodayNewsViewModel | null>(null);

export const useTodayNews = () => {
    const context = useContext(TodayNewsContext);

    if (!context) {
        throw new Error('useTodayNews must be used within TodayNewsProvider');
    }

    return context;
};
