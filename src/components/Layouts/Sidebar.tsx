import Navbar from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();
    return (

        <aside className="w-20 lg:w-80 shrink-0 bg-[#020a11] border-r border-[#1e293b] flex flex-col items-center lg:items-stretch py-6 px-2 lg:px-4 fixed h-full z-20">
            {/* Logo Area */}
            <div className="mb-8 flex justify-center lg:justify-start px-2">
                {/* <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20"> */}
                {/*  <span className="font-bold text-2xl text-white">F</span> */}
                <img
                    src="/images/LOGO-FORO/FORO_TP_W.png"
                    alt="Foro Logo"
                    className="w-1/2 rounded-xl"
                />
                {/*   </div> */}
            </div>

            <Navbar />

            {/* User Profile (Bottom) */}
            <div className="mt-auto px-2 py-4">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1e293b] cursor-pointer transition-colors">
                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold">{user?.name[0].toLocaleUpperCase()}</div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-base font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar