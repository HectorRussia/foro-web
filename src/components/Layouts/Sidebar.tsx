import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { LuLogOut } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="w-20 lg:w-80 shrink-0 bg-[#080809] border-r border-white/5 flex flex-col items-center lg:items-stretch py-6 px-2 lg:px-4 fixed h-full z-20">
            {/* Logo Area */}
            <div className="mb-8 flex justify-center lg:justify-start px-2">
                <img
                    src="/images/LOGO-FORO/FORO_TP_W.png"
                    alt="Foro Logo"
                    className="h-12 w-auto object-contain rounded-xl"
                />
            </div>

            <Navbar />

            {/* User Profile (Bottom) */}
            <div className="mt-auto px-2 py-4 relative" ref={dropdownRef}>
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute bottom-full left-1 right-1 lg:left-2 lg:right-2 mb-2 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden z-30"
                        >
                            <div className="p-1 lg:p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium group"
                                >
                                    <div className="flex items-center justify-center p-2 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                                        <LuLogOut className="text-lg" />
                                    </div>
                                    <span className="hidden lg:block whitespace-nowrap">ออกจากระบบ</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${isProfileOpen ? 'bg-[#1e293b] ring-1 ring-blue-500/50' : 'hover:bg-[#1e293b]'}`}
                >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
                        {user?.name?.[0]?.toLocaleUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-base font-semibold truncate text-gray-100">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar