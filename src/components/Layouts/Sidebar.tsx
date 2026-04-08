import { useState, useRef, useEffect, useMemo } from "react";
import Navbar, { NAV_ITEMS } from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { LuLogOut } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const mobileNavItems = useMemo(
        () => NAV_ITEMS.filter((item) => !(item as any).mobileOnly),
        [],
    );

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

    useEffect(() => {
        document.body.classList.add('has-mobile-bottom-nav');
        return () => {
            document.body.classList.remove('has-mobile-bottom-nav');
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <aside className="hidden lg:flex w-20 lg:w-60 shrink-0 self-start sticky top-3 h-[calc(100vh-1.5rem)] bg-[#121212]/95 border border-white/5 rounded-[22px] shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl flex-col items-center lg:items-stretch py-6 px-2 lg:px-4 overflow-hidden">
                {/* Logo Area */}
                <div className="mb-8 flex justify-center lg:justify-start px-2 shrink-0">
                    <img
                        src="/images/LOGO-FORO/FORO_TP_W.png"
                        alt="Foro Logo"
                        className="h-12 w-auto object-contain rounded-xl"
                    />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">
                    <Navbar />
                </div>

                {/* User Profile (Bottom) */}
                <div className="mt-auto px-2 py-4 relative shrink-0" ref={dropdownRef}>
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

                <style>{`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </aside>

            <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
                <div className="rounded-[24px] border border-white/8 bg-[#111112]/95 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.55)] px-3 py-3">
                    <div className="flex items-end justify-between gap-1">
                        {mobileNavItems.map((item) => {
                            const active = location.pathname === item.path;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`flex min-w-0 flex-1 flex-col items-center justify-end gap-1 rounded-2xl px-1 py-1.5 transition-all duration-200 ${active ? 'text-sky-400' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${active ? 'bg-blue-600/15 text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.12)]' : 'text-gray-400'}`}>
                                        <span className="text-[21px]">{item.icon}</span>
                                    </span>
                                    <span className={`max-w-full truncate text-[11px] leading-none font-semibold ${active ? 'text-blue-400' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
