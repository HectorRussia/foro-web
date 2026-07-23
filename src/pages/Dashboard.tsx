import Sidebar from '../components/Layouts/Sidebar';
import Main from '../components/Layouts/Main';
import PostList from '../components/PostList';

const Dashboard = () => {


    return (
        <div className="foro-page-shell foro-read-page">
            <Sidebar />
            <div className="foro-center-stage">
                <section className="foro-workspace-panel foro-read-workspace">
                    <Main />
                </section>
                <aside className="foro-right-rail">
                    <PostList showBorder={false} />
                </aside>
            </div>
        </div>
    );
};




export default Dashboard;
