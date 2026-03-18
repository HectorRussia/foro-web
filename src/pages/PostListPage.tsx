import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';

const PostListPage = () => {
    return (
        <div className="flex min-h-screen w-full bg-[#0a0a0b] font-sans text-gray-100 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex overflow-hidden ml-20 lg:ml-80">
                <main className="flex-1 overflow-hidden h-screen bg-[#0a0a0b]">
                    <PostList showBorder={false} />
                </main>
            </div>
        </div>
    );
};

export default PostListPage;
