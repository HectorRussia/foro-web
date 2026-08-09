import { useEffect } from 'react';
import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';
import {
    ForoFilterModal,
    ProcessingProgress,
    TodayNewsFeed,
    TodayNewsHeader,
    TodayNewsInlineStyles,
} from '../components/TodayNews';
import { useTodayNews } from '../contexts/TodayNewsContext';

const TodayNews = () => {
    const todayNews = useTodayNews();
    const { dismissTransientUi } = todayNews;

    useEffect(() => () => {
        dismissTransientUi();
    }, [dismissTransientUi]);

    return (
        <div className="foro-page-shell foro-home-page">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel foro-home-workspace">
                    <TodayNewsHeader {...todayNews} />
                    <ForoFilterModal {...todayNews} />
                    <TodayNewsFeed {...todayNews} />
                    <ProcessingProgress {...todayNews} />
                    <TodayNewsInlineStyles />
                </section>
                <aside className="foro-right-rail">
                    <PostList
                        activeId={todayNews.selectedPostList?.id}
                        onSelect={(list) => todayNews.setSelectedPostList(list)}
                    />
                </aside>
            </div>
        </div>
    );
};

export default TodayNews;
