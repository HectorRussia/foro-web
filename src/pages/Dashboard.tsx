import Sidebar from '../components/Layouts/Sidebar';
import Main from '../components/Layouts/Main';
import PostList from '../components/PostList';

const Dashboard = () => {


    return (
        <div className="flex min-h-screen w-full gap-3 bg-[#0a0a0b] p-3 font-sans text-gray-100">
            <Sidebar />
            <div className="flex flex-1 min-w-0 gap-3">
                <section className="flex min-w-0 flex-1 overflow-hidden rounded-[32px] border border-white/5 bg-[#111112] shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
                    <Main />
                </section>
                <aside className="hidden xl:flex w-[320px] shrink-0 overflow-hidden rounded-[32px] border border-white/5 bg-[#111112] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                    <PostList showBorder={false} />
                </aside>
            </div>
        </div>
    );
};




export default Dashboard;
