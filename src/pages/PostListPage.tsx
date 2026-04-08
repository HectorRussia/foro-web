import Sidebar from '../components/Layouts/Sidebar';
import PostList from '../components/PostList';

const PostListPage = () => {
    return (
        <div className="flex min-h-screen w-full gap-3 bg-[#121212] p-3 font-sans text-gray-100 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto h-screen bg-[#121212] flex justify-center py-6">
                    <div className="w-full max-w-xl">
                        <PostList showBorder={false} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PostListPage;
