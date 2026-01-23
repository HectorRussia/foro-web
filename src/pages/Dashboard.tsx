import Sidebar from '../components/Layouts/Sidebar';
import Main from '../components/Layouts/Main';

const Dashboard = () => {


    return (
        <div className="flex min-h-screen w-full bg-[#030e17] font-sans text-gray-100">
            <Sidebar />
            <Main />
        </div>
    );
};




export default Dashboard;
