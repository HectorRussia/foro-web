import Sidebar from '../components/Layouts/Sidebar';
import Main from '../components/Layouts/Main';
import PostList from '../components/PostList';

const Dashboard = () => {


    return (
        <div className="flex min-h-screen w-full bg-[#0a0a0b] font-sans text-gray-100">
            <Sidebar />
            <div className="flex-1 flex overflow-hidden ml-20 lg:ml-60">
                <Main />
                <div className="hidden xl:block  shrink-0 border-l border-white/5">
                    <PostList showBorder={false} />
                </div>
            </div>
        </div>
    );
};




export default Dashboard;
