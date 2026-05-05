import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';

const PostListPage = () => {
    return (
        <div className="foro-page-shell">
            <Sidebar />
            <div className="foro-center-stage">
                <main className="foro-workspace-main flex justify-center py-6">
                    <div className="w-full max-w-xl">
                        <PostList showBorder={false} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PostListPage;
