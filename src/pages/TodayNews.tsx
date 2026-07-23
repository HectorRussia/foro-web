import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';
import {
    FeedStatusToast,
    ForoFilterModal,
    ProcessingProgress,
    TodayNewsFeed,
    TodayNewsHeader,
    TodayNewsInlineStyles,
} from '../components/TodayNews';
import { useTodayNews } from '../hooks/useTodayNews';

const TodayNews = () => {
    const todayNews = useTodayNews();

    return (
        <div className="foro-page-shell foro-home-page">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel foro-home-workspace">
                    <FeedStatusToast feedNotice={todayNews.feedNotice} />
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
