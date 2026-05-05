import { useState, useRef, useEffect, useMemo } from "react";
import Navbar, { NAV_ITEMS } from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { LuChevronDown, LuLogOut } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { prototypePlanMock } from "../../api/mocks/prototype";

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
            <aside className="hidden lg:flex w-[288px] shrink-0 self-start h-[calc(100dvh-24px)] bg-[var(--bg-900)] border border-white/5 rounded-[20px] flex-col items-stretch overflow-hidden">
                {/* Logo Area */}
                <div className="flex min-h-20 items-center px-4 py-6 shrink-0">
                    <img
                        src="/images/LOGO-FORO/FORO_TP_W.png"
                        alt="Foro Logo"
                        className="h-9 w-auto object-contain"
                    />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">
                    <Navbar />
                </div>

                {/* User Profile (Bottom) */}
                <div className="mt-auto px-3 pb-3 pt-4 relative shrink-0" ref={dropdownRef}>
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute bottom-full left-3 right-3 mb-2 bg-[#171719]/98 border border-white/8 rounded-[18px] shadow-2xl overflow-hidden z-30"
                            >
                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-[14px] text-rose-300 hover:bg-rose-500/10 transition-colors text-sm font-bold group"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                                            <LuLogOut className="text-lg" />
                                        </div>
                                        <span className="whitespace-nowrap">ออกจากระบบ</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-3 rounded-[18px] border p-2.5 cursor-pointer transition-all duration-200 ${isProfileOpen ? 'border-blue-400/25 bg-[rgba(59,130,246,0.08)]' : 'border-white/8 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.06)]'}`}
                    >
                        <div className="h-16 w-16 shrink-0 rounded-[18px] bg-linear-to-br from-[#203a66] to-[#2f2b62] flex items-center justify-center text-sm font-black shadow-lg shadow-black/20">
                            {user?.name?.[0]?.toLocaleUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-[13px] font-extrabold truncate text-gray-100">{user?.name || prototypePlanMock.name}</p>
                            <p className="text-[11px] font-semibold text-gray-500 truncate">{user?.email || prototypePlanMock.description}</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[10px] font-black text-white">
                            {prototypePlanMock.badge}
                        </span>
                        <LuChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                <style>{`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </aside>

            <div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
                <div className="rounded-[24px] border border-white/8 bg-[#101115]/92 backdrop-blur-2xl shadow-[0_-18px_42px_rgba(0,0,0,0.56)] px-2 py-2">
                    <div className="flex items-end justify-between gap-1">
                        {mobileNavItems.map((item) => {
                            const active = location.pathname === item.path;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`flex min-w-0 flex-1 flex-col items-center justify-end gap-1 rounded-[18px] px-1 py-2 transition-all duration-200 ${active ? 'bg-blue-500/10 text-white shadow-[inset_0_0_0_1px_rgba(96,165,250,0.16)]' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <span className={`flex h-7 w-7 items-center justify-center transition-all duration-200 ${active ? 'text-white' : 'text-gray-400'}`}>
                                        <span className="text-[21px]">{item.icon}</span>
                                    </span>
                                    <span className={`max-w-full truncate text-[10px] leading-none font-bold ${active ? 'text-white' : 'text-gray-400'}`}>
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
