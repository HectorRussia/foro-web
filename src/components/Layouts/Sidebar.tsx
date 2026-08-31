import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronDown, LuLogOut } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { prototypePlanMock } from "../../api/mocks/prototype";
import { useAuth } from "../../contexts/AuthContext";
import ThemeSwitcher from "../ThemeSwitcher";
import Navbar, { NAV_ITEMS } from "./Navbar";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const mobileNavItems = useMemo(
        () => NAV_ITEMS.filter((item) => !item.mobileOnly),
        [],
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileOpen]);

    useEffect(() => {
        document.body.classList.add("has-mobile-bottom-nav");
        return () => {
            document.body.classList.remove("has-mobile-bottom-nav");
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <aside className="root-sidebar hidden lg:flex">
                <div className="root-sidebar-logo">
                    <img
                        src="/images/LOGO-FORO/logo_last.png"
                        alt="Foro Logo"
                        className="h-9 w-auto object-contain"
                    />
                    <div className="app-desktop-theme-control">
                        <ThemeSwitcher />
                    </div>
                </div>

                <div className="root-sidebar-scroll scrollbar-hide">
                    <Navbar />
                </div>

                <div className="root-sidebar-footer" ref={dropdownRef}>
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="root-profile-menu"
                            >
                                <div className="p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-[14px] text-rose-300 hover:bg-rose-500/10 transition-colors text-sm font-bold group"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                                            <LuLogOut className="text-lg" />
                                        </div>
                                        <span className="whitespace-nowrap">
                                            {"\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a"}
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`root-sidebar-profile-panel ${isProfileOpen ? "is-open" : ""}`.trim()}
                        aria-expanded={isProfileOpen}
                    >
                        <span className="root-sidebar-profile-avatar">
                            {user?.name?.[0]?.toLocaleUpperCase() || "U"}
                        </span>
                        <span className="root-sidebar-profile-copy">
                            <span className="root-sidebar-profile-name">
                                {user?.name || prototypePlanMock.name}
                            </span>
                            <span className="root-sidebar-profile-role">
                                {user?.email || prototypePlanMock.description}
                            </span>
                        </span>
                        <span className="root-sidebar-profile-meta">
                            <span className="root-sidebar-profile-badge">{prototypePlanMock.badge}</span>
                            <LuChevronDown
                                className={`root-sidebar-profile-chevron ${isProfileOpen ? "open" : ""}`}
                            />
                        </span>
                    </button>
                </div>

                <style>{`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </aside>

            <div className="app-mobile-theme-control lg:hidden">
                <ThemeSwitcher />
            </div>

            <div className="app-mobile-nav fixed bottom-3 left-3 right-3 z-50 lg:hidden">
                <div className="app-mobile-nav-shell rounded-3xl border border-white/8 bg-[#101115]/92 backdrop-blur-2xl shadow-[0_-18px_42px_rgba(0,0,0,0.56)] px-2 py-2">
                    <div className="flex items-end justify-between gap-1">
                        {mobileNavItems.map((item) => {
                            const active = location.pathname === item.path;
                            const Icon = item.Icon;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`app-mobile-nav-item flex min-w-0 flex-1 flex-col items-center justify-end gap-1 rounded-[18px] px-1 py-2 transition-all duration-200 ${active ? "active bg-blue-500/10 text-white shadow-[inset_0_0_0_1px_rgba(96,165,250,0.16)]" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    <span className={`flex h-7 w-7 items-center justify-center transition-all duration-200 ${active ? "text-white" : "text-gray-400"}`}>
                                        <Icon
                                            size={21}
                                            strokeWidth={active ? 2.15 : 1.95}
                                            fill={active && item.fillActive ? "currentColor" : "none"}
                                        />
                                    </span>
                                    <span className={`max-w-full truncate text-[10px] leading-none font-bold ${active ? "text-white" : "text-gray-400"}`}>
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
