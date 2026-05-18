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
        <div className="foro-page-shell">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_30%)]" />
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
