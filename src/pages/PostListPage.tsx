import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';

const PostListPage = () => {
    return (
        <div className="flex min-h-screen w-full bg-[#0a0a0b] font-sans text-gray-100 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex overflow-hidden ml-20 lg:ml-60">
                <main className="flex-1 overflow-y-auto h-screen bg-[#0a0a0b] flex justify-center py-6">
                    <div className="w-full max-w-xl">
                        <PostList showBorder={false} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PostListPage;
